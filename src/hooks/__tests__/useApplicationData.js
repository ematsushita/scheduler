import {useState, useEffect, useReducer} from "react";
import axios from 'axios';
import DayList from "components/DayList";


export default function useApplicationData(){

  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";

  const initialState = {
    day: "Monday", 
    days: [],
    appointments: {}, 
    interviewers: {}
  }

  function reducer(state, action) {
  switch (action.type) {
    case SET_DAY:
      const {day} = action
      return { ...state, day  };
    case SET_APPLICATION_DATA:
      const {days, appointments, interviewers} = action 
      return {...state, days, appointments, interviewers}
      
    case SET_INTERVIEW: {
      const {appointments, interview} = action
      return interview ? {...state, appointments} : {...state}
    }
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState)


  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    
    return axios.put(`/api/appointments/${id}`, appointment)
    .then(response => dispatch({ type: SET_INTERVIEW, id, interview, appointments }))
  }

  function cancelInterview(id) {
    return axios.delete(`/api/appointments/${id}`)
    .then(response => dispatch({ type: SET_INTERVIEW, id, interview: null }))
  }


  const setDay = day => dispatch({type:SET_DAY, day});

  useEffect(() => {
    const days = axios.get('/api/days')
    const appointments = axios.get('/api/appointments')
    const interviewers = axios.get('/api/interviewers')
    Promise.all([result1, result2, result3]).then((all) => {
      dispatch({ type: SET_APPLICATION_DATA, days, appointments, interviewers })
    })
    .catch(function(error) {
      console.log(error)
    })}, [])

  return {initialState, setDay, bookInterview, cancelInterview}
  
}
