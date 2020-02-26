export function getAppointmentsForDay(state, day) {
  if (state.days.length === 0) {
    return [];
  }
  const filteredDays = state.days.filter(weekday => weekday.name === day)
  if (filteredDays.length === 0) {
    return [];
  }
  const appointmentKeys = Object.keys(state.appointments);
  const results = [];
  for (let key of appointmentKeys) {
    if (filteredDays[0].appointments.includes(Number(key))) {
      results.push(state.appointments[key])
    }
  }
  return results;

}

export function getInterviewersByDay(state, day) {
  const results = [];
  if (state.days.length === 0) {
    return results;
  }

  const matchedDay = state.days.filter(weekday => weekday.name === day)

  if (matchedDay.length === 0) {
    return results;
  } 

  const interviewerKeys = Object.keys(state.interviewers)

  for (let key of interviewerKeys) {
    if (matchedDay[0].interviewers.includes(Number(key))) {
      results.push(state.interviewers[key])
    }
  }
  return results;

};

export function getInterview(state, interview) {
  
  if (!interview) {
    return null;
  }
  const results = {}

  results["student"] = interview.student;
  
  const interviewerKeys = Object.keys(state.interviewers)

  for (let key of interviewerKeys) {
    if (Number(key) === interview.interviewer) {
      results["interviewer"] = state.interviewers[key]
      
    } 
  }

  return results;
};