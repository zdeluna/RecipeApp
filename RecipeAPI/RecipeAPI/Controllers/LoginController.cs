﻿using System;
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

            var principal = _userService.GetPrincipalFromExpiredToken(accessToken);
            var userName = principal.Identity.Name;
            Console.WriteLine("username: " + userName);

            User user = await _userService.GetByUsername(userName);


            /* If there is no user with the username obtained from the access token or the refresh tokens don't match or 
            there is still time left before the refresh token expires then throw an error */

            if (user == null || user.RefreshToken != refreshToken || user.RefreshTokenExpiryTime <= DateTime.Now)
            { 
                throw new UnauthorizedException("Not Authorized to Refresh Token");
            }

            var newRefreshToken = _userService.GenerateRefreshToken();

            user.RefreshToken = newRefreshToken;

            user.RefreshTokenExpiryTime = DateTime.Now.AddDays(7);

            await _context.SaveChangesAsync();

            var newAccessToken = _userService.GenerateJWTToken(user, 1);
            DateTime expiryTimeJWT = DateTime.Now.AddMinutes(1);

            CookieOptions cookieOptions = new CookieOptions();
            cookieOptions.Expires = user.RefreshTokenExpiryTime;
            cookieOptions.HttpOnly = true;

            HttpContext.Response.Cookies.Append("refresh_token", newRefreshToken, cookieOptions);

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
                var refreshToken = _userService.GenerateRefreshToken();

                user.RefreshToken = refreshToken;
                user.RefreshTokenExpiryTime = DateTime.Now.AddMinutes(2);

                await _context.SaveChangesAsync();


                DateTime expiryTimeJWT = DateTime.Now.AddMinutes(1);

                var accessToken = _userService.GenerateJWTToken(user, 1);

                CookieOptions cookieOptions = new CookieOptions();
                cookieOptions.Expires = user.RefreshTokenExpiryTime; 
                cookieOptions.HttpOnly = true;


                HttpContext.Response.Cookies.Append("refresh_token", refreshToken, cookieOptions);
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
