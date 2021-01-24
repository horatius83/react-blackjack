import React from 'react';
import { Game } from '../models/game';

export function PlayerControlsComponent(props: {game: Game}) {
  return (
    <div>
      <span>
        <button onClick={props.game.hit}>Hit</button>
        <button onClick={props.game.stay}>Stay</button>
        <button onClick={props.game.split}>Split</button>
        <button onClick={props.game.insurance}>Insurance</button>
        <button onClick={props.game.doubleDown}>Double Down</button>
      </span>
    </div>
  );
}