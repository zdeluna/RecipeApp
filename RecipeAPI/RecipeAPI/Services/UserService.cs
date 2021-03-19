using System;
using RecipeAPI.Models;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using BCrypt;
using RecipeAPI.Exceptions;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.JsonPatch;
using System.Security.Cryptography;


namespace RecipeAPI.Services
{
    public interface IUserService
    {
        bool UserExistsWithUserName(string userName);
        bool UserExistsWithID(long id);
        string GenerateJWTToken(User user);
        string GenerateRefreshToken();
        ClaimsPrincipal GetPrincipalFromExpiredToken(string token);
        string HashPassword(string password);
        Task<User> AuthenticateUser(User loginCredentials);
        Task<IEnumerable<User>> GetAll();
        Task<User> GetById(long id);
        Task<User> Add(User user);
        Task<User> Remove(long id);
        Task<User> Update(JsonPatchDocument<UpdateUserRequest> patchUser, long id, ModelStateDictionary ModelState);

    }

    public class UserService : IUserService
    {
        private readonly DatabaseContext _context;
        private readonly IConfiguration _config;
        private readonly IUserRepository _userRepo;
        private readonly ICategoryRepository _categoryRepo;

        public UserService(DatabaseContext context, IConfiguration config, IUserRepository userRepo, ICategoryRepository categoryRepo)
        {
            _context = context;
            _config = config;
            _userRepo = userRepo;
            _categoryRepo = categoryRepo;
              
        }

        public async Task<IEnumerable<User>> GetAll() {
            return await _userRepo.GetAllUsers();
        }

        public async Task<User> GetById(long id) {
            var user = await _userRepo.GetUserById(id);
            if (user == null)
                throw new NotFoundException($"User with ID {id} not found");
            
            return user;
            
        }

        public async Task<User> Add(User user) {
            user.Password = HashPassword(user.Password);

            var newUser = await _userRepo.AddUser(user);
            
            var categories = new Category[]
            {
                new Category{UserID=newUser.ID, Name="Dinner", Order=0},
                new Category{UserID=newUser.ID, Name="Lunch", Order=1},
                new Category{UserID=newUser.ID, Name="Breakfast", Order=2},
                new Category{UserID=newUser.ID, Name="Fast Meals", Order=3},
                new Category{UserID=newUser.ID, Name="Salads", Order=4},
            };

            await _categoryRepo.AddCategories(categories);

            return newUser;

        }

        public async Task<User> Update(JsonPatchDocument<UpdateUserRequest> patchUser, long id, ModelStateDictionary ModelState)
        {
            return await _userRepo.UpdateUser(patchUser, id, ModelState);
        }


        public async Task<User> Remove(long id) {
            await GetById(id);

            return await _userRepo.RemoveUser(id);
        }

        public bool UserExistsWithUserName(string username)
        {
            return _context.Users.Any(e => e.UserName == username);
        }

        public bool UserExistsWithID(long id)
        {
            return _context.Users.Any(e => e.ID == id);
        }

        public async Task<User> AuthenticateUser(User loginCredentials)
        {
            User user = await _userRepo.GetByUsername(loginCredentials.UserName);
            if (user == null) return null;

            if (BCrypt.Net.BCrypt.Verify(loginCredentials.Password, user.Password))
            {
                return user;
            }

            return null;
        }

        public string GenerateJWTToken(User user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:SecretKey"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                new Claim("role", user.UserRole),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim("UserID", user.ID.ToString())
            };


            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(60),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);

        }

        public string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];

            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);
                return Convert.ToBase64String(randomNumber);
            }
        
        }

        public ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = false,
                ValidateIssuer = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:SecretKey"])),
                ValidateLifetime = false
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            SecurityToken securityToken;

            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out securityToken);
            var jwtSecurityToken = securityToken as JwtSecurityToken;

            if (jwtSecurityToken == null || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                throw new SecurityTokenException("Invalid token");

            return principal;
        }


        public string HashPassword(string password) {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }
    }
}
