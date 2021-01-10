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


namespace RecipeAPI.Services
{
    public interface IUserService
    {
        bool UserExistsWithUserName(string userName);
        bool UserExistsWithID(long id);
        string GenerateJWTToken(User user);
        string HashPassword(string password);
        Task<IEnumerable<User>> GetAll();
        Task<User> GetById(long id);
        Task<User> Add(User user);
        Task<User> Remove(long id); 

    }

    public class UserService : IUserService
    {
        private readonly DatabaseContext _context;
        private readonly IConfiguration _config;
        private readonly IUserRepository _repo;

        public UserService(DatabaseContext context, IConfiguration config, IUserRepository repo)
        {
            _context = context;
            _config = config;
            _repo = repo;
              
        }

        public async Task<IEnumerable<User>> GetAll() {
            return await _repo.GetAllUsers();
        }

        public async Task<User> GetById(long id) {
            return await _context.Users.FindAsync(id);
        }

        public async Task<User> Add(User user) {
            user.Password = HashPassword(user.Password);
            _context.Users.Add(user);

            
            await _context.SaveChangesAsync();

            return await _context.Users.FindAsync(user.ID);
        }

        public async Task<User> Remove(long id) {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return null;
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return user;

        }

        public bool UserExistsWithUserName(string username)
        {
            return _context.Users.Any(e => e.UserName == username);
        }

        public bool UserExistsWithID(long id)
        {
            return _context.Users.Any(e => e.ID == id);
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

        public string HashPassword(string password) {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }
    }
}
