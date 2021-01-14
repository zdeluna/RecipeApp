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
      //  Task<Dish> UpdateEntireDish(Dish dish);
        Task RemoveAllIngredients(long dishId);
        Task RemoveAllSteps(long dishId);
        Task RemoveAllHistories(long dishId);

    }

    public class DishService : IDishService
    {
        private readonly DatabaseContext _context;
        private readonly IConfiguration _config;
        private readonly IDishRepository _dishRepo;
        private readonly IIngredientRepository _ingredientRepo;
        private readonly IStepRepository _stepRepo;
        private readonly IHistoryRepository _historyRepo;
       

        public DishService(DatabaseContext context, IConfiguration config, IDishRepository dishRepo, IIngredientRepository ingredientRepo, IStepRepository stepRepo, IHistoryRepository historyRepo)
        {
            _context = context;
            _config = config;
            _dishRepo = dishRepo;
            _ingredientRepo = ingredientRepo;
            _stepRepo = stepRepo;
            _historyRepo = historyRepo;

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
/*
        public async Task<Dish> UpdateEntireDish(Dish dish) {
            return await _dishRepo.UpdateAll(dish);
        }*/

        public async Task RemoveAllIngredients(long dishId)
        {
            await _ingredientRepo.RemoveAllIngredients(dishId);
        }

        public async Task RemoveAllSteps(long dishId)
        {
            await _stepRepo.RemoveAllSteps(dishId);
        }

        public async Task RemoveAllHistories(long dishId)
        {
            await _historyRepo.RemoveAllHistories(dishId);
        }


    }
}
