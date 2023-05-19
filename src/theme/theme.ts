/* eslint-disable @typescript-eslint/naming-convention */
import { createTheme } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const muiTheme = createTheme({
  components: {
    MuiButton: {
      defaultProps: {
        variant: "contained",
        size: "small",
        disableElevation: true,
      },
    },
    MuiIcon: {
      defaultProps: {
        fontSize: "small",
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
        size: "small",
      },
    },
    MuiIconButton: {
      defaultProps: {
        size: "small",
      },
    },
    MuiSelect: {
      defaultProps: {
        variant: "outlined",
        size: "small",
        IconComponent: ExpandMoreIcon,
      },
    },
  },
});

export { muiTheme };
