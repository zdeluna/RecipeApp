using System;
using System.Collections.Generic;

namespace RecipeAPI.Models
{
    public class UpdateCategoryRequest
    {
        public string Name { get; set; }

        public int Order { get; set; }
    }
}
