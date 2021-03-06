﻿using System;
using Microsoft.EntityFrameworkCore;

namespace RecipeAPI.Models
{
    public class DatabaseContext : DbContext
    {
        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options)
        {
        }
        public DbSet<Dish> Dishes { get; set; }
        public DbSet<History> History { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Ingredient> Ingredients { get; set; }
        public DbSet<Step> Steps { get; set; }
    }
}
