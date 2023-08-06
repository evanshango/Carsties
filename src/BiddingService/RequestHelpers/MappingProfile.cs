using AutoMapper;
using BiddingService.Dtos;
using BiddingService.Entities;
using Contracts;

namespace BiddingService.RequestHelpers; 

public class MappingProfile : Profile {
    public MappingProfile() {
        CreateMap<Bid, BidDto>();
        CreateMap<Bid, BidPlaced>();
    }
}