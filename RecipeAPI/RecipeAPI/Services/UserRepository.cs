﻿using System;
using RecipeAPI.Models;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc;


namespace RecipeAPI.Services
{

    public interface IUserRepository {
        Task<IEnumerable<User>> GetAllUsers();
        Task<User> GetUserById(long id);
        Task<User> AddUser(User user);
        Task<User> RemoveUser(long id);
        Task<User> GetByUsername(string userName);
        Task<User> Update(JsonPatchDocument<UpdateUserRequest> patchDish, long id, ModelStateDictionary ModelState);
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
            return await GetAll().Include(s => s.Categories).FirstOrDefaultAsync(x => x.ID == id);
        }

        public async Task<User> AddUser(User user)
        {
            return await Add(user);
        }

        public async Task<User> Update(JsonPatchDocument<UpdateUserRequest> patchUser, long id, ModelStateDictionary ModelState)
        {

            var user  = await GetUserById(id);
            var updateUserRequest = _mapper.Map<UpdateUserRequest>(user);

            patchUser.ApplyTo(updateUserRequest, ModelState);

            /*
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }*/

            var updatedUser = _mapper.Map(updateUserRequest, user);
            await SaveUpdate();

            return updatedUser;


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
