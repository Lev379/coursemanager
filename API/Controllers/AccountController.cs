using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class AccountController(DataContext context, ITokenService tokenService) : BaseApiController
{
    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
    {
        if (await UserExists(registerDto.Username)) return BadRequest("Username already exists");
        
        using var hmac = new HMACSHA512();

        var user = new AppUser
        {
            UserName = registerDto.Username,
            PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
            PasswordSalt = hmac.Key
        };

        context.Users.Add(user);
        await context.SaveChangesAsync();

        return new UserDto
        {
            Username = user.UserName,
            Token = tokenService.GenerateToken(user)
        };
    }

    private async Task<bool> UserExists(string username)
    {
        return await context.Users.AnyAsync(user => user.UserName.ToLower() == username.ToLower());    
    }
    
    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        var user = await context.Users.FirstOrDefaultAsync(user => user.UserName == loginDto.Username);
        
        if (user is null) return Unauthorized(new { message = "Invalid username" });
        
        using var hmac = new HMACSHA512(user.PasswordSalt);
        var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

        if (computedHash.Where((t, i) => t != user.PasswordHash[i]).Any())
        {
            return Unauthorized("Invalid password");
        }
        
        return new UserDto
        {
            Username = user.UserName,
            Token = tokenService.GenerateToken(user)
        };
    }
}