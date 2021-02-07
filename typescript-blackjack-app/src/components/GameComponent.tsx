import React, { useState } from 'react';
import * as blackjack from '../models/game';
import { HandsComponent } from './HandsComponent';
import { DealerComponent } from './DealerComponent';
import { newPlayer } from '../models/player';
import { Hand } from '../models/hand';

export function GameComponent() {
  const player = newPlayer("Max", 1000); 
  const [game, setGame] = useState(blackjack.newGame([player], 100, 1000, 3.0/2.0, 1, 2));

  const hit = (hand: Hand) => {
    console.log('hit');
    let newGame = {...game}; 
    // Need a way for different players to hit
    blackjack.hit(game.players[0], newGame, hand);
    setGame(newGame);
  };
  const showHit = () => { return !game.isRoundOver; }
  const stay = () => {
    console.log('stay');
    let newGame = {...game}; 
    blackjack.stay(game.players[0], newGame);

    // check if we need to start a new round
    const allPlayersHaveStayed = Array.from(game.stays.values())
      .every(x => x);
    if(allPlayersHaveStayed) { // New Round
      game.isRoundOver = true;
    }
    setGame(newGame);
  };

  const newRound = () => {
    console.log('newRound');
    let newGame = {...game}; 
    game.dealer.cards.length = 0;
    blackjack.dealCard(game.deck, game.dealer.cards, game.discard);
    blackjack.dealCard(game.deck, game.dealer.cards, game.discard);
    for (const player of game.players) {
      player.hands.length = 1
      player.hands[0].cards.length = 0;

      // deal new cards
      blackjack.dealCard(game.deck, player.hands[0].cards, game.discard);
      blackjack.dealCard(game.deck, player.hands[0].cards, game.discard);
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

  const displayComponent = (game: blackjack.Game) => {
    if(game.isRoundOver) {
      return (
        <>
          <h1>Round Over Yo</h1>
          <DealerComponent  cards={game.dealer.cards} />
          <HandsComponent name={
            game.players[0].name} 
            hands={game.players[0].hands} 
            showAll={true}
            money={game.players[0].money}
            hit={hit}
            showHit={() => false}
            stay={stay}
            showStay={() => false}
            split={split}
            showSplit={() => false}
            insurance={insurance}
            showInsurance={() => false}
            doubleDown={doubleDown}
            showDoubleDown={() => false}
          />
          <button onClick={newRound}>New Round</button>
        </>
      );
    } else {
      return (
        <div className="game">
          <DealerComponent  cards={game.dealer.cards} />
          <HandsComponent name={
            game.players[0].name} 
            hands={game.players[0].hands} 
            showAll={true}
            money={game.players[0].money}
            hit={hit}
            showHit={showHit}
            stay={stay}
            showStay={() => true}
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
  }

  return displayComponent(game);
}