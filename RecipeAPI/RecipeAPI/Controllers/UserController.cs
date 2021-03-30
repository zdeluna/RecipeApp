using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using BCrypt;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.Extensions.Configuration;
using RecipeAPI.Services;
using RecipeAPI.Models;
using Microsoft.AspNetCore.JsonPatch;

namespace RecipeAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IConfiguration _config;
        private readonly IUserService _userService;

        public UserController(IConfiguration config, IMapper mapper, IUserService userService)
        {
            _mapper = mapper;
            _config = config;
            _userService = userService;
        }

        // GET: api/User
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            var users = await _userService.GetAll();
            return Ok(users);
        }

        // GET: api/User/5
        [HttpGet("{id}")]
        [Authorize(Policy = Policies.User)]
        public async Task<ActionResult<User>> GetUser(long id)
        {
            var user = await _userService.GetById(id);

            return Ok(user);
        }

        // POST: api/User
        [HttpPost]
        public async Task<ActionResult<User>> PostUser(User user)
        {
            if (_userService.UserExistsWithUserName(user.UserName) == true)
            {
                return BadRequest("User already exists.");
            }

            await _userService.Add(user);

            var accessToken = _userService.GenerateJWTToken(user, 15);

            var response = _mapper.Map<UserResponse>(user);
            response.AccessToken = accessToken;

            return CreatedAtAction("GetUser", new { id = user.ID, accessToken = accessToken }, response);
        }

        // PATCH: api/User/5
        [HttpPatch("{id}")]
        [Authorize(Policy = Policies.User)]
        public async Task<ActionResult<UpdateUserRequest>> PatchUser(long id, [FromBody] JsonPatchDocument<UpdateUserRequest> patchUser)
        {
            if (patchUser != null)
            {
                var user = await _userService.GetById(id);

                //_dishService.VerifyUser(GetUserId(), dish.ID);

                await _userService.Update(patchUser, id, ModelState);

                return NoContent();
            }
            else
            {
                return BadRequest(ModelState);
            }


        }

        // DELETE: api/User/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<User>> DeleteUser(long id)
        {
            var deletedUser = await _userService.Remove(id);

            return deletedUser;
        }
    }

}
