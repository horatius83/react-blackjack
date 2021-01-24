import React from 'react';
import { Game } from '../models/game';
import { HandComponent } from './HandComponent';
import { PlayerControlsComponent } from './PlayerControlsComponent';

export function GameComponent(props: {game: Game}) {
  return (
    <div className="game">
      <HandComponent player={props.game.dealer} />
      <HandComponent player={props.game.player} />
      {props.game.otherPlayers.map((x, i) => <HandComponent key={i} player={x} />)}
      <PlayerControlsComponent 
        game={props.game} />
    </div>
  );
}