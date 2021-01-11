using System;
using RecipeAPI.Models;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace RecipeAPI.Services
{

    public interface IUserRepository {
        Task<IEnumerable<User>> GetAllUsers();
        Task<User> GetUserById(long id);
        Task<User> AddUser(User user);
        Task<User> RemoveUser(long id);
    }

    public class UserRepository : Repository<User>, IUserRepository
    {
        public UserRepository(DatabaseContext context) : base(context)
        {
        }

        public async Task<IEnumerable<User>> GetAllUsers() {
            return await GetAll();
        }

        public async Task<User> GetUserById(long id)
        {
            return await GetById(id);
        }

        public async Task<User> AddUser(User user)
        {
            return await Add(user);
        }

        public async Task<User> RemoveUser(long id)
        {
            return await Remove(id);
        }
    }
}
