using System;
using System.Collections.Generic;

namespace RecipeAPI.Models
{
    public class UpdateUserRequest
    {
        public ICollection<Category> Categories { get; set; }
    }
}
