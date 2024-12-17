"use client";
import { Grid, Container, Typography } from "@mui/material";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import TextField from "../ui/forms/TextField";
import Button from "../ui/forms/Button";
import NumberLabel from "../ui/components/NumberLabel";
import { DateCalendar } from "@mui/x-date-pickers";

const INITIAL_FORM_STATE = {
  motive: "",
};

const FORM_VALIDATION = Yup.object().shape({
  motive: Yup.string().required("Required"),
});

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

function page() {
  return (
    <Container sx={{ marginTop: "3rem", backgroundColor: "#202020" }}>
      <Formik
        initialValues={{ ...INITIAL_FORM_STATE }}
        validationSchema={FORM_VALIDATION}
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        <Form>
          <Grid
            container
            spacing={2}
            sx={{ paddingLeft: "3rem", paddingRight: "3rem" }}
          >
            <Grid
              item
              xs={4}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
              }}
            >
              <NumberLabel number={27} label={"Dias Disponibles"} />
              <NumberLabel number={14} label={"Dias Nuevos"} />
              <NumberLabel number={8} label={"Dias Solicitados"} />
            </Grid>

            <Grid item xs={8}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography>Solicitar Vacaciones</Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField name="motive" label="Motivo" />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    name="date"
                    label="Fecha Inicio"
                    type="date"
                    defaultValue={formatDate(new Date())}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    name="date"
                    label="Fecha Inicio"
                    type="date"
                    defaultValue={formatDate(new Date())}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button>Solicitar</Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <DateCalendar />
            </Grid>
          </Grid>
        </Form>
      </Formik>
    </Container>
  );
}

export default page;
