using System;
using RecipeAPI.Models;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace RecipeAPI.Services
{

    public interface IStepRepository
    {
        Task<bool> RemoveAllSteps(long dishId);

    }

    public class StepRepository : Repository<Step>, IStepRepository
    {
        public StepRepository(DatabaseContext context) : base(context)
        {
        }

        private async Task<IEnumerable<Step>> GetAllSteps(long dishId)
        {
            return await GetAll().Where(x => x.DishID == dishId).ToListAsync();
        }

        public async Task<bool> RemoveAllSteps(long dishId)
        {
            var steps = await GetAllSteps(dishId);
            foreach (var step in steps)
            {
                await Remove(step);
            }

            return true;
        }

    }
}
