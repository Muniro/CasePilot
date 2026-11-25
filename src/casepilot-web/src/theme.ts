import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#087f6b", dark: "#056451", light: "#e8f5ef" },
    secondary: { main: "#173e38" },
    background: { default: "#f3f6f5", paper: "#ffffff" },
    text: { primary: "#183831", secondary: "#647670" },
    divider: "#e5ece8",
    success: { main: "#087f6b" },
    warning: { main: "#a56317" },
  },
  typography: {
    fontFamily:
      '"Segoe UI", Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    fontSize: 14,
    h1: {
      fontSize: "2rem",
      fontWeight: 700,
      letterSpacing: "-0.045em",
      lineHeight: 1.2,
    },
    h2: { fontSize: "1.25rem", fontWeight: 650, letterSpacing: "-0.025em" },
    h3: { fontSize: "1.05rem", fontWeight: 650, letterSpacing: "-0.015em" },
    body1: { fontSize: "0.9rem", lineHeight: 1.75 },
    body2: { fontSize: "0.82rem", lineHeight: 1.7 },
    button: { textTransform: "none", fontWeight: 600, letterSpacing: 0 },
    overline: {
      fontSize: "0.65rem",
      fontWeight: 700,
      letterSpacing: "0.13em",
      lineHeight: 1.7,
    },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCssBaseline: { styleOverrides: { html: { scrollBehavior: "smooth" } } },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: { root: { backgroundImage: "none" } },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { minHeight: 42, borderRadius: 9, paddingInline: 17 },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontSize: "0.69rem",
          fontWeight: 600,
          height: 26,
          borderRadius: 7,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: { root: { borderRadius: 9, backgroundColor: "#fff" } },
    },
    MuiFormHelperText: { styleOverrides: { root: { marginLeft: 0 } } },
    MuiAlert: {
      styleOverrides: { root: { borderRadius: 9, fontSize: "0.8rem" } },
    },
  },
});

export default theme;
