using AuctionService.Data;
using AuctionService.Dtos;
using AuctionService.Entities;
using AutoMapper;
using Contracts;
using MassTransit;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AuctionService.Controllers;

[ApiController, Route("api/v1/auctions"), Produces("application/json"), Tags("Auctions")]
public class AuctionController : ControllerBase {
    private readonly AuctionDbContext _context;
    private readonly IMapper _mapper;
    private readonly IPublishEndpoint _publishEndpoint;

    public AuctionController(AuctionDbContext context, IMapper mapper, IPublishEndpoint publishEndpoint) {
        _context = context;
        _mapper = mapper;
        _publishEndpoint = publishEndpoint;
    }

    [HttpGet("")]
    public async Task<ActionResult<List<AuctionDto>>> GetAllAuctions() {
        var auctions = await _context.Auctions
            .Include(x => x.Item)
            .OrderBy(x => x.Item!.Make)
            .ToListAsync();
        return _mapper.Map<List<AuctionDto>>(auctions);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<AuctionDto>> GetAuctionById(Guid id) {
        var auction = await _context.Auctions
            .Include(x => x.Item)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (auction is null) return NotFound();

        return _mapper.Map<AuctionDto>(auction);
    }

    [HttpPost("")]
    public async Task<ActionResult<AuctionDto>> CreateAuction([FromBody] AuctionCreateDto createDto) {
        var auction = _mapper.Map<Auction>(createDto);
        // todo add current user as seller
        auction.Seller = "test";

        _context.Auctions.Add(auction);

        var newAuction = _mapper.Map<AuctionDto>(auction);

        await _publishEndpoint.Publish(_mapper.Map<AuctionCreated>(newAuction));

        var result = await _context.SaveChangesAsync() > 0;

        if (!result) return BadRequest("Could not save changes to the DB");

        return CreatedAtAction(nameof(GetAuctionById), new { auction.Id }, newAuction);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult> UpdateAuction([FromRoute] Guid id, [FromBody] AuctionUpdateDto updateDto) {
        var auction = await _context.Auctions
            .Include(x => x.Item)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (auction is null) return NotFound();

        // todo check seller == username
        auction.Item!.Make = updateDto.Make ?? auction.Item.Make;
        auction.Item!.Model = updateDto.Model ?? auction.Item.Model;
        auction.Item!.Color = updateDto.Color ?? auction.Item.Color;
        auction.Item.Mileage = updateDto.Mileage ?? auction.Item.Mileage;
        auction.Item.Year = updateDto.Year ?? auction.Item.Year;

        await _publishEndpoint.Publish(_mapper.Map<AuctionUpdated>(auction));

        var result = await _context.SaveChangesAsync() > 0;

        return result ? Ok() : BadRequest();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteAuction([FromRoute] Guid id) {
        var auction = await _context.Auctions
            .Include(x => x.Item)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (auction is null) return NotFound();

        // todo check seller == username
        _context.Auctions.Remove(auction);

        await _publishEndpoint.Publish<AuctionDeleted>(new { Id = auction.Id.ToString() });

        var result = await _context.SaveChangesAsync() > 0;

        return result ? Ok() : BadRequest("Could not update DB");
    }
}