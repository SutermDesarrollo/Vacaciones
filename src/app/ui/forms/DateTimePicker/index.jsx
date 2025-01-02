import { TextField } from "@mui/material";
import { useField } from "formik";

const DateTimePicker = ({ name, ...otherProps }) => {
  const minDate = "2025-01-01";
  const maxDate = "2025-12-31";

  const defaultDate = "2025-01-01";

  const [field, meta] = useField(name);

  const configDateTimePicker = {
    ...field,
    ...otherProps,
    type: "date",
    variant: "outlined",
    fullWidth: true,
    InputLabelProps: {
      shrink: true,
    },
    inputProps: {
      min: minDate, // Fecha mínima (1 de enero de 2025)
      max: maxDate, // Fecha máxima (31 de diciembre de 2025)
    },
    value: field.value || defaultDate,
  };

  if (meta && meta.touched && meta.error) {
    configDateTimePicker.error = true;
    configDateTimePicker.helperText = meta.error;
  }

  return <TextField {...configDateTimePicker} />;
};

export default DateTimePicker;
