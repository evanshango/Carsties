using Microsoft.AspNetCore.Mvc;
using MongoDB.Entities;
using SearchService.Entities;
using SearchService.RequestHelpers;

namespace SearchService.Controllers;

[ApiController, Route("api/v1/search"), Produces("application/json"), Tags("Search")]
public class SearchController : ControllerBase {
    [HttpGet]
    public async Task<ActionResult<List<Item>>> SearchItems([FromQuery] SearchParam searchParam) {
        var query = DB.PagedSearch<Item, Item>();

        if (!string.IsNullOrEmpty(searchParam.SearchTerm)) {
            query.Match(Search.Full, searchParam.SearchTerm).SortByTextScore();
        }

        query = searchParam.OrderBy switch {
            "make" => query.Sort(x => x.Ascending(a => a.Make)),
            "new" => query.Sort(x => x.Descending(a => a.CreatedAt)),
            _ => query.Sort(x => x.Ascending(a => a.AuctionEnd))
        };

        query = searchParam.FilterBy switch {
            "finished" => query.Match(x => x.AuctionEnd < DateTime.UtcNow),
            "ending" => query.Match(x =>
                x.AuctionEnd < DateTime.UtcNow.AddHours(6) && x.AuctionEnd > DateTime.UtcNow
            ),
            _ => query.Match(x => x.AuctionEnd > DateTime.UtcNow)
        };

        if (!string.IsNullOrEmpty(searchParam.Seller)) query = query.Match(x => x.Seller == searchParam.Seller);
        if (!string.IsNullOrEmpty(searchParam.Winner)) query = query.Match(x => x.Winner == searchParam.Winner);

        query.PageNumber(searchParam.PageNo);
        query.PageSize(searchParam.PageSize);

        var result = await query.ExecuteAsync();

        return Ok(new {
            totalPages = result.PageCount,
            totalCount = result.TotalCount,
            results = result.Results
        });
    }
}