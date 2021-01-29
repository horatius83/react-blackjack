import React, { useState } from 'react';
import * as blackjack from '../models/game';
import Player from '../models/player';
import { HandComponent } from './HandComponent';
import { PlayerControlsComponent } from './PlayerControlsComponent';

export function GameComponent(props: {game: blackjack.Game}) {
  const [game, setGame] = useState(props.game);

  const hit = () => {
    console.log('hit');
    let newGame = {...game}; 
    // Need a way for different players to hit
    blackjack.hit(game.players[0], newGame);
    setGame(newGame);
  };
  const stay = () => {
    console.log('stay');
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
      <HandComponent name="Dealer" hand={props.game.dealer.cards} showAll={false}/>
      <HandComponent name={props.game.players[0].name} hand={props.game.players[0].hands[0]} showAll={true}/>
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