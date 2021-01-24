using System;
using RecipeAPI.Models;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace RecipeAPI.Services
{

    public interface ICategoryRepository
    {
        Task<bool> RemoveAllCategories(long userId);

    }

    public class CategoryRepository : Repository<Category>, ICategoryRepository
    {
        public CategoryRepository(DatabaseContext context) : base(context)
        {
        }

        private async Task<IEnumerable<Category>> GetAllCategories(long userId)
        {
            return await GetAll().Where(x => x.UserID == userId).ToListAsync();
        }



        public async Task<bool> RemoveAllCategories(long userId)
        {
            var categories = await GetAllCategories(userId);
            foreach (var category in categories)
            {
                await Remove(category);
            }

            return true;
        }

    }
}