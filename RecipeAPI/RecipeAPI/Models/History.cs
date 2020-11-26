using System;
namespace RecipeAPI.Models
{
    public class History
    {
        public long ID { get; set; }
        public long DishID { get; set; }
        public string Date { get; set; }

        public Dish Dish { get; set; }
    }
}
