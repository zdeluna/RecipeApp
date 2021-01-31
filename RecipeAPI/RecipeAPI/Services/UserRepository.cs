using System;
using RecipeAPI.Models;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using AutoMapper;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using RecipeAPI.Exceptions;

namespace RecipeAPI.Services
{

    public interface IUserRepository {
        Task<IEnumerable<User>> GetAllUsers();
        Task<User> GetUserById(long id);
        Task<User> AddUser(User user);
        Task<User> RemoveUser(long id);
        Task<User> GetByUsername(string userName);
        Task<User> UpdateUser(JsonPatchDocument<UpdateUserRequest> patchUser, long id, ModelStateDictionary ModelState);
    }

    public class UserRepository : Repository<User>, IUserRepository
    {
        private readonly IMapper _mapper;

        public UserRepository(DatabaseContext context, IMapper mapper) : base(context)
        {
            _mapper = mapper;
        }

        public async Task<IEnumerable<User>> GetAllUsers() {
            return await GetAll().Include(s => s.Categories).ToListAsync();
        }

        public async Task<User> GetUserById(long id)
        {
            return await GetAll().Include(s => s.Categories).FirstOrDefaultAsync(x => x.ID == id);
        }

        public async Task<User> AddUser(User user)
        {
            return await Add(user);
        }

        public async Task<User> UpdateUser(JsonPatchDocument<UpdateUserRequest> patchUser, long id, ModelStateDictionary ModelState)
        {

            var user  = await GetUserById(id);

            var updateUserRequest = _mapper.Map<UpdateUserRequest>(user);
          
            patchUser.ApplyTo(updateUserRequest, ModelState);

            if (!ModelState.IsValid)
            {
                throw new BadRequestException($"Bad Request. You attempted to update fields that do not exist for user");
            }

            _mapper.Map(updateUserRequest, user);
            await Update(user);
            return user;
        }

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
