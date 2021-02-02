import React, { useState } from 'react';
import * as blackjack from '../models/game';
import { HandsComponent } from './HandsComponent';
import { PlayerControlsComponent } from './PlayerControlsComponent';
import { DealerComponent } from './DealerComponent';
import { newPlayer } from '../models/player';
import { deal } from '../models/deck';

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
  const showHit = () => { return true; }
  const stay = () => {
    console.log('stay');
    let newGame = {...game}; 
    blackjack.stay(game.players[0], newGame);
    // check if we need to start a new round
    const allPlayersHaveStayed = Array.from(game.stays.values())
      .every(x => x);
    if(allPlayersHaveStayed) { // New Round
      game.dealer.cards.length = 0;
      for (const player of game.players) {
        player.hands.length = 1
        player.hands[0].cards.length = 0;
      }
      const cardsNeeded = 2 + game.players.length * 2;

    }
    setGame(newGame);
  };
  const split = () => {
    console.log('split')
  };
  const showSplit = () => { return true; }
  const insurance = () => {
    console.log('insurance');
  };
  const showInsurance = () => { return true; }
  const doubleDown = () => {
    console.log('doubleDown');
  };
  const showDoubleDown = () => { return true; }

  return (
    <div className="game">
      <DealerComponent  cards={game.dealer.cards} />
      <HandsComponent name={
        game.players[0].name} 
        hands={game.players[0].hands} 
        showAll={true}
        hit={hit}
        showHit={showHit}
        stay={stay}
        split={split}
        showSplit={showSplit}
        insurance={insurance}
        showInsurance={showInsurance}
        doubleDown={doubleDown}
        showDoubleDown={showDoubleDown}
      />
    </div>
  );
}