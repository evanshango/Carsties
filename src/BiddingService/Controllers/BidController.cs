using AutoMapper;
using BiddingService.Dtos;
using BiddingService.Entities;
using BiddingService.Services;
using Contracts;
using MassTransit;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Entities;

namespace BiddingService.Controllers;

[ApiController, Route("api/v1/bids"), Produces("application/json"), Tags("Bids")]
public class BidController : ControllerBase {
    private readonly IMapper _mapper;
    private readonly IPublishEndpoint _publishEndpoint;
    private readonly GrpcAuctionClient _grpcClient;

    public BidController(IMapper mapper, IPublishEndpoint publishEndpoint, GrpcAuctionClient grpcClient) {
        _mapper = mapper;
        _publishEndpoint = publishEndpoint;
        _grpcClient = grpcClient;
    }

    [HttpPost, Authorize]
    public async Task<ActionResult<BidDto>> PlaceBid([FromQuery] string auctionId, [FromQuery] int amount) {
        var auction = await DB.Find<Auction>().OneAsync(auctionId);

        if (auction is null) {
            auction = _grpcClient.GetAuction(auctionId);

            if (auction is null) return BadRequest("Cannot accept bids on this auction at this time");
        }

        if (auction.Seller.Equals(User.Identity?.Name)) return BadRequest("You cannot bid on your own auction");

        var bid = new Bid {
            Amount = amount,
            AuctionId = auctionId,
            Bidder = User.Identity?.Name
        };

        if (auction.AuctionEnd < DateTime.UtcNow) {
            bid.BidStatus = BidStatus.Finished;
        } else {
            var highBid = await DB.Find<Bid>()
                .Match(x => x.AuctionId == auctionId)
                .Sort(b => b.Descending(x => x.Amount))
                .ExecuteFirstAsync();

            if (highBid is not null && amount > highBid.Amount || highBid is null) {
                bid.BidStatus = amount > auction.ReservePrice ? BidStatus.Accepted : BidStatus.AcceptedBelowReserve;
            }

            if (highBid is not null && bid.Amount <= highBid.Amount) {
                bid.BidStatus = BidStatus.TooLow;
            }
        }

        await DB.SaveAsync(bid);

        await _publishEndpoint.Publish(_mapper.Map<BidPlaced>(bid));

        return Ok(_mapper.Map<BidDto>(bid));
    }

    [HttpGet("{auctionId}")]
    public async Task<ActionResult<List<BidDto>>> FetchAuctionBids([FromRoute] string auctionId) {
        var bids = await DB.Find<Bid>()
            .Match(a => a.AuctionId.Equals(auctionId))
            .Sort(b => b.Descending(a => a.BidTime))
            .ExecuteAsync();
        return bids.Select(_mapper.Map<BidDto>).ToList();
    }
}