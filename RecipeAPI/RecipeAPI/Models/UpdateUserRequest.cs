using System;
using System.Collections.Generic;


namespace RecipeAPI.Models
{
    public class UpdateUserRequest
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        public string UserRole { get; set; }
        public DateTime LastLoggedIn { get; set; }

        public List<UpdateCategoryRequest> Categories { get; set; }
    }
}