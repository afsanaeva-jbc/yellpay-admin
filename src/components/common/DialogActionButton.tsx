import React from "react";
import { Button } from "@mui/material";

interface DialogActionButtonProps {
  label: string;
  variant: "cancel" | "delete" | "confirm";
  onClick: () => void;
}

const DialogActionButton: React.FC<DialogActionButtonProps> = ({
  label,
  variant,
  onClick,
}) => {
  let styles = {};

  switch (variant) {
    case "cancel":
      styles = {
        textTransform: "none",
        padding: "0.4rem 1rem",
        fontSize: "0.875rem",
        fontWeight: 500,
        color: "rgb(55, 65, 81)",
        border: "1px solid rgb(209, 213, 219)",
        borderRadius: "0.375rem",
        "&:hover": {
          backgroundColor: "rgb(249, 250, 251)",
        },
      };
      break;

    case "delete":
      styles = {
        textTransform: "none",
        padding: "0.4rem 1rem",
        fontSize: "0.875rem",
        fontWeight: 500,
        color: "white",
        backgroundColor: "rgb(220, 38, 38)",
        borderRadius: "0.375rem",
        "&:hover": {
          backgroundColor: "rgb(185, 28, 28)",
        },
      };
      break;

    case "confirm":
      styles = {
        textTransform: "none",
        padding: "0.4rem 1rem",
        fontSize: "0.875rem",
        fontWeight: 500,
        color: "white",
        backgroundColor: "rgb(34, 197, 94)", // green
        borderRadius: "0.375rem",
        "&:hover": {
          backgroundColor: "rgb(22, 163, 74)",
        },
      };
      break;
  }

  return (
    <Button onClick={onClick} sx={styles}>
      {label}
    </Button>
  );
};

export default DialogActionButton;
