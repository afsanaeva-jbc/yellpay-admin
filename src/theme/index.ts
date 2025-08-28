import { alpha, createTheme } from "@mui/material/styles";
import "@fontsource/noto-sans"

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    primary: true;
    secondary: true;
  }
}

declare module "@mui/material/Link" {
  interface LinkPropsVariantOverrides {
    button: true;
  }
}

declare module "@mui/material/styles" {
  interface PaletteColor {
    50?: string;
    100?: string;
    200: string;
    300?: string;
    400?: string;
    500?: string;
    600?: string;
  }

  interface SimplePaletteColorOptions {
    darker?: string;
  }
}

let theme = createTheme({
  typography: {
    fontFamily: "'Noto Sans JP'",
  },
  palette: {
    primary: {
      main: "#D5242A",
      200: "#F29EA1",
      50: "#FFFAFC",
      100: alpha("#FAD6D8", 0.5),
      light: "#FCE8F0",
      dark: "#D6D9DA",
      500: "#F6575D",
      600: "#B71E24"
    },
    secondary: {
      main: "#00AAEA",
      400: "#DFF4FC",
      300: alpha("#AAE0F9", 0.1),
      200: "#40C7F4",
      100: "#0D34FF",
      50: "#0D99FF",
      light: "#EBFAFF",
    },
    background: {
      default: "#FFFFFF",
      paper: "#F9F9F9",
    },
    common: {
      black: "#000000",
      white: "#FFFFFF",
    },
    text: {
      primary: "#202020",
      secondary: "#FFFFFF",
    },
    error: {
      main: "#E64141",
      100: "#F24822",
      200: alpha("#E64141", 0.05),
      50: "#FCE2E1",
    },
    grey: {
      900: "#F7FCFE",
      800: "#FAFDFC",
      700: "#6B7280",
      A700: "#B4916A",
      600: "#9C9F9F",
      500: "#F7F7F7",
      400: "#505050",
      300: "#FDFDFD",
      200: "#707070",
      100: "#F9F9F9",
      50: "#B3B3B3",
    },
    success: {
      main: "#14AE5C",
      light: alpha("#A4D9D2", 0.1),
      500: "#A4D9D2",
      400: "#DAEFED",
      300: "#DCFCE7",
      200: "#00968A",
      100: "#67C895",
      50: "#61BCB2",
    },
    info: {
      main: "#9747FF",
      100: "#C797C4",
      200: "#A56AA8"
    },
    warning: {
      main: "#FFA629",
      light: alpha("#FFE2A5", 0.2),
      400: "#FEF6F6",
      300: "#FEF9C3",
      200: "#EF821D",
      100: "#F9BE00",
      50: "#FFCD29",
    },
  },
});

