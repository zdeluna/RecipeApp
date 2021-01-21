using System;
namespace RecipeAPI.Exceptions
{
    public class DatabaseErrorException:Exception
    {
        public DatabaseErrorException(string message):base(message)
        {
        }
    }
}
