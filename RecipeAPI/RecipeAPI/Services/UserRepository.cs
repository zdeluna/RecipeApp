using System;
using RecipeAPI.Models;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using AutoMapper;

namespace RecipeAPI.Services
{

    public interface IUserRepository {
        Task<IEnumerable<User>> GetAllUsers();
        Task<User> GetUserById(long id);
        Task<User> AddUser(User user);
        Task<User> RemoveUser(long id);
        Task<User> GetByUsername(string userName);
    }

    public class UserRepository : Repository<User>, IUserRepository
    {
        private readonly IMapper _mapper;

        public UserRepository(DatabaseContext context, IMapper mapper) : base(context)
        {
            mapper = _mapper;
        }

        public async Task<IEnumerable<User>> GetAllUsers() {
            return await GetAll().Include(s => s.Categories).ToListAsync();
        }

        public async Task<User> GetUserById(long id)
        {
            return await GetAll().FirstOrDefaultAsync(x => x.ID == id);
        }

        public async Task<User> AddUser(User user)
        {
            return await Add(user);
        }

        /*
        public async Task<Dish> UpdateAll(UpdateUserRequest updatedUser, long id)
        {

            var dish = await GetUserById(id);
            var mappedDish = _mapper.Map(updatedDish, dish);

            await SaveUpdate();

            return mappedDish;
        }*/

        public async Task<User> RemoveUser(long id)
        {
            return await RemoveById(id);
        }

        public async Task<User> GetByUsername(string userName)
        {
            return await GetAll().SingleOrDefaultAsync(x => x.UserName == userName);
        }
    }
}
