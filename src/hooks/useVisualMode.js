import React, {useState} from "react";

export function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(newMode, replace=false) {

    setMode(newMode);

    replace ? setHistory(history) : setHistory([...history, newMode])
  }

  function back() {

    const newHistory = history.slice(0, -1)
    setHistory(newHistory)

    history.length > 1 ? setMode(newHistory[newHistory.length-1]) : setMode(history[history.length-1])

  }

  return { mode, transition, back };

};