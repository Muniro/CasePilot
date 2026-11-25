using CasePilot.Api.Models;

namespace CasePilot.Api.Services;

public class OrderLookup
{
    private readonly Dictionary<string, Order> _orders =
        new(StringComparer.OrdinalIgnoreCase)
        {
            ["ORD-1001"] = new Order(
                OrderNumber: "ORD-1001",
                Status: "Delayed",
                PromisedDeliveryDate: new DateOnly(2026, 11, 22),
                RevisedDeliveryDate: new DateOnly(2026, 11, 24),
                DelayReason: "Parcel delayed at the regional depot.")
        };

    public Order? GetOrder(string orderNumber)
    {
        return _orders.GetValueOrDefault(orderNumber);
    }
}