import React, { useState } from 'react';
import * as blackjack from '../models/game';
import { HandsComponent } from './HandsComponent';
import { PlayerControlsComponent } from './PlayerControlsComponent';
import { DealerComponent } from './DealerComponent';
import { newPlayer } from '../models/player';

export function GameComponent() {
  const player = newPlayer("Max", 1000); 
  const [game, setGame] = useState(blackjack.newGame([player], 100, 1000, 3.0/2.0, 1, 2));

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
      <DealerComponent  cards={game.dealer.cards} />
      <HandsComponent name={game.players[0].name} hands={game.players[0].hands} showAll={true}/>
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