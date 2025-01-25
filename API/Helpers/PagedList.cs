using Microsoft.EntityFrameworkCore;

namespace API.Helpers;

/// Represents a paginated list of items of type T, providing pagination-related metadata.
/// This class is a generic collection that extends the functionality of a standard List&lt;T&gt; by
/// including properties and methods to manage pagination effectively.
/// Type Parameters:
/// T: The type of elements in the paginated list.
public class PagedList<T> : List<T>
{
    public int CurrentPage { get; set; }

    public int TotalPages { get; set; }

    public int PageSize { get; set; }

    public int TotalCount { get; set; }

    public PagedList(IEnumerable<T> items, int count, int pageNumber, int pageSize) : base(items)
    {
        CurrentPage = pageNumber;
        TotalPages = (int)Math.Ceiling(count / (double)pageSize);
        PageSize = pageSize;
        TotalCount = count;
    }

    /// <summary>
    /// Creates a paged list asynchronously from the specified queryable source.
    /// </summary>
    /// <param name="source">The queryable source to retrieve data from.</param>
    /// <param name="pageNumber">The current page number to fetch data for.</param>
    /// <param name="pageSize">The number of items per page.</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains the paged list of items.</returns>
    public static async Task<PagedList<T>> CreateAsync(IQueryable<T> source, int pageNumber, int pageSize)
    {
        var count = await source.CountAsync();
        var items = await source.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
        return new PagedList<T>(items, count, pageNumber, pageSize);
    }
}
