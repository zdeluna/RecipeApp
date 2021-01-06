using System;
namespace RecipeAPI.Services
{
    public interface IUserService
    {
        bool IsAnExistingUser(string userName);
    }


    public class UserService : IUserService
    {
        public UserService()
        {
            
        }

        public bool IsAnExistingUser(string userName) {
            return true;
        }
    }
}