theme = createTheme(theme, {
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  typography: {
    fontSize: 16,
    h1: {
      color: theme.palette.text.primary,
      fontSize: "1.5rem",
      lineHeight: "2rem",
      fontWeight: 700,
    },
    h2: {
      color: theme.palette.primary.main,
      fontSize: "1.375rem",
      lineHeight: "2rem",
      fontWeight: 700,
    },
    h3: {
      color: theme.palette.text.primary,
      fontSize: "1.25rem",
      lineHeight: "2rem",
      fontWeight: 700,
    },
    h4: {
      color: theme.palette.text.primary,
      fontSize: "1rem",
      fontWeight: 700,
    },
    h5: {
      color: theme.palette.text.primary,
      fontSize: "0.75rem",
      fontWeight: 700,
      lineHeight: "1.6875rem",
    },
    body1: {
      color: theme.palette.text.primary,
      fontWeight: 400,
      fontSize: "0.875rem",
      lineHeight: "1.375rem",
    },
    body2: {
      color: theme.palette.text.primary,
      fontWeight: 400,
      fontSize: "0.8125rem",
      lineHeight: "1.25rem",
    },
    caption: {
      color: theme.palette.text.primary,
      fontSize: "0.75rem",
      fontWeight: 400,
    },
  },
  components: {
    MuiRadio: {
      styleOverrides: {
        root: {
          color: theme.palette.primary.dark,
          "&.Mui-checked": {
            color: theme.palette.primary.main,
          },
        },
      },
    },
    MuiButton: {
      fontFamily: "'Noto Sans JP'",
      variants: [
        {
          props: { variant: "contained" },
          style: {
            fontSize: "0.875rem",
            lineHeight: "1.625rem",
            fontWeight: 700,
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.text.secondary,
          },
        },
        {
          props: { variant: "outlined" },
          style: {
            fontSize: "0.875rem",
            lineHeight: "1.625rem",
            fontWeight: 700,
            borderColor: theme.palette.primary.main,
            color: theme.palette.primary.main,
          },
        },
        {
          props: { variant: "secondary" },
          style: {
            fontSize: "0.875rem",
            lineHeight: "1.625rem",
            fontWeight: 700,
            border: `1px solid ${theme.palette.primary.dark}`,
            background: theme.palette.background.paper,
            color: theme.palette.grey[200],
            "&:hover": {
              backgroundColor: alpha(theme.palette.background.paper, 0.8),
            },
          },
        },
        {
          props: { variant: "primary" },
          style: {
            fontSize: "0.875rem",
            lineHeight: "1.625rem",
            fontWeight: 700,
            borderColor: theme.palette.primary.dark,
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.grey[100],
            "&:hover": {
              backgroundColor: alpha(theme.palette.grey[200], 0.8),
            },
            "&.Mui-disabled": {
              backgroundColor: alpha(theme.palette.grey[200], 0.3),
              color: theme.palette.grey[100],
            }
          },
        },
      ],
    },
    MuiIconButton: {
      fontFamily: "'Noto Sans JP'",
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: theme.palette.primary.dark,
          margin: "0 !important",
          borderBottomWidth: 1,
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          "& .MuiSvgIcon-root": {
            height: "1.25rem",
            width: "1.25rem",
            color: theme.palette.primary.dark, // Color for the checkbox when not checked
            borderRadius: "4px", // Rounded corners (optional)
          },
          "&.Mui-checked .MuiSvgIcon-root": {
            color: theme.palette.primary.main, // Color when checked
          },
          "&:hover .MuiSvgIcon-root": {
            borderColor: "black", // Change border color on hover
            backgroundColor: "rgba(0, 0, 0, 0.1)", // Optional hover background
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          padding: "0.53125rem 0.75rem",
          height: "2.5rem",
          borderRadius: "0.3125rem !important",
          background: theme.palette.grey[300],
          "& .MuiOutlinedInput-root": {
            paddingLeft: "0rem",
          },
          "& .MuiInputBase-input": {
            padding: 0,
          },
          "& input::-webkit-outer-spin-button, input::-webkit-inner-spin-button": {
            WebkitAppearance: "none",
            margin: 0,
          },
          /* Firefox */
          "& input[type=number]": {
            MozAppearance: "textfield",
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          backgroundColor: theme.palette.warning[400],
          margin: "0.5rem 0 0 0",
          padding: "0 1.125rem",
          lineHeight: "2.25rem",
          fontWeight: 500,
          fontSize: "0.75rem",
          borderRadius: "0.3125rem",
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          // display: "inline-flex",
          borderRadius: "0.5rem",
          color: theme.palette.text.primary,
          fontWeight: 500,
          "& .MuiButtonBase-root": {
            color: theme.palette.grey[700],
          },
          "& .MuiAlert-action": {
            padding: "0.25rem 0 0 0.25rem",
          },
        },
        standardSuccess: {
          backgroundColor: theme.palette.success[300],
        },
        standardWarning: {
          backgroundColor: theme.palette.warning[300],
        },
        standardError: {
          backgroundColor: theme.palette.error[50],
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: theme.palette.success[200],
          color: theme.palette.text.secondary,
          fontWeight: 700,
          "&:hover": {
            backgroundColor: alpha(theme.palette.success[200], 0.8),
          },
        },
      },
    },
    MuiLink: {
      variants: [
        {
          props: { variant: "button" },
          style: {
            padding: "0.25rem 1rem",
            lineHeight: "1.75rem",
            backgroundColor: theme.palette.grey[500],
            textDecoration: "none",
            border: `1px solid ${theme.palette.primary.dark}`,
            borderRadius: "0.375rem",
            whiteSpace: "nowrap",
          },
        },
      ],
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontSize: "0.75rem",
          lineHeight: "1.125rem",
          fontWeight: 700,
          backgroundColor: theme.palette.primary[100],
          color: theme.palette.primary.main,
          "&.MuiTab-root": {
            marginRight: "0.5rem",
            padding: "0.5rem 1.5rem",
            borderRadius: "0.5rem 0.5rem 0 0",
            fontSize: "1rem",
            fontWeight: 700,
            lineHeight: "2.25rem",
          },
          "&.Mui-selected": {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.common.white,
          },
          "&.MuiTabs-indicator": {
            display: "none",
          },
        },
      },
    },
  },
});

export default theme;
