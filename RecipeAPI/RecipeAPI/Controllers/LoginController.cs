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
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody]User login)
        {
            IActionResult response = Unauthorized();
            User user = await _userService.AuthenticateUser(login);
            if (user != null)
            {

                user.LastLoggedIn = DateTime.Now;
                await _context.SaveChangesAsync();

                var tokenString = _userService.GenerateJWTToken(user);
                response = Ok(new
                {
                    token = tokenString
                });
            }
            return response;
        }
    }
}
