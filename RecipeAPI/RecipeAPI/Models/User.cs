﻿using System;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace RecipeAPI.Models
{
    public class User
    {
        public long ID { get; set; }

        public string UserName { get; set; }
        public string Password { get; set; }
        public string UserRole { get; set; }
        public DateTime LastLoggedIn { get; set; }

        public List<Category> Categories { get; set; }

        public string RefreshToken { get; set; }
        public DateTime RefreshTokenExpiryTime { get; set; }

    }

}
