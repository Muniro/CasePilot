using CasePilot.Api.Models;
using CasePilot.Api.Services;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddSingleton<OrderLookup>();

builder.Services.AddHttpClient<FsaAlertsClient>(client =>
{
    client.BaseAddress =
        new Uri("https://data.food.gov.uk/food-alerts/");

    client.Timeout = TimeSpan.FromSeconds(15);
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast =  Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");




app.MapGet("/api/cases/1", () =>
{
    var supportCase = new SupportCase(
        Id: 1,
        OrderNumber: "ORD-1001",
        Subject: "Order has not arrived",
        Description: "My order was due yesterday, but it hasn't arrived.");

    return Results.Ok(supportCase);
});


app.MapGet("/api/orders/{orderNumber}",
    IResult (string orderNumber, OrderLookup orders) =>
    {
        var order = orders.GetOrder(orderNumber);

        if (order is null)
        {
            return Results.NotFound();
        }

        return Results.Ok(order);
    });



app.MapGet("/api/alerts",
    async Task<IResult> (
        string? query,
        FsaAlertsClient client,
        CancellationToken cancellationToken) =>
    {
        if (string.IsNullOrWhiteSpace(query) || query.Length > 100)
        {
            return Results.BadRequest(new
            {
                error = "Enter a search query of 1–100 characters."
            });
        }

        try
        {
            var alerts = await client.SearchAsync(
                query.Trim(), cancellationToken);

            return Results.Ok(alerts);
        }
        catch (HttpRequestException ex)
        {
            app.Logger.LogWarning(ex, "FSA request failed");

            return Results.Problem(
                title: "Could not retrieve food alerts. Please try again.",
                statusCode: 502);
        }
        catch (System.Text.Json.JsonException ex)
        {
            app.Logger.LogWarning(ex, "Unexpected FSA response");

            return Results.Problem(
                title: "The food alerts service returned an unexpected response.",
                statusCode: 502);
        }
        catch (OperationCanceledException)
            when (!cancellationToken.IsCancellationRequested)
        {
            return Results.Problem(
                title: "The food alerts service took too long to respond.",
                statusCode: 504);
        }
    });

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
