namespace CasePilot.Api.Models;

public record SupportCase(
    int Id,
    string OrderNumber,
    string Subject,
    string Description);