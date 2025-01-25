using System.Security.Claims;

namespace API.Extensions;

public static class ClaimsPrincipalExtensions
{
    public static string GetUserName(this ClaimsPrincipal user)
    {
        var username = user.FindFirstValue(ClaimTypes.Name);

        if (username is null) throw new Exception("Cannot get username from token");
        
        return username;
    }    
    
    public static int GetUserId(this ClaimsPrincipal user)
    {
        var userid = user.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userid is null) throw new Exception("Cannot get username from token");
        
        var useridint = int.Parse(userid);
        
        return useridint;
    }
}