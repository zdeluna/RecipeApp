using System;
using RecipeAPI.Models;
using System.Linq;

namespace RecipeAPI.Services
{
    public interface IUserService
    {
        bool UserExistsWithUserName(string userName);

    }


    public class UserService : IUserService
    {
        private readonly DatabaseContext _context;

        public UserService(DatabaseContext context)
        {
            _context = context;
            
        }

        public bool UserExistsWithUserName(string username)
        {
            return _context.Users.Any(e => e.UserName == username);
        }
    }
}
