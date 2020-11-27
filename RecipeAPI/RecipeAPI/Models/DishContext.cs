using System;
using Microsoft.EntityFrameworkCore;

namespace RecipeAPI.Models
{
    public class DishContext : DbContext
    {
        public DishContext(DbContextOptions<DishContext> options) : base(options)
        {
        }
        public DbSet<Dish> Dishes { get; set; }
        public DbSet<History> History { get; set; }
    }
}
