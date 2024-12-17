import { TextField } from "@mui/material";
import { useField } from "formik";
import React from "react";

const TextFieldWrapper = ({ name, ...otherProps }) => {
  const [field, meta] = useField(name);

  const configTextField = {
    ...field,
    ...otherProps,
    fullWidth: true,
    variant: "outlined",
  };

  if (meta && meta.touched && meta.error) {
    configTextField.error = true;
    configTextField.helperText = meta.error;
  }

  return (
    <TextField
      sx={{
        // Root class for the input field
        "& .MuiOutlinedInput-root": {
          color: "#0a0a0a",
          // Class for the border around the input field
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#0a0a0a",
            borderWidth: "1px",
          },
        },
        // Class for the label of the input field
        "& .MuiInputLabel-outlined": {
          color: "#0a0a0a",
        },
      }}
      {...configTextField}
    />
  );
};

export default TextFieldWrapper;
