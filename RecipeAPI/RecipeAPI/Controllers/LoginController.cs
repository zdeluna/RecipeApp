using System;
using System.Linq;
using System.Text;
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


namespace RecipeAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoginController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly DatabaseContext _context;
        private readonly IUserService _userService;

        public LoginController(IConfiguration config, DatabaseContext context, IUserService userService)
        {
            _config = config;
            _context = context;
            _userService = userService;
        }

        
        [HttpPost]
        [Route("refresh")]
        public async Task<IActionResult> Refresh([FromBody] RefreshTokenRequest refreshTokenRequest)
        {
            Console.WriteLine("Refresh");
            if (refreshTokenRequest is null)
            {
                return BadRequest("Invalid request: Must provide access and refresh tokens");
            }

            string accessToken = refreshTokenRequest.AccessToken;
            string refreshToken = refreshTokenRequest.RefreshToken;
            Console.Write("access token: " + accessToken);
            Console.Write("refresh token: " + refreshToken);

            var principal = _userService.GetPrincipalFromExpiredToken(accessToken);
            var userName = principal.Identity.Name;
            Console.WriteLine("username: " + userName);

            User user = await _userService.GetByUsername(userName);


            /* If there is no user with the username obtained from the access token or the refresh tokens don't match or 
            there is still time left before the refresh token expires then throw an error */

            if (user == null || user.RefreshToken != refreshToken || user.RefreshTokenExpiryTime <= DateTime.Now)
            { 
                return BadRequest("Invalid request: User does not exist");
            }

            var newAccessToken = _userService.GenerateJWTToken(user);
            var newRefreshToken = _userService.GenerateRefreshToken();

            user.RefreshToken = newRefreshToken;
            await _context.SaveChangesAsync();

            return new ObjectResult(new
            {
                accessToken = newAccessToken,
                refreshToken = newRefreshToken
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
                var refreshToken = _userService.GenerateRefreshToken();

                user.RefreshToken = refreshToken;

                user.RefreshTokenExpiryTime = DateTime.Now.AddDays(7);

                await _context.SaveChangesAsync();


                DateTime expiryTimeJWT = DateTime.Now.AddMinutes(15);

                var accessToken = _userService.GenerateJWTToken(user);
                HttpContext.Response.Cookies.Append("refresh_token", refreshToken, new CookieOptions() { HttpOnly = true });

                response = Ok(new
                {
                    jwt_token = accessToken,
                    jwt_token_expiry = expiryTimeJWT,
                    id = user.ID
                }); 
            }
            return response;
        }
    }
}
