using Contracts;
using MassTransit;
using MongoDB.Entities;
using SearchService.Entities;

namespace SearchService.Consumers; 

public class BidPlacedConsumer : IConsumer<BidPlaced> {
    
    public async Task Consume(ConsumeContext<BidPlaced> context) {
        Console.WriteLine("--> Consuming BidPlaced");

        var bid = context.Message;
        var auction = await DB.Find<Item>().OneAsync(bid.AuctionId);
        
        if(auction is null) return;

        var highBid = auction.CurrentHighBid;

        if (highBid is null || bid.BidStatus!.Contains("Accepted") && bid.Amount > highBid) {
            auction.CurrentHighBid = bid.Amount;
            await auction.SaveAsync();
        }
    }
}