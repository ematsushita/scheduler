import {useState, useEffect, useReducer} from "react";
import axios from 'axios';
import DayList from "components/DayList";

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

    const {appointments, interview, days} = action
    return interview ? {...state, appointments, days} : {...state, days}
  }
  default:
    throw new Error(
      `Tried to reduce with unsupported action type: ${action.type}`
    );
  }
}




export default function useApplicationData(){

  const [state, dispatch] = useReducer(reducer, initialState)

  function countSpots(appt_id, days, appointments) {

    let spots = 0;
  
    const matchedDay = days.filter(weekday => weekday.appointments.includes(appt_id))[0]
    const dayAppts = matchedDay.appointments
  
    for (let app of dayAppts) {
      if (appointments[app].interview === null) {
        spots += 1;
      }
    }
  
    matchedDay.spots = spots;
    const day_id = matchedDay.id;
    const newerBetterDays = days

    newerBetterDays[day_id - 1] = matchedDay

    return newerBetterDays;
  }
  


  function bookInterview(appt_id, interview) {
    console.log('wat2');

    const appointment = {
      ...state.appointments[appt_id],
      interview: interview ? { ...interview } : null
    };

    const appointments = {
      ...state.appointments,
      [appt_id]: appointment
    };

    const days = countSpots(appt_id, state.days, appointments)
    console.log("days spots, yo", days.map(day => `${day.name} ${day.spots}`))
    
    return axios.put(`/api/appointments/${appt_id}`, appointment)
    .then(response => dispatch({ type: SET_INTERVIEW, appt_id, interview, appointments, days }))
  }

  function cancelInterview(id) {
    return axios.delete(`/api/appointments/${id}`)
    .then(response => dispatch({ type: SET_INTERVIEW, id, interview: null }))
  }


  const setDay = day => dispatch({type:SET_DAY, day});

  useEffect(() => {
    const daysPromise = axios.get('/api/days')
    const appointmentsPromise = axios.get('/api/appointments')
    const interviewersPromise = axios.get('/api/interviewers')
    Promise.all([daysPromise, appointmentsPromise, interviewersPromise]).then((all) => {
      let days = all[0].data;
      let appointments = all[1].data;
      let interviewers = all[2].data;
      console.log("boogada", days)
      dispatch({ type: SET_APPLICATION_DATA, days, appointments, interviewers })
    })
    .catch(function(error) {
      console.log(error)
    })}, [])

  return {state, setDay, bookInterview, cancelInterview}
  
}
