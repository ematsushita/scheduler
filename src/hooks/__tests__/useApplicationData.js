import {useState, useEffect} from "react";
import axios from 'axios';


export default function useApplicationData(){
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

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
    .then(response => setState({
      ...state,
      appointments
    }))
  }

  function cancelInterview(id) {
    return axios.delete(`/api/appointments/${id}`)
    .then(response => console.log(response.status))
  }


  const setDay = day => setState({ ...state, day });

  useEffect(() => {
    const result1 = axios.get('/api/days')
    const result2 = axios.get('/api/appointments')
    const result3 = axios.get('/api/interviewers')
    Promise.all([result1, result2, result3]).then((all) => {
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}))
    })
    .catch(function(error) {
      console.log(error)
    })}, [])

  return {state, setDay, bookInterview, cancelInterview}
  
}
