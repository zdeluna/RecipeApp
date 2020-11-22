using System;
using Microsoft.AspNetCore.Authorization;

namespace RecipeAPI.Models
{
    public class Policies
    {
        public const string User = "User";

        public static AuthorizationPolicy UserPolicy()
        {
            return new AuthorizationPolicyBuilder().RequireAuthenticatedUser().RequireRole(User).Build();
        }
    }
}
