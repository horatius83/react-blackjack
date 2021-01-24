import React from 'react';

export function PlayerControlsComponent(props: {
    hit: () => void, 
    stay: () => void,
    split: () => void,
    insurance: () => void,
    doubleDown: () => void
  }) {
  return (
    <div>
      <span>
        <button onClick={props.hit}>Hit</button>
        <button onClick={props.stay}>Stay</button>
        <button onClick={props.split}>Split</button>
        <button onClick={props.insurance}>Insurance</button>
        <button onClick={props.doubleDown}>Double Down</button>
      </span>
    </div>
  );
}