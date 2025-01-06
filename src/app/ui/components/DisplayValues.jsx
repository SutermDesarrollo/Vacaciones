import { Grid } from "@mui/material";
import NumberLabel from "./NumberLabel";
import { SiteData } from "../ClientProvider";

function DisplayValues() {
  const { userReact } = SiteData();

  return (
    <>
      <Grid item xs={12} md={6}>
        <NumberLabel
          number={userReact ? userReact.dias_disponibles : 0}
          label={"Dias Disponibles"}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <NumberLabel
          number={userReact ? userReact.dias_nuevos : 0}
          label={"Dias Nuevos"}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <NumberLabel
          number={userReact ? userReact.dias_solicitados : 0}
          label={"Dias Solicitados"}
        />
      </Grid>
    </>
  );
}

export default DisplayValues;
