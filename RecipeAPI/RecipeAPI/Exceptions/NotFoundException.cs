using System;
namespace RecipeAPI.Exceptions
{
    public class NotFoundException:Exception
    {
        public NotFoundException(string message):base(message)
        {
        }
    }
}
