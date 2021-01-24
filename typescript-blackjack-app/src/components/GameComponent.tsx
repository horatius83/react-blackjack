import React, { useState } from 'react';
import { Game } from '../models/game';
import { HandComponent } from './HandComponent';
import { PlayerControlsComponent } from './PlayerControlsComponent';

export function GameComponent(props: {game: Game}) {
  const gameState = {
    dealer: {
      name: 'Dealer',
      cards: []
    },
    player: {
      name: 'Max',
      cash: 100,
      cards: []
    },
    deck: []
  };
  const [game, setGame] = useState(props.game);
  const hit = () => {
    console.log('hit');
    game.hit();
    debugger;
    setGame(game);
  };
  const stay = () => {
    console.log('stay');
    game.stay();
    setGame(game);
  };
  const split = () => {
    console.log('split')
  };
  const insurance = () => {
    console.log('insurance');
  };
  const doubleDown = () => {
    console.log('doubleDown');
  };

  return (
    <div className="game">
      <HandComponent player={props.game.dealer} showAll={false}/>
      <HandComponent player={props.game.player} showAll={true}/>
      {props.game.otherPlayers.map((x, i) => <HandComponent key={i} player={x} showAll={false}/>)}
      <PlayerControlsComponent 
        hit={hit}     
        stay={stay}
        split={split}
        insurance={insurance}
        doubleDown={doubleDown}
      />
    </div>
  );
}