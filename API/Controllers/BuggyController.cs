using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class BuggyController(DataContext context) : BaseApiController
{
    [Authorize]
    [HttpGet("auth")]
    public ActionResult<string> GetAuth()
    {
        return "Secret text";
    }     
    
    [HttpGet("not-found")]
    public ActionResult<AppUser> GetNotFound()
    {
        var notExisting = context.Users.Find(-1);
        
        if (notExisting is null) return NotFound();
        
        return notExisting;
    }     
    
    [HttpGet("server-error")]
    public ActionResult<AppUser> GetServerError()
    {
        var throwsException = context.Users.Find(-1) ?? throw new Exception("An exception has been thrown");
        return throwsException;
    }     
    
    [HttpGet("bad-request")]
    public ActionResult<string> GetBadRequest()
    {
        return BadRequest("This was not a good request");
    }     
}