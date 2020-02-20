import React from "react";
import "./styles.scss";
import Header from "./header";
import Show from "./show";
import Empty from "./empty";
import Form from "./form";
import Status from "./status";
import {useVisualMode} from "../../hooks/useVisualMode";
import Confirm from "./confirm";
import Error from "./error";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";


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
    props.bookInterview(props.id, interview)
    .then(response => transition(SHOW))
    .catch(error => transition(ERROR_SAVE, true))
  }

  function onConfirm() {
    transition(CONFIRM)
  }

  function onDelete(){
    transition(DELETING, true)

    props.cancelInterview(props.id)
    .then(response => transition(EMPTY))
    .catch(error => transition(ERROR_DELETE, true))
  }

  function onEdit() {
    transition(EDIT)
  }
  
  const onClose = () => {
    transition(SHOW)
  }

  return (
    <article className="appointment">
      <Header 
      time={props.time}
      />
     {mode === EMPTY && <Empty onAdd={onAdd} />}
     {mode === CREATE && <Form interviewers={props.interviewers} onCancel={onCancel} onSave={save}/>}
     {mode === ERROR_SAVE && <Error message="There was an error saving." onClose={onClose}/> }
     {mode === SAVING && <Status message="Saving" />}
     {mode === EDIT && <Form student={props.interview.student} interviewer={props.interview.interviewer.id} interviewers={props.interviewers} onCancel={onCancel} onSave={save} />}
     {mode === SHOW && (
    <Show
    student={props.interview.student}
    interviewer={props.interview.interviewer}
    onDelete={onConfirm}
    onEdit={onEdit}
    />
      )}
    {mode === CONFIRM && <Confirm message="Are you sure you want to delete" onCancel={onCancel} onConfirm={onDelete}/>}
    {mode === DELETING && <Status message="Deleting" />}
    {mode === ERROR_DELETE && <Error message="There was an error deleting." onClose={onClose}/> }

    </article>
  );
}
