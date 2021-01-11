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
    public interface IDishService
    {
        Task<IEnumerable<Dish>> GetAll();
        Task<Dish> GetById(long id);
        Task<Dish> Add(Dish dish);
        Task<Dish> Remove(long id);

    }

    public class DishService : IDishService
    {
        private readonly DatabaseContext _context;
        private readonly IConfiguration _config;
        private readonly IDishRepository _repo;

        public DishService(DatabaseContext context, IConfiguration config, IDishRepository repo)
        {
            _context = context;
            _config = config;
            _repo = repo;

        }

        public async Task<IEnumerable<Dish>> GetAll()
        {
            return await _repo.GetAllDishes();
        }

        public async Task<Dish> GetById(long id)
        {
            return await _repo.GetDishById(id);
        }

        public async Task<Dish> Add(Dish dish)
        {
            return await _repo.AddDish(dish);
        }

        public async Task<Dish> Remove(long id)
        {
            return await _repo.RemoveDish(id);
        } 
}
