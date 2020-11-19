using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;

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

        [ForeignKey("User")]
        public long UserId { get; set; }

        //public virtual ICollection<String> History { get; set; }
    }
}
