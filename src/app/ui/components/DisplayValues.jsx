import { Grid } from "@mui/material";
import React from "react";
import NumberLabel from "./NumberLabel";
import { SiteData } from "../ClientProvider";

function DisplayValues() {
  const { userState } = SiteData();

  return (
    <>
      <Grid item xs={12} md={6}>
        <NumberLabel
          number={userState ? userState.dias_disponibles : 0}
          label={"Dias Disponibles"}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <NumberLabel
          number={userState ? userState.dias_nuevos : 0}
          label={"Dias Nuevos"}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <NumberLabel
          number={userState ? userState.dias_solicitados : 0}
          label={"Dias Solicitados"}
        />
      </Grid>
    </>
  );
}

export default DisplayValues;
