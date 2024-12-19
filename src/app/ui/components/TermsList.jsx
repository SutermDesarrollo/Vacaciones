import React from "react";

export const TermsList = (Terms) => {
  return (
    <div>
      {Terms.map((element, index) => (
        <TermCard Term={element} />
      ))}
    </div>
  );
};

const TermCard = (Term) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "green",
        width: "300px",
      }}
    >
      {Term.motivo}
      {Term.fecha_inicio}
      {Term.fecha_fin}
    </div>
  );
};
