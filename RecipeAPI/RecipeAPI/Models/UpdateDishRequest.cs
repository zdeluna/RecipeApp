using System;
using System.Collections.Generic;
namespace RecipeAPI.Models
{
    public class UpdateDishRequest
    {
        public string Name { get; set; }
        public long Category { get; set; }
        public string CookingTime { get; set; }
        public string LastMade { get; set; }
        public string Notes { get; set; }
        public string Url { get; set; }

        public List<string> History { get; set; }
    }
}
