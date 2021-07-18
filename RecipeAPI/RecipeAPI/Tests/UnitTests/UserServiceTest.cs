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
    public class UserServiceTest
    {
        private readonly Mock<IUserRepository> userRepoStub = new Mock<IUserRepository>();
        private readonly Mock<ICategoryRepository> categoryRepoStub = new Mock<ICategoryRepository>();

        [Fact]
        public async Task GetUserById_WithUnexistingId_ReturnsNotFound()
        {
            userRepoStub.Setup(repo => repo.GetUserById(It.IsAny<long>())).ReturnsAsync((User)null);

            var service = new UserService(userRepoStub.Object, categoryRepoStub.Object);

            Func<Task> act = () => service.GetById(1);

            await Assert.ThrowsAsync<NotFoundException>(act);

        }
        [Fact]
        public async Task GetUserById_WithExistingId_ReturnsExpectedUser()
        {
            var expectedUser = CreateRandomUser();
            userRepoStub.Setup(repo => repo.GetUserById(It.IsAny<long>())).ReturnsAsync(expectedUser);

            var service = new UserService(userRepoStub.Object, categoryRepoStub.Object);

            var result = await service.GetById(1);

            result.Should().BeEquivalentTo(expectedUser, options => options.ComparingByMembers<User>());
        }

        private User CreateRandomUser()
        {
            return new User()
            {
                ID = 1,
                UserName = "test_user",
                Password = "123",
                UserRole = "User",
                LastLoggedIn = new DateTime(),
            };

        }
    }
}
