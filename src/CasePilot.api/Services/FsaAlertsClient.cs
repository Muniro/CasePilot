using System.Net.Http.Json;
using System.Text.Json;
using CasePilot.Api.Models;

namespace CasePilot.Api.Services;

public class FsaAlertsClient(HttpClient httpClient)
{
    public async Task<FoodAlert[]> SearchAsync(
     string query,
     CancellationToken cancellationToken)
    {
        var url =
    "id.json?_sort=-modified&_limit=100&_view=full";

        using var response =
            await httpClient.GetAsync(url, cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            var details = await response.Content
                .ReadAsStringAsync(cancellationToken);

            throw new HttpRequestException(
                $"FSA returned {(int)response.StatusCode}. " +
                $"URL: {response.RequestMessage?.RequestUri}. " +
                $"Details: {details}");
        }

        var data = await response.Content
            .ReadFromJsonAsync<FsaAlertsResponse>(
                cancellationToken: cancellationToken);

        var alerts = data?.Items
      ?? throw new JsonException("FSA response has no items array.");

        return alerts
            .Where(alert =>
                alert.Title.Contains(
                    query, StringComparison.OrdinalIgnoreCase)
                || (alert.Description?.Contains(
                    query, StringComparison.OrdinalIgnoreCase) ?? false)
                || alert.Notation.Contains(
                    query, StringComparison.OrdinalIgnoreCase))
            .ToArray();
    }
}