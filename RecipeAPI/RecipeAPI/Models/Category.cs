using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;

namespace RecipeAPI.Models
{
    public class Category
    {
        public long ID { get; set; }

        [ForeignKey("User")]
        public long UserID { get; set; }

        public string Name { get; set; }

        public int Order { get; set; }
        
    }
}
