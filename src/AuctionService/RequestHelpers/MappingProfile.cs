using AuctionService.Dtos;
using AuctionService.Entities;
using AutoMapper;
using Contracts;

namespace AuctionService.RequestHelpers;

public class MappingProfile : Profile {
    public MappingProfile() {
        CreateMap<Auction, AuctionDto>().IncludeMembers(x => x.Item);
        CreateMap<Item, AuctionDto>();
        CreateMap<AuctionCreateDto, Auction>().ForMember(d => d.Item,
            o => o
                .MapFrom(s => s)
        );
        CreateMap<AuctionCreateDto, Item>();
        CreateMap<AuctionDto, AuctionCreated>();
        CreateMap<Auction, AuctionUpdated>().IncludeMembers(x => x.Item);
        CreateMap<Item, AuctionUpdated>();
    }
}