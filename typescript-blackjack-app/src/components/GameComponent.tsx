import React, { useState } from 'react';
import * as blackjack from '../models/game';
import { HandsComponent } from './HandsComponent';
import { DealerComponent } from './DealerComponent';
import { newPlayer } from '../models/player';
import { Hand } from '../models/hand';
import { Rank } from '../models/card';

const hit = (hand: Hand, game: blackjack.Game, setGame: (game: React.SetStateAction<blackjack.Game>) => void) => {
  console.log('hit');
  let newGame = {...game}; 
  // Need a way for different players to hit
  blackjack.hit(game.players[0], newGame, hand);
  setGame(newGame);
};

const stay = (game: blackjack.Game, setGame: (game: React.SetStateAction<blackjack.Game>) => void) => {
  console.log('stay');
  let newGame = {...game}; 
  blackjack.stay(game.players[0], newGame);
  setGame(newGame);
};

export function GameComponent() {
  const player = newPlayer("Max", 1000); 
  const [game, setGame] = useState(blackjack.newGame([player], 100, 1000, 3.0/2.0, 1, 2));

  const showHit = () => { return !game.isRoundOver; }

  const split = () => {
    console.log('split')
  };
  const showSplit = () => { return true; }
  const insurance = () => {
    console.log('insurance');
  };
  const showInsurance = () => { return !game.isRoundOver && game.dealer.cards.length === 2 && game.dealer.cards[1].rank === Rank.Ace }
  const doubleDown = () => {
    console.log('doubleDown');
  };
  const showDoubleDown = () => { return true; }

  const displayComponent = (game: blackjack.Game) => {
    if(game.isRoundOver) {
      return (
        <>
          <h1>{blackjack.getRoundSummary(game)}</h1>
          <DealerComponent  cards={game.dealer.cards} showAll={true}/>
          <HandsComponent name={
            game.players[0].name} 
            hands={game.players[0].hands} 
            showAll={true}
            money={game.players[0].money}
            hit={(hand: Hand) => hit(hand, game, setGame)}
            showHit={() => false}
            stay={() => stay(game, setGame)}
            showStay={() => false}
            split={split}
            showSplit={() => false}
            insurance={insurance}
            showInsurance={() => false}
            doubleDown={doubleDown}
            showDoubleDown={() => false}
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
            stay={() => stay(game, setGame)}
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