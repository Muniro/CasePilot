export function formatDate(value: string | null | undefined): string {
  if (!value) return "Not provided";
  // DateOnly values should keep their calendar date in every time zone.
  const date = new Date(
    /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00` : value,
  );
  if (Number.isNaN(date.getTime())) return "Not provided";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function isOfficialAlertUrl(value: string | null): value is string {
  if (!value) return false;
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      (url.hostname === "alerts.food.gov.uk" ||
        url.hostname === "www.food.gov.uk" ||
        url.hostname === "food.gov.uk")
    );
  } catch {
    return false;
  }
}
