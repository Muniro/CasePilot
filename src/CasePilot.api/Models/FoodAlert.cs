namespace CasePilot.Api.Models;

public record FoodAlert(
    string Notation,
    string Title,
    string? Description,
    string? AlertUrl,
    DateTimeOffset? Modified);

public record FsaAlertsResponse(FoodAlert[]? Items);