using System;
using System.Linq;
using System.Text;
using System.Web;
using System.Threading.Tasks;
using System.IdentityModel.Tokens.Jwt;
using System.Collections.Generic;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using RecipeAPI.Models;
using RecipeAPI.Services;
using BCrypt;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using RecipeAPI.Exceptions;

namespace RecipeAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoginController : BaseController
    {
        private readonly IConfiguration _config;
        private readonly DatabaseContext _context;
        private readonly IUserService _userService;
        private readonly IAuthService _authService;
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly string DOMAIN_NAME;
       
        public LoginController(IConfiguration config, IWebHostEnvironment hostingEnvironment, DatabaseContext context, IUserService userService, IAuthService authService)
        {
            _config = config;
            _hostingEnvironment = hostingEnvironment;
            _context = context;
            _userService = userService;
            _authService = authService;

            if (hostingEnvironment.EnvironmentName == "Development") {
                DOMAIN_NAME = AuthConstants.DEV_DOMAIN;
            }

            else {
                DOMAIN_NAME = AuthConstants.PROD_DOMAIN;
            }

        }

        
        [HttpPost]
        [Route("refresh")]
        public async Task<IActionResult> Refresh([FromBody] RefreshTokenRequest refreshTokenRequest)
        {
            if (refreshTokenRequest is null)
            {
                return BadRequest("Invalid request: Must provide access token");
            }

            string accessToken = refreshTokenRequest.AccessToken;

            if (Request.Cookies["refresh_token"] == null)
            {
                throw new UnauthorizedException("Not Authorized to Refresh Token");
            }
            
            string refreshToken = Request.Cookies["refresh_token"].ToString();

            var principal = _authService.GetPrincipalFromExpiredToken(accessToken);
            var userName = principal.Identity.Name;

            User user = await _userService.GetByUsername(userName);


            /* If there is no user with the username obtained from the access token or the refresh tokens don't match or 
            there is still time left before the refresh token expires then throw an error */

            if (user == null || user.RefreshToken != refreshToken || user.RefreshTokenExpiryTime >= DateTime.Now)
            { 
                throw new UnauthorizedException("Not Authorized to Refresh Token");
            }

            var newRefreshToken = await CreateUserRefreshToken(user);

            DateTime expiryTimeJWT = DateTime.Now.AddMinutes(AuthConstants.JWT_EXPIRY_MINUTES);
            var newAccessToken = _authService.GenerateJWTToken(user, expiryTimeJWT);

            CreateRefreshTokenCookie(user, refreshToken);

            return new ObjectResult(new
            {
                jwt_token = newAccessToken,
                jwt_token_expiry = expiryTimeJWT,
            });
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody]User login)
        {
            IActionResult response = Unauthorized();
            User user = await _userService.AuthenticateUser(login);
            if (user != null)
            {
                user.LastLoggedIn = DateTime.Now;

                var refreshToken = await CreateUserRefreshToken(user);

                DateTime expiryTimeJWT = DateTime.Now.AddMinutes(AuthConstants.JWT_EXPIRY_MINUTES);

                var accessToken = _authService.GenerateJWTToken(user, expiryTimeJWT);

                CreateRefreshTokenCookie(user, refreshToken);

                response = Ok(new
                {
                    jwt_token = accessToken,
                    jwt_token_expiry = expiryTimeJWT,
                    id = user.ID
                }); 
            }
            return response;
        }

        private async Task<string> CreateUserRefreshToken(User user) {
            var refreshToken = _authService.GenerateRefreshToken();

            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.Now.AddDays(AuthConstants.REFRESH_EXPIRY_DAYS);
            await _context.SaveChangesAsync();

            return refreshToken;

        }

        private void CreateRefreshTokenCookie(User user, string refreshToken) { 
        
                CookieOptions cookieOptions = new CookieOptions();
                cookieOptions.Expires = user.RefreshTokenExpiryTime; 
                cookieOptions.HttpOnly = true;
                cookieOptions.Domain = DOMAIN_NAME;
        
                HttpContext.Response.Cookies.Append("refresh_token", refreshToken, cookieOptions);
        }
    }
}
