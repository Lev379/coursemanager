using System.Text.Json;
using API.Helpers;

namespace API.Extensions;

public static class HttpExtensions
{
    public static void AddPaginationHeader<T>(this HttpResponse res, PagedList<T> pagedList)
    {
        var paginationHeader = new PaginationHeader(pagedList.CurrentPage, pagedList.PageSize, pagedList.TotalCount, pagedList.TotalPages);
        
        var jsonOptions = new JsonSerializerOptions{PropertyNamingPolicy = JsonNamingPolicy.CamelCase};
        res.Headers.Append("Pagination", JsonSerializer.Serialize(paginationHeader, jsonOptions));
        res.Headers.Append("Access-Control-Expose-Headers", "Pagination");
    }
}