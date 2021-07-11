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
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using RecipeAPI.Exceptions;

namespace RecipeAPI.Services
{
    public interface IDishService
    {
        Task<IEnumerable<Dish>> GetAll(long userId);
        Task<Dish> GetById(long id);
        Task<Dish> Add(Dish dish);
        Task<Dish> Remove(long id);
        Task<Dish> UpdateEntireDish(long dishId, UpdateDishRequest updatedDishRequest);
        Task<Dish> UpdatePartOfDish(long dishId, JsonPatchDocument<UpdateDishRequest> patchDish, ModelStateDictionary ModelState);
        Task RemoveAllIngredients(long dishId);
        Task RemoveAllSteps(long dishId);
        Task RemoveAllHistories(long dishId);
        bool VerifyUser(long userId, long dishId);

    }

    public class DishService : IDishService
    {
        private readonly DatabaseContext _context;
        private readonly IConfiguration _config;
        private readonly IDishRepository _dishRepo;
        private readonly IIngredientRepository _ingredientRepo;
        private readonly IStepRepository _stepRepo;
        private readonly IHistoryRepository _historyRepo;
       


        public DishService(IDishRepository dishRepo, IIngredientRepository ingredientRepo, IStepRepository stepRepo, IHistoryRepository historyRepo) 
        {
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
            var dish = await _dishRepo.GetDishById(id);
            if (dish == null)
                throw new NotFoundException($"Dish with ID {id} not found");
            return dish;
        }

        public async Task<Dish> Add(Dish dish)
        {
            Console.Write(dish);
            return await _dishRepo.AddDish(dish);
        }

        public async Task<Dish> Remove(long id)
        {
            await RemoveAllIngredients(id);
            await RemoveAllSteps(id);
            await RemoveAllHistories(id);

            return await _dishRepo.RemoveDish(id);
        }

        public async Task<Dish> UpdateEntireDish(long dishId, UpdateDishRequest updatedDishRequest) {

            Console.WriteLine("Update entire dish");
            // If the user is updating ingredients
            if (updatedDishRequest.Ingredients != null)
            {
                await RemoveAllIngredients(dishId);
            };

            // If the user is updating steps
            if (updatedDishRequest.Steps != null)
            {
                await RemoveAllSteps(dishId);
            };

            // If the user is updating the history

            if (updatedDishRequest.History != null)
            {
                await RemoveAllHistories(dishId);
            };

            return await _dishRepo.UpdateAll(updatedDishRequest, dishId);
        }

        public async Task<Dish> UpdatePartOfDish(long dishId, JsonPatchDocument<UpdateDishRequest> patchDish, ModelStateDictionary ModelState)
        {
            return await _dishRepo.UpdatePartOfDish(patchDish, dishId, ModelState);
        }

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

        public bool VerifyUser(long userId, long dishId)
        {
            if (userId != dishId)
                throw new UnauthorizedException("User does not have access to modify/access dish");

            return true;
        }
    }
}
