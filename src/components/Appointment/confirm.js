import React from "react";
import Button from "../Button";

export default function Confirm(props) {
  //Confirm card shows up when "delete" button is clicked
  return (
    <main className="appointment__card appointment__card--confirm">
    <h1 className="text--semi-bold">{props.message}</h1>
    <section className="appointment__actions">
      <Button onClick={props.onCancel} danger>Cancel</Button>
      <Button onClick={props.onConfirm} danger>Confirm</Button>
    </section>
  </main>
  );
};
