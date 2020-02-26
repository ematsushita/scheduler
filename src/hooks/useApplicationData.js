import {useEffect, useReducer} from "react";
import axios from 'axios';
import {
  reducer,
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW
} from "reducers/application";


const initialState = {
  day: "Monday", 
  days: [],
  appointments: {}, 
  interviewers: {}
}


export default function useApplicationData(){

  const [state, dispatch] = useReducer(reducer, initialState)


  //Function to count empty available spots on a given day - receives 'true' or 'false' to determine
  //whether to increase or decrease spots 
  function countSpots(id, flag) {

    const matchedDay = state.days.filter(weekday => weekday.appointments.includes(id))[0]
    const dayId = matchedDay.id;

    let newSpots = state.days[dayId - 1].spots;

    if (flag && state.appointments[id].interview === null) {
      newSpots--;
    } else if (!flag) {
      newSpots++
    };

    return state.days.map(day => {
      if (day.id !== dayId) {
        return day
      } return {
        ...day, 
        spots: newSpots
      }
    });
  };
  


  function bookInterview(id, interview) {

    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    //Count updated spots available
    const days = countSpots(id, true);
    //Create new appointment in database
    return axios.put(`/api/appointments/${id}`, appointment)
    .then(() => dispatch({ type: SET_INTERVIEW, interview, appointments, days }))
  };

  function cancelInterview(id) {

    const appointment = {
      ...state.appointments[id],
      interview: null
    };

    const appointments = {
      ...state.appointments, 
      [id]:appointment
    };
    //Count updated spots available
    const days = countSpots(id, false);
    return axios.delete(`/api/appointments/${id}`)
    .then(() => dispatch({ type: SET_INTERVIEW, interview: null, days, appointments}))
  };


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
