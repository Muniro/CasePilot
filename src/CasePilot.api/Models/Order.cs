namespace CasePilot.Api.Models;

public record Order(
    string OrderNumber,
    string Status,
    DateOnly PromisedDeliveryDate,
    DateOnly? RevisedDeliveryDate,
    string? DelayReason);