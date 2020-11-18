using System;
namespace RecipeAPI.Models
{
    public class Dish
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public long Category { get; set; }
        public string CookingTime { get; set; }
        public string LastMade { get; set; }
        public string Notes { get; set; }
        public string Url { get; set; }
        public string UserId { get; set; }
        public string[] History { get; set; }
    }
}
