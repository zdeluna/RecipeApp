using System;
using Xunit;
using Moq;
using RecipeAPI.Services;
using AutoMapper;
using System.Threading.Tasks;
using RecipeAPI.Models;
using RecipeAPI.Exceptions;
using FluentAssertions;

namespace UnitTests
{
    public class DishesServiceTest
    {
        private readonly Mock<IDishRepository> dishRepoStub = new Mock<IDishRepository>();
        private readonly Mock<IIngredientRepository> ingredientRepoStub = new Mock<IIngredientRepository>();
        private readonly Mock<IStepRepository> stepRepoStub = new Mock<IStepRepository>();
        private readonly Mock<IHistoryRepository> historyRepoStub = new Mock<IHistoryRepository>();

        [Fact]
        public async Task GetDishById_WithUnexistingId_ReturnsNotFound()
        {
            dishRepoStub.Setup(repo => repo.GetDishById(It.IsAny<long>())).ReturnsAsync((Dish)null);

            var service = new DishService(dishRepoStub.Object, ingredientRepoStub.Object, stepRepoStub.Object, historyRepoStub.Object);

            Func<Task> act = () => service.GetById(1);

            await Assert.ThrowsAsync<NotFoundException>(act);

        }
        [Fact]
        public async Task GetDishById_WithExistingId_ReturnsDish()
        {
            var expectedDish = CreateRandomDish();
            
            dishRepoStub.Setup(repo => repo.GetDishById(It.IsAny<long>())).ReturnsAsync(expectedDish);

            var service = new DishService(dishRepoStub.Object, ingredientRepoStub.Object, stepRepoStub.Object, historyRepoStub.Object);

            var result = await service.GetById(1);

            result.Should().BeEquivalentTo(expectedDish, options => options.ComparingByMembers<Dish>());

        }

        [Fact]
        public async Task GetDishes_WithExistingDishes_ReturnsAllDishes()
        {

            var expectedDishes = new[] { CreateRandomDish(), CreateRandomDish(), CreateRandomDish() };

            dishRepoStub.Setup(repo => repo.GetAllDishes(It.IsAny<long>())).ReturnsAsync(expectedDishes);

            long userId = 1;

            var service = new DishService(dishRepoStub.Object, ingredientRepoStub.Object, stepRepoStub.Object, historyRepoStub.Object);

            var result = await service.GetAll(userId);

            result.Should().BeEquivalentTo(expectedDishes, options => options.ComparingByMembers<Dish>());

        }
        
        [Fact]
        public async Task AddDish_WithDishToCreate_ReturnsCreatedDish()
        {
            var dishToCreate = new Dish()
            {
                ID = 1,
                Name = "Pizza",
                Category = 1
            };

            dishRepoStub.Setup(repo => repo.AddDish(dishToCreate)).ReturnsAsync(dishToCreate);

            var service = new DishService(dishRepoStub.Object, ingredientRepoStub.Object, stepRepoStub.Object, historyRepoStub.Object);

            var result = await service.Add(dishToCreate);

            result.Should().BeEquivalentTo(dishToCreate, options => options.ComparingByMembers<Dish>());
        }
        
        
        private Dish CreateRandomDish()
        {
            return new Dish()
            {
                ID = 1,
                Name = "Pizza",
                Category = 1,
                CookingTime = "60 minutes",
                LastMade = "Sunday, July 11, 2021",
                Notes = "Make sauce the night before",
                Url = "https://www.seriouseats.com/foolproof-pan-pizza-recipe",
                UserID = 1
            };

        }
        
    }
}
