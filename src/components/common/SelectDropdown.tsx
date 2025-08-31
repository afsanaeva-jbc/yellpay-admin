import React from "react";
import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  IconButton,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";

interface SelectInputProps {
  options: {
    label: string;
    value: string;
  }[];
  placeholder?: string;
  width?: string;
  selectedValue?: string;
  onChange?: (value: string) => void;
  onClear?: () => void;
  disabled?: boolean;
  showClearButton?: boolean;
}

const SelectInput: React.FC<SelectInputProps> = ({
  options,
  placeholder = "please-select",
  width,
  onChange,
  selectedValue,
  onClear,
  disabled = false,
  showClearButton = true,
}) => {
  const { t } = useTranslation();

  const handleChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    if (onChange && value !== "default") {
      onChange(value);
    }
  };

  const handleClear = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (onClear) {
      onClear();
    }
  };

  return (
    <FormControl fullWidth>
      <Select
        sx={{
          width: { xs: "100%", sm: width ?? "19.25rem" },
          backgroundColor: "#F3F4F6",
          borderRadius: "10px",
          "&.MuiOutlinedInput-root": {
            "& fieldset": {
              border: "none",
            },
            "&:hover fieldset": {
              border: "none",
            },
          },
          "& .MuiSelect-select": {
            padding: "8px 14px",
            minHeight: "20px !important",
            fontSize: "0.875rem",
            display: "flex",
            alignItems: "center",
          },
          "& svg": {
            color: "#6B7280",
            right: 12,
          },
        }}
        labelId="select-label"
        id="select"
        value={selectedValue || "default"}
        onChange={handleChange}
        disabled={disabled}
        endAdornment={
          showClearButton && selectedValue && selectedValue !== "default" ? (
            <IconButton
              onClick={handleClear}
              size="small"
              className="clear-button"
              sx={{
                position: "absolute",
                right: 28,
                visibility: selectedValue ? "visible" : "hidden",
                p: 0.5,
                "&:hover": {
                  backgroundColor: "action.hover",
                },
              }}
            >
              <X className="clear-icon" size={14} />
            </IconButton>
          ) : null
        }
        MenuProps={{
          PaperProps: {
            sx: {
              maxHeight: "300px",
              borderRadius: "10px", 
              mt: 1,
              "& .MuiMenuItem-root": {
                padding: "8px 14px",
                margin: "4px 8px",
                height: "35px",
                borderRadius: "8px", 
                fontSize: "0.875rem",
                "&:hover": {
                  backgroundColor: "#F3F4F6", 
                },
                "&.Mui-selected": {
                  backgroundColor: "#E5E7EB !important", 
                  borderRadius: "8px",
                  "&:hover": {
                    backgroundColor: "#E5E7EB !important",
                  },
                },
              },
            },
          },
        }}
      >
        <MenuItem value="default" disabled>
          {t(placeholder)}
        </MenuItem>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectInput;
