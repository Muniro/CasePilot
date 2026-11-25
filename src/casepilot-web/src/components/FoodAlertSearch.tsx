import { useState } from "react";
import type { FormEvent } from "react";
import {
  Alert,
  Box,
  Button,
  CardActionArea,
  Chip,
  CircularProgress,
  Divider,
  InputAdornment,
  Paper,
  Skeleton,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Glyph from "./Glyph";
import { getJson } from "../lib/api";
import { formatDate, isOfficialAlertUrl } from "../lib/format";

type FoodAlert = {
  notation: string;
  title: string;
  description: string | null;
  alertUrl: string | null;
  modified: string | null;
};

export default function FoodAlertSearch() {
  const [query, setQuery] = useState("Healthy Fit");
  const [searchedQuery, setSearchedQuery] = useState("");
  const [alerts, setAlerts] = useState<FoodAlert[] | null>(null);
  const [selected, setSelected] = useState<FoodAlert | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);

  async function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const searchText = query.trim();
    if (!searchText || loading) return;

    setLoading(true);
    setError(null);
    setAlerts(null);
    setSelected(null);
    setSearchedQuery(searchText);

    try {
      const results = await getJson<FoodAlert[]>(
        `/api/alerts?query=${encodeURIComponent(searchText)}`,
        "Could not search alerts",
      );
      if (!Array.isArray(results))
        throw new Error("The alerts service returned an unexpected response.");
      setAlerts(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not search alerts.");
    } finally {
      setLoading(false);
    }
  }

  async function copyReference() {
    if (!selected) return;
    try {
      await navigator.clipboard.writeText(selected.notation);
      setCopyMessage("Alert reference copied.");
    } catch {
      setCopyMessage(
        "Copy unavailable. You can select the reference text below.",
      );
    }
  }

  return (
    <Paper
      component="section"
      id="food-alerts"
      className="panel evidence-panel"
      aria-labelledby="evidence-heading"
    >
      <Box className="evidence-panel-heading">
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
          <Box className="section-icon">
            <Glyph name="search" sx={{ fontSize: 21 }} />
          </Box>
          <Box>
            <Typography id="evidence-heading" variant="h2" component="h2">
              Investigate food alerts
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>
              Find official notices and review the source.
            </Typography>
          </Box>
        </Stack>
        <Chip
          className="source-chip"
          icon={<Box component="span" className="status-dot" />}
          label="FSA public data"
          variant="outlined"
          sx={{ borderColor: "#cfe4d8", bgcolor: "#f4faf7", color: "#226449" }}
        />
      </Box>

      <Box component="form" onSubmit={search} className="search-form">
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          sx={{ alignItems: "stretch" }}
        >
          <TextField
            id="alert-query"
            label="Product or brand"
            value={query}
            placeholder="For example: Healthy Fit"
            onChange={(event) => setQuery(event.target.value)}
            disabled={loading}
            fullWidth
            required
            slotProps={{
              htmlInput: { maxLength: 100 },
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Glyph
                      name="search"
                      sx={{ fontSize: 20, color: "text.secondary" }}
                    />
                  </InputAdornment>
                ),
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !query.trim()}
            sx={{ minWidth: { sm: 147 } }}
            endIcon={
              loading ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <Glyph name="arrow" sx={{ fontSize: 17 }} />
              )
            }
          >
            {loading ? "Searching…" : "Search alerts"}
          </Button>
        </Stack>
        <Stack
          direction="row"
          spacing={0.8}
          sx={{ alignItems: "center", mt: 1.5 }}
        >
          <Glyph name="clock" sx={{ fontSize: 14, color: "text.secondary" }} />
          <Typography variant="caption" color="text.secondary">
            Coverage: the 100 most recently modified FSA alerts.
          </Typography>
        </Stack>
      </Box>

      <Divider />

      {error ? (
        <Box sx={{ p: 3 }}>
          <Alert severity="error">{error}</Alert>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
            Your search could not be completed. Try searching again.
          </Typography>
        </Box>
      ) : alerts === null && !loading ? (
        <Box className="search-welcome">
          <Box className="welcome-art" aria-hidden="true">
            <span className="welcome-orbit" />
            <Box className="welcome-document">
              <Glyph name="document" sx={{ fontSize: 37 }} />
              <span />
              <span />
            </Box>
            <span className="welcome-check">
              <Glyph name="search" sx={{ fontSize: 19 }} />
            </span>
          </Box>
          <Typography variant="h2" component="h3" sx={{ mt: 3 }}>
            Good decisions start with good evidence.
          </Typography>
          <Typography
            color="text.secondary"
            sx={{ maxWidth: 390, mx: "auto", mt: 1 }}
          >
            Search a product or brand to find relevant food recall notices from
            the Food Standards Agency.
          </Typography>
          <Stack
            direction="row"
            spacing={2}
            sx={{ justifyContent: "center", mt: 3 }}
          >
            <Typography variant="caption" color="text.secondary">
              Official sources
            </Typography>
            <span className="small-dot" />
            <Typography variant="caption" color="text.secondary">
              Original notice links
            </Typography>
          </Stack>
        </Box>
      ) : (
        <Box className="evidence-workspace" aria-busy={loading}>
          <Box className="results-column">
            <Stack
              direction="row"
              sx={{
                alignItems: "center",
                justifyContent: "space-between",
                mb: 0.8,
              }}
            >
              <Typography variant="overline" color="text.secondary">
                MATCHING NOTICES
              </Typography>
              {!loading && alerts && (
                <Chip
                  label={alerts.length}
                  size="small"
                  sx={{ bgcolor: "#edf3ef", height: 23 }}
                />
              )}
            </Stack>
            <Typography
              variant="caption"
              color="text.secondary"
              role="status"
              sx={{ display: "block", mb: 2 }}
            >
              {loading
                ? `Searching for “${searchedQuery}”…`
                : `${alerts?.length ?? 0} ${(alerts?.length ?? 0) === 1 ? "notice" : "notices"} for “${searchedQuery}”`}
            </Typography>

            <Box className="results-list">
              {loading ? (
                [1, 2].map((key) => (
                  <Box key={key} className="result-skeleton">
                    <Skeleton width="50%" />
                    <Skeleton height={24} />
                    <Skeleton width="80%" />
                    <Skeleton width="40%" sx={{ mt: 2 }} />
                  </Box>
                ))
              ) : alerts?.length === 0 ? (
                <Box className="no-results">
                  <Glyph
                    name="search"
                    sx={{ fontSize: 27, color: "text.secondary", mb: 1 }}
                  />
                  <Typography variant="h3" component="h3">
                    No recent matches
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    Try another brand or product name. This search does not
                    cover the full alert archive.
                  </Typography>
                </Box>
              ) : (
                alerts?.map((alert) => (
                  <Paper
                    key={alert.notation}
                    variant="outlined"
                    className={`result-card${selected?.notation === alert.notation ? " result-card--selected" : ""}`}
                  >
                    <CardActionArea
                      onClick={() => setSelected(alert)}
                      aria-pressed={selected?.notation === alert.notation}
                      aria-label={`View alert ${alert.notation}`}
                      sx={{ p: 2, textAlign: "left", height: "100%" }}
                    >
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                          alignItems: "center",
                          justifyContent: "space-between",
                          mb: 1.5,
                        }}
                      >
                        <Typography
                          className="mono"
                          variant="caption"
                          color="text.secondary"
                        >
                          {alert.notation}
                        </Typography>
                        {selected?.notation === alert.notation && (
                          <Glyph
                            name="check"
                            sx={{ fontSize: 17, color: "primary.main" }}
                          />
                        )}
                      </Stack>
                      <Typography
                        variant="body2"
                        component="h3"
                        sx={{ fontWeight: 650, lineHeight: 1.55 }}
                      >
                        {alert.title}
                      </Typography>
                      <Stack
                        direction="row"
                        sx={{
                          alignItems: "center",
                          justifyContent: "space-between",
                          mt: 2,
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(alert.modified)}
                        </Typography>
                        <Stack
                          direction="row"
                          spacing={0.6}
                          sx={{ alignItems: "center", color: "primary.main" }}
                        >
                          <Typography
                            variant="caption"
                            sx={{ fontWeight: 600 }}
                          >
                            View notice
                          </Typography>
                          <Glyph name="arrow" sx={{ fontSize: 14 }} />
                        </Stack>
                      </Stack>
                    </CardActionArea>
                  </Paper>
                ))
              )}
            </Box>
          </Box>

          <Box
            component="aside"
            className="notice-details"
            aria-labelledby="notice-details-heading"
            aria-live="polite"
          >
            {loading ? (
              <Box sx={{ p: 3 }}>
                <Skeleton width="40%" />
                <Skeleton height={38} sx={{ mt: 2 }} />
                <Skeleton height={38} />
                <Skeleton height={22} sx={{ mt: 3 }} />
                <Skeleton height={22} />
                <Skeleton height={22} width="75%" />
              </Box>
            ) : selected ? (
              <Box className="notice-content">
                <Stack
                  direction="row"
                  spacing={0.8}
                  sx={{ alignItems: "center", color: "primary.main", mb: 2 }}
                >
                  <Glyph name="shield" sx={{ fontSize: 17 }} />
                  <Typography variant="overline">
                    FOOD STANDARDS AGENCY
                  </Typography>
                </Stack>
                <Typography
                  id="notice-details-heading"
                  variant="h2"
                  component="h3"
                  sx={{ lineHeight: 1.45, fontSize: "1.22rem" }}
                >
                  {selected.title}
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 2 }}>
                  {selected.description ??
                    "No summary is available. Open the official notice for the full details."}
                </Typography>
                <Divider sx={{ my: 2.5 }} />
                <Box className="notice-metadata">
                  <Box>
                    <Typography variant="overline" color="text.secondary">
                      REFERENCE
                    </Typography>
                    <Typography
                      className="mono"
                      variant="body2"
                      sx={{ fontWeight: 600, mt: 0.6 }}
                    >
                      {selected.notation}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="overline" color="text.secondary">
                      SOURCE UPDATED
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, mt: 0.6 }}
                    >
                      {formatDate(selected.modified)}
                    </Typography>
                  </Box>
                </Box>
                <Alert
                  severity="info"
                  icon={<Glyph name="document" sx={{ fontSize: 20 }} />}
                  sx={{ mt: 3, bgcolor: "#f0f6fa", color: "#385a6d" }}
                >
                  Check the official notice for affected products, pack sizes
                  and batches. A matching name alone does not confirm an
                  affected item.
                </Alert>
                <Stack spacing={1.2} sx={{ mt: 3 }}>
                  {isOfficialAlertUrl(selected.alertUrl) ? (
                    <Button
                      component="a"
                      href={selected.alertUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="contained"
                      endIcon={<Glyph name="external" sx={{ fontSize: 16 }} />}
                    >
                      Read official notice
                    </Button>
                  ) : (
                    <Alert severity="warning">
                      An official notice link is not available for this result.
                    </Alert>
                  )}
                  <Button
                    variant="outlined"
                    onClick={copyReference}
                    startIcon={<Glyph name="copy" sx={{ fontSize: 16 }} />}
                  >
                    Copy reference
                  </Button>
                </Stack>
                {isOfficialAlertUrl(selected.alertUrl) && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", mt: 1.8, textAlign: "center" }}
                  >
                    {new URL(selected.alertUrl).hostname} ↗
                  </Typography>
                )}
              </Box>
            ) : (
              <Box className="details-empty">
                <Box className="empty-icon">
                  <Glyph name="document" sx={{ fontSize: 30 }} />
                </Box>
                <Typography
                  id="notice-details-heading"
                  variant="h3"
                  component="h3"
                  sx={{ mt: 2.5 }}
                >
                  The details are in the evidence.
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1, maxWidth: 270 }}
                >
                  Choose a notice from the results to review its summary, source
                  details.
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      )}

      <Snackbar
        open={copyMessage !== null}
        message={copyMessage}
        autoHideDuration={4000}
        onClose={() => setCopyMessage(null)}
      />
    </Paper>
  );
}
