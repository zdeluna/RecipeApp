using System;
using AutoMapper;
using RecipeAPI.Models;
using System.Linq;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.JsonPatch.Operations;

namespace RecipeAPI.MappingProfile
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            
            CreateMap<User, UserResponse>();
            CreateMap<Dish, DishResponse>()
                .ForMember(dest => dest.History, opt =>
                    opt.MapFrom(src => src.History.Select(x => x.Date).ToList()));
            CreateMap<UpdateDishRequest, Dish>();
            CreateMap<Dish, UpdateDishRequest>();
            //CreateMap<JsonPatchDocument<Dish>, JsonPatchDocument<UpdateDishRequest>>();
            //CreateMap<Operation<Dish>, Operation<UpdateDishRequest>>();


        }
    }
}
