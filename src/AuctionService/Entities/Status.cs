using System.Runtime.Serialization;

namespace AuctionService.Entities;

public enum Status {
    [EnumMember(Value = "LIVE")]
    Live,
    [EnumMember(Value = "FINISHED")]
    Finished,
    [EnumMember(Value = "RESERVE_NOT_MET")]
    ReserveNotMet
}