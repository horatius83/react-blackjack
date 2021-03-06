import React from 'react';

export function PlayerControlsComponent(props: {
    hit: () => void, 
    showHit: () => boolean,
    stay: () => void,
    showStay: () => boolean,
    split: () => void,
    showSplit: () => boolean,
    insurance: () => void,
    showInsurance: () => boolean,
    doubleDown: () => void,
    showDoubleDown: () => boolean
  }) {
  return (
    <div>
      <span>
        { props.showHit() ? <button onClick={props.hit}>Hit</button> : null }
        { props.showStay() ? <button onClick={props.stay}>Stay</button> : null}
        { props.showSplit() ? <button onClick={props.split}>Split</button> : null }
        { props.showInsurance() ? <button onClick={props.insurance}>Insurance</button> : null }
        { props.showDoubleDown() ? <button onClick={props.doubleDown}>Double Down</button> : null }
      </span>
    </div>
  );
}