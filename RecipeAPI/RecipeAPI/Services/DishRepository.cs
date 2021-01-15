using System;
using RecipeAPI.Models;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using AutoMapper;

namespace RecipeAPI.Services
{

    public interface IDishRepository
    {
        Task<IEnumerable<Dish>> GetAllDishes(long userId);
        Task<Dish> GetDishById(long id);
        Task<Dish> AddDish(Dish dish);
        Task<Dish> RemoveDish(long id);
        Task<Dish> UpdateAll(UpdateDishRequest dish, long id);
    }

    public class DishRepository : Repository<Dish>, IDishRepository
    {
        private readonly IMapper _mapper;

        public DishRepository(DatabaseContext context, IMapper mapper) : base(context)
        {
            _mapper = mapper;
        }

        public async Task<IEnumerable<Dish>> GetAllDishes(long userId)
        {
            return await GetAll().Include(s => s.History)
                .AsNoTracking()
                .Where(x => x.UserID == userId)
                .ToListAsync();
        }

        public async Task<Dish> GetDishById(long id)
        {
            return await GetAll().Include(s => s.History)
                .Include(s => s.Ingredients)
                .Include(s => s.Steps)
                .AsNoTracking()
                .FirstOrDefaultAsync(m => m.ID == id);
        }

        public async Task<Dish> AddDish(Dish dish)
        {
            return await Add(dish);
        }

        public async Task<Dish> RemoveDish(long id)
        {
            return await RemoveById(id);
        }

        public async Task<Dish> UpdateAll(UpdateDishRequest updatedDish, long id) {

            Console.WriteLine("test");
            Console.WriteLine(id);
            var dish = await GetDishById(id);
            var mappedDish = _mapper.Map(updatedDish, dish);

            
            return mappedDish;
        }
    }
}
