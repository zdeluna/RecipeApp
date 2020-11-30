using System;
namespace RecipeAPI.Models
{
    public class Ingredient
    {
        public long ID { get; set; }


        public long DishID { get; set; }
        public string Name { get; set; }
    }
}
