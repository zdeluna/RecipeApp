using System;
using RecipeAPI.Models;
using System.Linq;
using System.Text;
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
        Task<bool> UserExistsWithUserName(string userName);
        Task<bool> UserExistsWithID(long id);
        string HashPassword(string password);
        Task<User> AuthenticateUser(User loginCredentials);
        Task<IEnumerable<User>> GetAll();
        Task<User> GetById(long id);
        Task<User> GetByUsername(string username);
        Task<User> Add(User user);
        Task<User> Remove(long id);
        Task<User> Update(JsonPatchDocument<UpdateUserRequest> patchUser, long id, ModelStateDictionary ModelState);
    }

    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepo;
        private readonly ICategoryRepository _categoryRepo;

        public UserService(IUserRepository userRepo, ICategoryRepository categoryRepo)
        {
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

        public async Task<User> GetByUsername(string username)
        {
            User user = await _userRepo.GetByUsername(username);
            if (user == null)
                throw new NotFoundException($"User with Username {username} not found");

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

        public async Task<bool> UserExistsWithUserName(string username)
        {
            var user = await _userRepo.GetByUsername(username);
            if (user != null) return true;
            
            return false;
        }

        public async Task<bool> UserExistsWithID(long id)
        {
            var user = await _userRepo.GetUserById(id);
            if (user != null) return true;

            return false;
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

        public string HashPassword(string password) {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }
    }
}
