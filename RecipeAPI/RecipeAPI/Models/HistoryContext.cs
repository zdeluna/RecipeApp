using System;
using Microsoft.EntityFrameworkCore;
namespace RecipeAPI.Models
{
    public class HistoryContext : DbContext
    {
        public HistoryContext(DbContextOptions<DishContext> options) : base(options)
        {
        }
        public DbSet<History> History { get; set; }
    }
}
