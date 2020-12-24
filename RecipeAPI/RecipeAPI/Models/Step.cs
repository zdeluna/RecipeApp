using System;
using System.Collections.Generic;
namespace RecipeAPI.Models
{
    public class Step
    {
        public long ID { get; set; }


        public long DishID { get; set; }
        public string Name { get; set; }
    }
}
