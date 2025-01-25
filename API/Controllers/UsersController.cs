using System.Security.Claims;
using System.Text.Json;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
public class UsersController(IUserRepository userRepository, IMapper mapper, IPhotoService photoService)
    : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers([FromQuery]UserParams userParams)
    {
        userParams.CurrentUsername = User.GetUserName();
        var users = await userRepository.GetMembersAsync(userParams);
        
        Response.AddPaginationHeader(users);

        return Ok(users);
    }

    [HttpGet("{username}")]
    public async Task<ActionResult<MemberDto>> GetUser(string username)
    {
        var user = await userRepository.GetMemberByUsernameAsync(username);

        if (user is null) return NotFound();

        return Ok(user);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<MemberDto>> GetUserById(int id)
    {
        var user = await userRepository.GetMemberByIdAsync(id);

        if (user is null) return NotFound();

        return Ok(user);
    }

    [HttpPut]
    public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUserName());

        if (user is null) return BadRequest("Could not find user");

        mapper.Map(memberUpdateDto, user);

        if (await userRepository.SaveAllAsync()) return NoContent();

        return BadRequest("Updating user failed");
    }

    [HttpPost("add-photo")]
    public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUserName());

        if (user is null) return BadRequest("Could not find user");

        var result = await photoService.AddPhotoAsync(file);

        if (result.Error is not null) return BadRequest(result.Error.Message);

        var photo = new Photo
        {
            Url = result.SecureUrl.AbsoluteUri,
            PublicId = result.PublicId,
        };

        user.Photos.Add(photo);

        if (await userRepository.SaveAllAsync())
            return CreatedAtAction(nameof(GetUser), new { username = user.UserName }, mapper.Map<PhotoDto>(photo));

        return BadRequest("Adding photo failed");
    }

    [HttpPut("set-main-photo/{id:int}")]
    public async Task<ActionResult> SetMainPhoto(int id)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUserName());

        if (user is null) return BadRequest("Could not find user");

        var photo = user.Photos.FirstOrDefault(photo => photo.Id == id);

        if (photo is null) return BadRequest("Photo under this id not found");

        if (photo.IsMain) return BadRequest("Photo is already used as main");

        var currentMain = user.Photos.FirstOrDefault(photo => photo.IsMain);

        if (currentMain is not null) currentMain.IsMain = false;

        photo.IsMain = true;

        if (await userRepository.SaveAllAsync()) return NoContent();

        return BadRequest("Setting main photo failed");
    }

    [HttpDelete("delete-photo/{id:int}")]
    public async Task<ActionResult> DeletePhoto(int id)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUserName());

        if (user is null) return BadRequest("Could not find user");

        var photo = user.Photos.FirstOrDefault(photo => photo.Id == id);

        if (photo is null) return BadRequest("Photo under this id not found");

        if (photo.IsMain)
        {
            var anotherPhoto = user.Photos.FirstOrDefault(photo => photo.Id != id);
            if (anotherPhoto is not null)
            {
                anotherPhoto.IsMain = true;
            }
        }

        if (photo.PublicId is not null)
        {
            var result = await photoService.DeletePhotoAsync(photo.PublicId);
            if (result.Error is not null) return BadRequest(result.Error.Message);
        }

        user.Photos.Remove(photo);
        
        if (await userRepository.SaveAllAsync()) return Ok();
        
        return BadRequest("Deleting photo failed");
    }
}