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
        Task<IEnumerable<Dish>> GetAll(long userId);
        Task<Dish> GetById(long id);
        Task<Dish> Add(Dish dish);
        Task<Dish> Remove(long id);
        Task<Dish> UpdateEntireDish(Dish dish);

    }

    public class DishService : IDishService
    {
        private readonly DatabaseContext _context;
        private readonly IConfiguration _config;
        private readonly IDishRepository _dishRepo;
        private readonly IIngredientRepository _ingredientRepo;

        public DishService(DatabaseContext context, IConfiguration config, IDishRepository dishRepo, IIngredientRepository ingredientRepo)
        {
            _context = context;
            _config = config;
            _dishRepo = dishRepo;
            _ingredientRepo = ingredientRepo;

        }

        public async Task<IEnumerable<Dish>> GetAll(long userId)
        {
            return await _dishRepo.GetAllDishes(userId);
        }

        public async Task<Dish> GetById(long id)
        {
            return await _dishRepo.GetDishById(id);
        }

        public async Task<Dish> Add(Dish dish)
        {
            return await _dishRepo.AddDish(dish);
        }

        public async Task<Dish> Remove(long id)
        {
            return await _dishRepo.RemoveDish(id);
        }

        public async Task<Dish> UpdateEntireDish(Dish dish) {
            return await _dishRepo.UpdateAll(dish);
        }

        public async Task RemoveAllIngredients(long dishId)
        {
            return await _ingredientRepo.RemoveAllIngredients(dishId);
        }


    }
}
