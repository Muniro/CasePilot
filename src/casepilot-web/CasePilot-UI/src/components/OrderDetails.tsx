import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Glyph from "./Glyph";
import { getJson } from "../lib/api";
import { formatDate } from "../lib/format";

type Order = {
  orderNumber: string;
  status: string;
  promisedDeliveryDate: string;
  revisedDeliveryDate: string | null;
  delayReason: string | null;
};

type OrderDetailsProps = { orderNumber: string };

export default function OrderDetails({ orderNumber }: OrderDetailsProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadOrder() {
    if (loading) return;
    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const data = await getJson<Order>(
        `/api/orders/${encodeURIComponent(orderNumber)}`,
        "Could not load the order",
      );
      setOrder(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not load the order.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Paper
      component="section"
      className="panel"
      aria-labelledby="order-heading"
      aria-busy={loading}
    >
      <Stack direction="row" spacing={1.2} sx={{ alignItems: "center", mb: 2 }}>
        <Box className="section-icon section-icon--neutral">
          <Glyph name="package" sx={{ fontSize: 19 }} />
        </Box>
        <Typography id="order-heading" variant="h3" component="h2">
          Order evidence
        </Typography>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Check the delivery information for{" "}
        <Box
          component="span"
          className="mono"
          sx={{ color: "text.primary", fontWeight: 600 }}
        >
          {orderNumber}
        </Box>
        .
      </Typography>
      <Button
        onClick={loadOrder}
        variant="outlined"
        fullWidth
        disabled={loading}
        startIcon={
          loading ? (
            <CircularProgress size={16} color="inherit" />
          ) : (
            <Glyph name={order ? "refresh" : "search"} sx={{ fontSize: 17 }} />
          )
        }
      >
        {loading
          ? "Looking up order…"
          : order
            ? "Refresh order"
            : "Look up order"}
      </Button>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      {order && (
        <Box sx={{ mt: 2.5 }}>
          <Stack
            direction="row"
            sx={{ alignItems: "center", justifyContent: "space-between" }}
          >
            <Typography variant="overline" color="text.secondary">
              DELIVERY STATUS
            </Typography>
            <Chip
              label={order.status}
              color={
                order.status.toLowerCase().includes("delay")
                  ? "warning"
                  : order.status.toLowerCase().includes("deliver")
                    ? "success"
                    : "default"
              }
              variant="outlined"
              size="small"
            />
          </Stack>
          <Divider sx={{ my: 2 }} />
          <Box className="delivery-timeline">
            <Box className="delivery-event">
              <span className="delivery-dot" />
              <Typography variant="caption" color="text.secondary">
                Originally due
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {formatDate(order.promisedDeliveryDate)}
              </Typography>
            </Box>
            <Box className="delivery-event">
              <span className="delivery-dot delivery-dot--active" />
              <Typography variant="caption" color="text.secondary">
                Revised delivery
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {order.revisedDeliveryDate
                  ? formatDate(order.revisedDeliveryDate)
                  : "Not confirmed"}
              </Typography>
            </Box>
          </Box>
          <Box className="delay-reason">
            <Typography variant="overline" color="text.secondary">
              DELIVERY NOTE
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.7 }}>
              {order.delayReason ?? "No delay reason recorded."}
            </Typography>
          </Box>
        </Box>
      )}
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", mt: 2 }}
      >
        Demonstration order data.
      </Typography>
    </Paper>
  );
}
