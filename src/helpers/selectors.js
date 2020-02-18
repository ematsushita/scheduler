export function getAppointmentsForDay(state, day) {
  //if days data is empty, return []
  if (state.days.length === 0) {
    return [];
  }

  //filter days for day that matches days data
  const filteredDays = state.days.filter(weekday => weekday.name === day)


  //if filter returns nothing, return []
  if (filteredDays.length === 0) {
    return [];
  }

  //filter through appointment Keys to find ones that match appointment ids of given day
  const appointmentKeys = Object.keys(state.appointments);
  const results = [];
  for (let key of appointmentKeys) {
    if (filteredDays[0].appointments.includes(Number(key))) {
      results.push(state.appointments[key])
    }
  }
  return results;

}

