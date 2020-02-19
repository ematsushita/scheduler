import React from "react";
import "./styles.scss";
import Header from "./header";
import Show from "./show";
import Empty from "./empty";
import Form from "./form";
import {useVisualMode} from "../../hooks/useVisualMode";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";


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
  
   props.bookInterview(props.id, interview).then(response => transition(SHOW))
  }
  

  return (
    <article className="appointment">
      <Header 
      time={props.time}
      />
     {mode === EMPTY && <Empty onAdd={onAdd} />}
     {mode === CREATE && <Form interviewers={props.interviewers} onCancel={onCancel} onSave={save}/>}
     {mode === SHOW && (
    <Show
    student={props.interview.student}
    interviewer={props.interview.interviewer}
    />
      )}

    </article>
  );
}
