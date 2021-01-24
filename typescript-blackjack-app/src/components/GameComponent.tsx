import React from 'react';
import { Game } from '../models/game';
import { HandComponent } from './HandComponent';
import { PlayerControlsComponent } from './PlayerControlsComponent';

export function GameComponent(props: {game: Game}) {
  return (
    <div className="game">
      <HandComponent player={props.game.dealer} showAll={false}/>
      <HandComponent player={props.game.player} showAll={true}/>
      {props.game.otherPlayers.map((x, i) => <HandComponent key={i} player={x} showAll={false}/>)}
      <PlayerControlsComponent 
        game={props.game} />
    </div>
  );
}