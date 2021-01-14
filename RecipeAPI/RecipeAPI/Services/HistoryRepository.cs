using System;
using RecipeAPI.Models;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace RecipeAPI.Services
{

    public interface IHistoryRepository
    {
        Task<bool> RemoveAllHistories(long dishId);

    }

    public class HistoryRepository : Repository<History>, IHistoryRepository
    {
        public HistoryRepository(DatabaseContext context) : base(context)
        {
        }

        private async Task<IEnumerable<History>> GetAllHistories(long dishId)
        {
            return await GetAll().Where(x => x.DishID == dishId).ToListAsync();
        }

        public async Task<bool> RemoveAllHistories(long dishId)
        {
            var histories = await GetAllHistories(dishId);
            foreach (var history in histories)
            {
                await Remove(history);
            }

            return true;
        }

    }
}