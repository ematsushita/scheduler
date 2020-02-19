import React from "react";
import "./styles.scss";
import Header from "./header";
import Show from "./show";
import Empty from "./empty";
import Form from "./form";
import Status from "./status";
import {useVisualMode} from "../../hooks/useVisualMode";
import Confirm from "./confirm";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";


export default function Appointment(props) {

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  const onAdd = function() {
    transition(CREATE)
  }

  const onCancel = function() {
    back();
  }

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING)
   props.bookInterview(props.id, interview).then(response => transition(SHOW))
  }

  function onConfirm() {
    transition(CONFIRM)
  }

  function onDelete(){
    transition(DELETING)

    props.cancelInterview(props.id).then(response => transition(EMPTY))
  }
  

  return (
    <article className="appointment">
      <Header 
      time={props.time}
      />
     {mode === EMPTY && <Empty onAdd={onAdd} />}
     {mode === CREATE && <Form interviewers={props.interviewers} onCancel={onCancel} onSave={save}/>}
     {mode === SAVING && <Status message="Saving" />}
     {mode === SHOW && (
    <Show
    student={props.interview.student}
    interviewer={props.interview.interviewer}
    onDelete={onConfirm}
    />
      )}
    {mode === CONFIRM && <Confirm message="Are you sure you want to delete" onCancel={onCancel} onConfirm={onDelete}/>}
    {mode === DELETING && <Status message="Deleting" />}

    </article>
  );
}
