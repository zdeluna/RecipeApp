using System;
namespace RecipeAPI.Exceptions
{
    public class UnauthorizedException:Exception
    {
        public UnauthorizedException(string message):base(message)
        {
        }
    }
}
