using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Microsoft.Data.SqlClient;
using RecipeAPI.Exceptions;


namespace RecipeAPI.Middleware
{
    public class ErrorHandlingMiddleware
    {

        private readonly RequestDelegate _next;

        public ErrorHandlingMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        { 
            try
            {
                await _next(context);
            }

            catch (Exception error)
            {
                var response = context.Response;

                response.ContentType = "application/json";
                var exceptionType = error.GetType();

                if (exceptionType == typeof(NotFoundException))
                {
                    response.StatusCode = (int)HttpStatusCode.NotFound;
                }

                else if (exceptionType == typeof(UnauthorizedException))
                {
                    response.StatusCode = (int)HttpStatusCode.Unauthorized;
                }

                else if (exceptionType == typeof(BadRequestException))
                {
                    response.StatusCode = (int)HttpStatusCode.BadRequest;
                }

                else
                {

                    response.StatusCode = (int)HttpStatusCode.InternalServerError;
                }
      
                    /*
                    case SqlException:
                        {
                            response.StatusCode = (int)HttpStatusCode.InternalServerError;
                            break;
                        };
                    default:
                        {
                            response.StatusCode = (int)HttpStatusCode.InternalServerError;
                            break;
                        };*/
                

                var result = JsonSerializer.Serialize(new { message = error?.Message });
                await response.WriteAsync(result);
            }
        
        
        }
    }
}
