using System;
namespace RecipeAPI.Models
{
    public class User
    {
        public long ID { get; set; }
       
        public string UserName { get; set; }
        public string Password { get; set; }
        public string UserRole { get; set; }
        public DateTime LastLoggedIn { get; set; }
    }
}
