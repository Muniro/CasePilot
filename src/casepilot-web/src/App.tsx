import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import FoodAlertSearch from "./components/FoodAlertSearch";
import OrderDetails from "./components/OrderDetails";
import Glyph from "./components/Glyph";
import { getJson } from "./lib/api";
import "./App.css";

type SupportCase = {
  id: number;
  orderNumber: string;
  subject: string;
  description: string;
};

export default function App() {
  const [supportCase, setSupportCase] = useState<SupportCase | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadCase() {
    if (loading) return;
    setLoading(true);
    setError(null);
    setSupportCase(null);
    try {
      const data = await getJson<SupportCase>(
        "/api/cases/1",
        "Could not load the case",
      );
      setSupportCase(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load the case.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to investigation
      </a>

      <Box component="aside" className="sidebar">
        <a className="brand" href="#main-content" aria-label="CasePilot home">
          <span className="brand-mark">
            <Glyph name="case" />
          </span>
          <span>
            CasePilot
            <span className="brand-caption">INVESTIGATION WORKSPACE</span>
          </span>
        </a>

        <div className="sidebar-label">WORKSPACE</div>
        <nav className="sidebar-nav" aria-label="Workspace sections">
          <a className="nav-link nav-link--primary" href="#case-overview">
            <Glyph name="case" />
            <span>Case overview</span>
            <Glyph name="chevron" sx={{ fontSize: 14, ml: "auto" }} />
          </a>
          <a className="nav-link" href="#food-alerts">
            <Glyph name="search" />
            <span>Food alerts</span>
          </a>
          <a className="nav-link" href="#order-evidence">
            <Glyph name="package" />
            <span>Order evidence</span>
          </a>
        </nav>

        <div className="sidebar-note">
          <Glyph name="shield" sx={{ fontSize: 25, color: "#8bcebb", mb: 1 }} />
          <strong>Start with the facts.</strong>
          <span>
            Bring customer context and official sources into one clear view.
          </span>
        </div>

        <div className="sidebar-footer">
          <span className="sidebar-monogram">CP</span>
          <div>
            <strong>CasePilot</strong>
            <span>Customer support tools</span>
          </div>
        </div>
      </Box>

      <Box className="app-body">
        <Box component="header" className="topbar">
          <Stack
            direction="row"
            spacing={1.2}
            sx={{ alignItems: "center", minWidth: 0 }}
          >
            <Typography variant="body2" color="text.secondary">
              Workspace
            </Typography>
            <Glyph
              name="chevron"
              sx={{ fontSize: 12, color: "text.secondary" }}
            />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Investigations
            </Typography>
          </Stack>
          <Chip
            label="Demo workspace"
            variant="outlined"
            sx={{ bgcolor: "#f8faf9", borderColor: "#dce6df" }}
          />
        </Box>

        <Box
          component="main"
          id="main-content"
          className="workspace"
          tabIndex={-1}
        >
          <Box className="page-heading">
            <Box>
              <Typography variant="overline" color="primary.main">
                CUSTOMER SUPPORT / INVESTIGATIONS
              </Typography>
              <Typography variant="h1" sx={{ mt: 0.8 }}>
                Investigation workspace
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                Customer context and official notices, brought together.
              </Typography>
            </Box>
            <Button
              variant="contained"
              onClick={loadCase}
              disabled={loading}
              startIcon={
                loading ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <Glyph
                    name={supportCase ? "refresh" : "case"}
                    sx={{ fontSize: 18 }}
                  />
                )
              }
            >
              {loading
                ? "Loading case…"
                : supportCase
                  ? "Reload case"
                  : "Load demo case"}
            </Button>
          </Box>

          <Box className="workspace-grid">
            <Stack spacing={2.5} className="case-column">
              <Paper
                component="section"
                id="case-overview"
                className="panel case-panel"
                aria-labelledby="case-heading"
                aria-busy={loading}
              >
                <Stack
                  direction="row"
                  sx={{
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2.5,
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1.2}
                    sx={{ alignItems: "center" }}
                  >
                    <Box className="section-icon">
                      <Glyph name="case" sx={{ fontSize: 19 }} />
                    </Box>
                    <Typography id="case-heading" variant="h3" component="h2">
                      Case context
                    </Typography>
                  </Stack>
                  <Chip
                    label={
                      supportCase
                        ? `#${String(supportCase.id).padStart(4, "0")}`
                        : "Demo"
                    }
                    size="small"
                    sx={{ bgcolor: "#f0f5f2" }}
                  />
                </Stack>

                {error && (
                  <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    action={
                      <Button color="inherit" size="small" onClick={loadCase}>
                        Retry
                      </Button>
                    }
                  >
                    {error}
                  </Alert>
                )}

                {loading ? (
                  <Box aria-label="Loading case details">
                    <Skeleton width="85%" height={35} />
                    <Skeleton width="60%" />
                    <Skeleton variant="rounded" height={100} sx={{ mt: 2 }} />
                  </Box>
                ) : supportCase ? (
                  <>
                    <Typography variant="overline" color="text.secondary">
                      CUSTOMER ENQUIRY
                    </Typography>
                    <Typography
                      variant="h2"
                      component="h3"
                      sx={{ mt: 0.8, mb: 2 }}
                    >
                      {supportCase.subject}
                    </Typography>
                    <Box className="customer-message">
                      <Typography variant="body2">
                        “{supportCase.description}”
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 2.5 }} />
                    <Typography variant="overline" color="text.secondary">
                      ORDER REFERENCE
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ alignItems: "center", mt: 0.8 }}
                    >
                      <Glyph
                        name="package"
                        sx={{ fontSize: 18, color: "text.secondary" }}
                      />
                      <Typography
                        className="mono"
                        variant="body2"
                        sx={{ fontWeight: 600 }}
                      >
                        {supportCase.orderNumber}
                      </Typography>
                    </Stack>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mt: 2.5 }}
                    >
                      Fictional case for demonstration.
                    </Typography>
                  </>
                ) : (
                  <Box className="case-empty">
                    <Typography variant="h3" sx={{ mb: 1 }}>
                      Ready to investigate
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Load the demo case to see the customer’s enquiry and look
                      up their order.
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={loadCase}
                      disabled={loading}
                      startIcon={<Glyph name="case" sx={{ fontSize: 17 }} />}
                      sx={{ mt: 2.5 }}
                      fullWidth
                    >
                      Load demo case
                    </Button>
                  </Box>
                )}
              </Paper>

              <Box id="order-evidence">
                {supportCase ? (
                  <OrderDetails
                    key={supportCase.orderNumber}
                    orderNumber={supportCase.orderNumber}
                  />
                ) : (
                  <Paper component="section" className="panel">
                    <Stack
                      direction="row"
                      spacing={1.2}
                      sx={{ alignItems: "center", mb: 1.5 }}
                    >
                      <Box className="section-icon section-icon--neutral">
                        <Glyph name="package" sx={{ fontSize: 19 }} />
                      </Box>
                      <Typography variant="h3" component="h2">
                        Order evidence
                      </Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      The order lookup becomes available when a case is loaded.
                    </Typography>
                  </Paper>
                )}
              </Box>
              <Box className="context-note">
                <Glyph name="shield" sx={{ fontSize: 19 }} />
                <Typography variant="caption">
                  Review source evidence before drawing a conclusion.
                </Typography>
              </Box>
            </Stack>

            <FoodAlertSearch />
          </Box>

          <Box component="footer" className="workspace-footer">
            <span>CasePilot · Evidence-led customer support</span>
            <span>Public alert data: Food Standards Agency</span>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
