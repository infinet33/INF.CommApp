namespace INF.CommApp.Tests.Unit.Controllers;

/// <summary>
/// Basic example unit tests to demonstrate testing setup
/// </summary>
public class BasicControllerTests
{
    [Fact]
    public void Example_BasicAssertion_Passes()
    {
        // Arrange
        var expected = "Hello World";

        // Act
        var actual = "Hello World";

        // Assert
        actual.Should().Be(expected);
    }

    [Theory]
    [InlineData(1, 1, 2)]
    [InlineData(2, 3, 5)]
    [InlineData(-1, 1, 0)]
    public void Example_AddTwoNumbers_ReturnsCorrectSum(int a, int b, int expected)
    {
        // Act
        var result = a + b;

        // Assert
        result.Should().Be(expected);
    }

    [Fact]
    public void Example_CreateGuid_ReturnsValidGuid()
    {
        // Act
        Guid result = Guid.NewGuid();

        // Assert
        result.Should().NotBeEmpty();
        result.Should().NotBe(Guid.Empty);
    }

    [Fact]
    public void Example_CollectionTest_WorksCorrectly()
    {
        // Arrange
        var numbers = new List<int> { 1, 2, 3, 4, 5 };

        // Act & Assert
        numbers.Should().HaveCount(5);
        numbers.Should().Contain(3);
        numbers.Should().NotContain(10);
        numbers.Should().BeInAscendingOrder();
    }
}