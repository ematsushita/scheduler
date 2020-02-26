import React, { useState } from "react";
import Button from "../Button";
import InterviewerList from "../InterviewerList";


export default function Form(props) {
  const [name, setName] = useState(props.student || "");
  const [interviewer, setInterviewer] = useState(props.interviewer || null);
  const [error, setError] = useState("");

  const reset = () => {
    setName("");
    setInterviewer(null);
  }

  const cancel = () => {
    props.onCancel();
    reset();
  }

  //Ensures student name is not blank when user tries to book interview
  const validate = () => {
    if (name === "") {
      setError("Student name cannot be blank");
      return;
    }
    //Clears error if user updates empty name field
    setError("");
    props.onSave(name || props.student, interviewer)
  }

  return (
    <main className="appointment__card appointment__card--create">
    <section className="appointment__card-left">
      <form autoComplete="off"  onSubmit={event => event.preventDefault()}>
        <input
          className="appointment__create-input text--semi-bold"
          value={name}
          type="text"
          placeholder= "Enter Student Name"
          onChange={(event) => setName(event.target.value)}
          data-testid = "student-name-input"
        />
      </form>
      <section className="appointment__validation">{error}</section>
      <InterviewerList interviewers= {props.interviewers} value={interviewer} onChange={setInterviewer} />
    </section>
    <section className="appointment__card-right">
      <section className="appointment__actions">
        <Button onClick={() => cancel()} danger>Cancel</Button>
        <Button confirm onClick={() => validate()}>Save</Button>
      </section>
    </section>
  </main>
  );
};

