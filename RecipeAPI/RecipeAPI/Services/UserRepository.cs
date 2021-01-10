using System;
using RecipeAPI.Models;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace RecipeAPI.Services
{

    public interface IUserRepository {
        Task<IEnumerable<User>> GetAllUsers();
    }

    public class UserRepository : Repository<User>, IUserRepository
    {
        public UserRepository(DatabaseContext context) : base(context)
        {
        }

        public async Task<IEnumerable<User>> GetAllUsers() {
            return await GetAll();
        }
    }
}
