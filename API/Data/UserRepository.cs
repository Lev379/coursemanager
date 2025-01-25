using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class UserRepository(DataContext context, IMapper mapper) : IUserRepository
{
    /// <summary>
    /// Marks the specified <see cref="AppUser"/> entity as modified in the EF Core change tracker.
    /// </summary>
    /// <param name="user">The <see cref="AppUser"/> entity to mark as modified.</param>
    /// <remarks>
    /// Setting the entity's state to <see cref="EntityState.Modified"/> ensures EF Core will update
    /// all properties of the entity in the database, even if some haven't explicitly changed.
    /// Changes are persisted when <c>SaveChanges()</c> is called.
    /// </remarks>
    public void Update(AppUser user)
    {
        context.Entry(user).State = EntityState.Modified;
    }

    public async Task<bool> SaveAllAsync()
    {
        return await context.SaveChangesAsync() > 0;
    }

    public async Task<IEnumerable<AppUser>> GetUsersAsync()
    {
        return await context.Users.Include(user => user.Photos).ToListAsync();
    }

    public async Task<AppUser?> GetUserByIdAsync(int id)
    {
        return await context.Users.Include(user => user.Photos).SingleOrDefaultAsync(user => user.Id == id);
    }

    public async Task<AppUser?> GetUserByUsernameAsync(string username)
    {
        return await context.Users
            .Include(user => user.Photos)
            .SingleOrDefaultAsync(user => user.UserName == username);
    }

    public async Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams)
    {
        var query = context.Users.AsQueryable();
        
        query = query.Where(user => user.UserName != userParams.CurrentUsername);

        if (userParams.Gender is not null)
        {
            query = query.Where(user => user.Gender == userParams.Gender);
        }
        
        var minDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-userParams.MaxAge - 1));
        var maxDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-userParams.MinAge));
        
        query = query.Where(user => user.DateOfBirth >= minDob && user.DateOfBirth <= maxDob);

        query = userParams.OrderBy switch
        {
            "created" => query.OrderByDescending(user => user.Created),
            _ => query.OrderByDescending(user => user.LastActive)
        };

        var memberQuery = query.ProjectTo<MemberDto>(mapper.ConfigurationProvider);
        
        var result =  await PagedList<MemberDto>.CreateAsync(memberQuery, userParams.PageNumber, userParams.PageSize);
        return result;
    }

    public async Task<MemberDto?> GetMemberByIdAsync(int id)
    {
        return await context.Users
            .Where(user => user.Id == id)
            .ProjectTo<MemberDto>(mapper.ConfigurationProvider)
            .SingleOrDefaultAsync();
    }

    public async Task<MemberDto?> GetMemberByUsernameAsync(string username)
    {
        return await context.Users
            .Where(user => user.UserName == username)
            .ProjectTo<MemberDto>(mapper.ConfigurationProvider)
            .SingleOrDefaultAsync();
    }
}