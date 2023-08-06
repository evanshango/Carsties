using System.Runtime.Serialization;

namespace BiddingService.Entities;

public enum BidStatus {
    [EnumMember(Value = "ACCEPTED")] 
    Accepted,
    [EnumMember(Value = "ACCEPTED_BELOW_RESERVE")]
    AcceptedBelowReserve,
    [EnumMember(Value = "TOO_LOW")] 
    TooLow,
    [EnumMember(Value = "FINISHED")] 
    Finished
}