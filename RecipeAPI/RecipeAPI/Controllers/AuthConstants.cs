using System;
namespace RecipeAPI.Controllers
{
    internal static class AuthConstants
    {
        internal const int JWT_EXPIRY_MINUTES = 15;
        internal const int REFRESH_EXPIRY_DAYS = 7;
        internal const string DEV_DOMAIN = "https://localhost";
        internal const string PROD_DOMAIN = "us-central1-recipescheduler-227221";
    }
};