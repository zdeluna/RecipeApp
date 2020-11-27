using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;

namespace RecipeAPI.Controllers
{
    public abstract class BaseController : ControllerBase
    {
        protected int GetUserId()
        {
            return int.Parse(this.User.Claims.First(i => i.Type == "UserID").Value);
        }
    }
}
