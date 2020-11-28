using System;
using AutoMapper;
using RecipeAPI.Models;
using System.Linq;
namespace RecipeAPI.MappingProfile
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<History, HistoryResponse>();
            CreateMap<HistoryResponse, History>();
            CreateMap<User, UserResponse>();
            CreateMap<Dish, DishResponse>()
                .ForMember(dest => dest.History, opt =>
                    opt.MapFrom(src => src.History.Select(x => new HistoryResponse { Date = x.Date })));

           




        }
    }
}
