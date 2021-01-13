using System;
using RecipeAPI.Models;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace RecipeAPI.Services
{

    public interface IIngredientRepository
    {
        Task<bool> RemoveAllIngredients(long dishId);
        
    }

    public class IngredientRepository : Repository<Ingredient>, IIngredientRepository
    {
        public IngredientRepository(DatabaseContext context) : base(context)
        {
        }

        private async Task<IEnumerable<Ingredient>> GetAllIngredients(long dishId)
        {
            return await GetAll().Where(x => x.DishID == dishId).ToListAsync();
        }   

        public async Task<bool> RemoveAllIngredients(long dishId)
        {
            var ingredients = await GetAllIngredients(dishId);
            foreach (var ingredient in ingredients)
            {
                await Remove(ingredient);
            }

            return true;
        }

    }
}

