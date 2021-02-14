import React, { useState } from 'react';
import * as blackjack from '../models/game';
import { HandsComponent } from './HandsComponent';
import { DealerComponent } from './DealerComponent';
import { newPlayer } from '../models/player';
import { Hand } from '../models/hand';

const hit = (hand: Hand, game: blackjack.Game, setGame: (game: React.SetStateAction<blackjack.Game>) => void) => {
  console.log('hit');
  let newGame = {...game}; 
  // Need a way for different players to hit
  blackjack.hit(newGame, hand);
  setGame(newGame);
};

const stay = (hand: Hand, game: blackjack.Game, setGame: (game: React.SetStateAction<blackjack.Game>) => void) => {
  console.log('stay');
  let newGame = {...game}; 
  blackjack.stay(hand, newGame);
  setGame(newGame);
};

export function GameComponent() {
  const player = newPlayer("Max", 1000); 
  const [game, setGame] = useState(blackjack.newGame([player], 100, 1000, 3.0/2.0, 1, 2));

  const showHit = () => { return !game.isRoundOver; }

  const insurance = () => {
    console.log('insurance');
  };
  const showInsurance = () => blackjack.shouldShowInsurance(game);
  const doubleDown = () => {
    console.log('doubleDown');
  };
  const showDoubleDown = () => { return true; }

  const displayComponent = (game: blackjack.Game) => {
    if(game.isRoundOver) {
      return (
        <>
          <DealerComponent  cards={game.dealer.cards} showAll={true}/>
          <HandsComponent name={
            game.players[0].name} 
            hands={game.players[0].hands} 
            showAll={true}
            money={game.players[0].money}
            hit={(hand: Hand) => hit(hand, game, setGame)}
            showHit={() => false}
            stay={(hand: Hand) => stay(hand, game, setGame)}
            showStay={() => false}
            split={(hand: Hand) => blackjack.split(game, hand, setGame)}
            showSplit={() => false}
            insurance={insurance}
            showInsurance={() => false}
            doubleDown={doubleDown}
            showDoubleDown={() => false}
            showHandSummaries={() => true}
            handSummary={(hand: Hand) => blackjack.getHandSummary(game, hand)}
          />
          <button onClick={() => blackjack.newRound(game, setGame)}>New Round</button>
        </>
      );
    } else {
      return (
        <div className="game">
          <DealerComponent  cards={game.dealer.cards} showAll={false}/>
          <HandsComponent name={
            game.players[0].name} 
            hands={game.players[0].hands} 
            showAll={true}
            money={game.players[0].money}
            hit={(hand: Hand) => hit(hand, game, setGame)}
            showHit={showHit}
            stay={(hand: Hand) => stay(hand, game, setGame)}
            showStay={() => true}
            split={(hand: Hand) => blackjack.split(game, hand, setGame)}
            showSplit={(h: Hand) => blackjack.shouldShowSplit(game, h)}
            insurance={insurance}
            showInsurance={showInsurance}
            doubleDown={doubleDown}
            showDoubleDown={showDoubleDown}
            showHandSummaries={() => false}
            handSummary={(hand: Hand) => blackjack.getHandSummary(game, hand)}
          />
        </div>
      ); 
    }
  }

  return displayComponent(game);
}