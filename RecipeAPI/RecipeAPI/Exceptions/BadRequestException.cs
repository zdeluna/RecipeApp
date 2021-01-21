using System;
namespace RecipeAPI.Exceptions
{
    public class BadRequestException:Exception
    {
        public BadRequestException(string message):base(message)
        {
        }
    }
}
