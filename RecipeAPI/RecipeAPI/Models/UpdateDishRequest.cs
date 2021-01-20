using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
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

        [Url]
        public string Url { get; set; }

        public List<string> History { get; set; }
        public List<string> Ingredients { get; set; }
        public List<string> Steps { get; set; }
    }
}
