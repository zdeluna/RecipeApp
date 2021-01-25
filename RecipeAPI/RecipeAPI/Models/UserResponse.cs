using System;
using System.Collections.Generic;

namespace RecipeAPI.Models
{
    public class UserResponse
    {
        public long ID { get; set; }

        public string UserName { get; set; }

        public string Token { get; set; }

        public DateTime LastLoggedIn { get; set; }
        
        public ICollection<Category> Categories { get; set; }

    }
}
