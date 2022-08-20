import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';

interface ConsoleTyperProps {
  message: string;
  speed: number;
  flicks: number;
}

interface ConsoleTyperState {
  txt: string;
  idx: number;
}

export const ConsoleTyper = observer((props: ConsoleTyperProps) => {
  const [state, setState] = useState({
    txt: '',
    idx: 0,
  } as ConsoleTyperState);

  useEffect(() => {
    if (state.idx < props.message.length) {
      let timerID = setInterval(() => {
        setState({
          txt: state.txt + props.message[state.idx],
          idx: state.idx + 1,
        });
      }, props.speed);
      return function cleanup() {
        clearInterval(timerID);
      };
    }
  });

  return <span>{state.txt}</span>;
});
