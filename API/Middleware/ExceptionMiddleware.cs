using System.Net;
using System.Text.Json;
using API.Errors;

namespace API.Middleware;

public class ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception exception)
        {
            logger.LogError(exception, exception.Message);
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

            var response = env.IsDevelopment()
                ? new ApiExceptions(context.Response.StatusCode, exception.Message, exception.StackTrace)
                : new ApiExceptions(context.Response.StatusCode, exception.Message, "Internal Server Error");

            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };
            
            var json = JsonSerializer.Serialize(response, options);
            
            await context.Response.WriteAsync(json);
        }
    }
}