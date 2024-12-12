import { MenuItem, TextField } from "@mui/material";
import { useField, useFormikContext } from "formik";
import React from "react";

const SelectWrapper = ({ name, options, ...otherProps }) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  const handleChange = (evt) => {
    const { value } = evt.target;
    setFieldValue(name, value);
  };

  const configSelect = {
    ...field,
    ...otherProps,
    variant: "outlined",
    select: true,
    fullWidth: true,
    onChange: handleChange,
  };

  if (meta && meta.touched && meta.error) {
    configSelect.error = true;
    //Definido en la validacion de yup
    configSelect.helperText = meta.error;
  }

  return (
    <TextField
      sx={{
        // Root class for the input field
        "& .MuiOutlinedInput-root": {
          color: "whitesmoke",
          // Class for the border around the input field
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "whitesmoke",
            borderWidth: "1px",
          },
        },
        // Class for the label of the input field
        "& .MuiInputLabel-outlined": {
          color: "whitesmoke",
        },
      }}
      {...configSelect}
    >
      {Object.keys(options).map((item, pos) => {
        return (
          <MenuItem key={pos} value={item}>
            {options[item]}
          </MenuItem>
        );
      })}
    </TextField>
  );
};

export default SelectWrapper;
