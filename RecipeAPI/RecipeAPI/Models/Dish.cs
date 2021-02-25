using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;

namespace RecipeAPI.Models
{
    public class Dish
    {
        public long ID { get; set; }

        [StringLength(100)]
        public string Name { get; set; }

        [ForeignKey("Category")]
        public long Category { get; set; }

        [StringLength(100)]
        public string CookingTime { get; set; }

        [StringLength(20)]
        public string LastMade { get; set; }

        [StringLength(1000)]
        public string Notes { get; set; }

        [Url]
        public string Url { get; set; }

        [ForeignKey("User")]
        public long UserID { get; set; }

        public List<History> History { get; set; }
        public List<Ingredient> Ingredients { get; set; }
        public List<Step> Steps{ get; set; }

    }
}
