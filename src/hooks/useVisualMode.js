import React, {useState} from "react";

export function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(newMode, replace=false) {
    if (replace) {
      setHistory(history)
    } else {
      setHistory([...history, newMode]);
    }
    setMode(newMode);
  }

  function back() {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1)
      setHistory(newHistory)
      setMode(newHistory[newHistory.length-1])
    }
  }

  return { mode, transition, back };

};