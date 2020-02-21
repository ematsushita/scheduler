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

  function countSpots(id, flag) {

    const matchedDay = state.days.filter(weekday => weekday.appointments.includes(id))[0]
    const dayId = matchedDay.id;

    let newSpots = state.days[dayId - 1].spots;

    if (flag && state.appointments[id].interview === null) {
      newSpots--;
    } else if (!flag) {
      newSpots++
    }

    return state.days.map(day => {
      if (day.id !== dayId) {
        return day
      } return {
        ...day, 
        spots: newSpots
      }
    })
  }
  


  function bookInterview(id, interview) {

    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const days = countSpots(id, true)

    
    return axios.put(`/api/appointments/${id}`, appointment)
    .then(() => dispatch({ type: SET_INTERVIEW, id, interview, appointments, days }))
  }

  function cancelInterview(id) {
    const days = countSpots(id, false)
    return axios.delete(`/api/appointments/${id}`)
    .then(() => dispatch({ type: SET_INTERVIEW, id, interview: null, days}))
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
      dispatch({ type: SET_APPLICATION_DATA, days, appointments, interviewers })
    })
    .catch(function(error) {
      console.log(error)
    })}, [])

  return {state, setDay, bookInterview, cancelInterview}
  
}
