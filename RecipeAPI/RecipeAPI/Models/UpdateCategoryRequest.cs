using System;
using System.Collections.Generic;

namespace RecipeAPI.Models
{
    public class UpdateCategoryRequest
    {
        public long ID { get; set; }

        public long UserID { get; set; }

        public string Name { get; set; }

        public int Order { get; set; }
    }
}
