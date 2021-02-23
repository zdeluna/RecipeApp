using System;
using System.Collections.Generic;
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
                    opt.MapFrom(src => src.History.Select(x => x.Date).ToList()))
                .ForMember(dest => dest.Ingredients, opt =>
                    opt.MapFrom(src => src.Ingredients.Select(x => x.Name).ToList()))
                .ForMember(dest => dest.Steps, opt =>
                    opt.MapFrom(src => src.Steps.Select(x => x.Name).ToList()));


            CreateMap<string, Ingredient>().ForMember(dest => dest.Name, m => m.MapFrom(src => src));
            CreateMap<string, Step>().ForMember(dest => dest.Name, m => m.MapFrom(src => src));
            

            CreateMap<string, History>().ForMember(dest => dest.Date, m => m.MapFrom(src => src));
            CreateMap<UpdateDishRequest, Dish>()
                .ForMember(dest => dest.History, m => m.MapFrom(src => src.History))
                .ForMember(dest => dest.Ingredients, m => m.MapFrom(src => src.Ingredients))
                .ForMember(dest => dest.Steps, m => m.MapFrom(src => src.Steps));

            //Add conversion from existing step to a string using name field
            CreateMap<Dish, UpdateDishRequest>()
              .ForMember(dest => dest.Steps, m => m.MapFrom(src => src.Steps.Select(x => x.Name).ToList()))
              .ForMember(dest => dest.Ingredients, m => m.MapFrom(src => src.Ingredients.Select(x => x.Name).ToList()))
              .ForMember(dest => dest.History, m => m.MapFrom(src => src.History.Select(x => x.Date).ToList()));

            CreateMap<User, UpdateUserRequest>();
            CreateMap<UpdateUserRequest, User>()
                .ForMember(d => d.Categories, opt => opt.Ignore())
                .AfterMap((src, dest, context) =>
                {
                    foreach (var categoriesDTO in src.Categories)
                    {
                        context.Mapper.Map(categoriesDTO, dest.Categories.SingleOrDefault(c => c.ID == categoriesDTO.ID));
                    }
                });


            CreateMap<Category, UpdateCategoryRequest>();
            CreateMap<UpdateCategoryRequest, Category>();

        }

    }
}
