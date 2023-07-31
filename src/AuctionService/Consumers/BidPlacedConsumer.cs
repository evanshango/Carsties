using AuctionService.Data;
using Contracts;
using MassTransit;

namespace AuctionService.Consumers;

public class BidPlacedConsumer : IConsumer<BidPlaced> {
    private readonly AuctionDbContext _context;

    public BidPlacedConsumer(AuctionDbContext context) {
        _context = context;
    }

    public async Task Consume(ConsumeContext<BidPlaced> context) {
        Console.WriteLine("--> Consuming BidPlaced");
        var auction = await _context.Auctions.FindAsync(context.Message.AuctionId);

        if (auction is null) return;

        var bid = auction.CurrentHighBid;

        if (bid is null || context.Message.BidStatus!.Contains("Accepted") && context.Message.Amount > bid) {
            auction.CurrentHighBid = context.Message.Amount;
            await _context.SaveChangesAsync();
        }
    }
}