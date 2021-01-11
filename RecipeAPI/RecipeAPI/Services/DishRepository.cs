using System;
using RecipeAPI.Models;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace RecipeAPI.Services
{

    public interface IDishRepository
    {
        Task<IEnumerable<Dish>> GetAllDishes();
        Task<Dish> GetDishById(long id);
        Task<Dish> AddDish(Dish dish);
        Task<Dish> RemoveDish(long id);
    }

    public class DishRepository : Repository<Dish>, IDishRepository
    {
        public DishRepository(DatabaseContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Dish>> GetAllDishes()
        {
            return await GetAll();
        }

        public async Task<Dish> GetDishById(long id)
        {
            return await GetById(id);
        }

        public async Task<Dish> AddDish(Dish dish)
        {
            return await Add(dish);
        }

        public async Task<Dish> RemoveDish(long id)
        {
            return await Remove(id);
        }
    }
}
