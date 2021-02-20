import React, { useState } from 'react';
import * as blackjack from '../models/game';
import { HandsComponent } from './HandsComponent';
import { DealerComponent } from './DealerComponent';
import { newPlayer } from '../models/player';
import { Hand } from '../models/hand';

const hit = (hand: Hand, game: blackjack.Game, rules: blackjack.Rules, setGame: (game: React.SetStateAction<blackjack.Game>) => void) => {
  console.log('hit');
  let newGame = {...game}; 
  // Need a way for different players to hit
  blackjack.hit(newGame, hand, rules);
  setGame(newGame);
};

const stay = (hand: Hand, game: blackjack.Game, rules: blackjack.Rules, setGame: (game: React.SetStateAction<blackjack.Game>) => void) => {
  console.log('stay');
  let newGame = {...game}; 
  blackjack.stay(hand, newGame, rules);
  setGame(newGame);
};

const doubleDown = (hand: Hand, game: blackjack.Game, rules: blackjack.Rules, setGame: (game: React.SetStateAction<blackjack.Game>) => void) => {
  console.log('doubleDown');
  debugger;
  let newGame = {...game};
  blackjack.doubleDown(newGame, hand, rules);
  setGame(newGame);
}

export function GameComponent() {
  const player = newPlayer("Max", 1000); 
  const [rules, _] = useState({
    minimumBet: 100,
    maximumBet: 1000,
    blackJackPayout: 3 / 2,
    numberOfSplits: 1,
    numberOfDecks: 2,
    surrenderRules: blackjack.SurrenderRules.No
  });
  const [game, setGame] = useState(blackjack.newGame([player], rules));

  const showInsurance = (hand: Hand) => blackjack.shouldShowInsurance(game, hand);

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
            hit={(hand: Hand) => hit(hand, game, rules, setGame)}
            showHit={() => false}
            stay={(hand: Hand) => stay(hand, game, rules, setGame)}
            showStay={(hand: Hand) => blackjack.shouldShowStay(game, hand)}
            split={(hand: Hand) => blackjack.split(game, hand, rules, setGame)}
            showSplit={() => false}
            insurance={blackjack.insurance}
            showInsurance={() => false}
            doubleDown={(hand: Hand) => doubleDown(hand, game, rules, setGame)}
            showDoubleDown={(hand: Hand) => blackjack.shouldShowDoubleDown(game, hand)}
            showHandSummaries={() => true}
            handSummary={(hand: Hand) => blackjack.getHandSummary(game, hand)}
          />
          <button onClick={() => blackjack.newRound(game, rules, setGame)}>New Round</button>
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
            hit={(hand: Hand) => hit(hand, game, rules, setGame)}
            showHit={(hand: Hand) => blackjack.showHit(game, hand)}
            stay={(hand: Hand) => stay(hand, game, rules, setGame)}
            showStay={(hand: Hand) => blackjack.shouldShowStay(game, hand)}
            split={(hand: Hand) => blackjack.split(game, hand, rules, setGame)}
            showSplit={(h: Hand) => blackjack.shouldShowSplit(game, h)}
            insurance={blackjack.insurance}
            showInsurance={(hand: Hand) => showInsurance(hand)}
            doubleDown={(hand: Hand) => doubleDown(hand, game, rules, setGame)}
            showDoubleDown={(hand: Hand) => blackjack.shouldShowDoubleDown(game, hand)}
            showHandSummaries={() => false}
            handSummary={(hand: Hand) => blackjack.getHandSummary(game, hand)}
          />
        </div>
      ); 
    }
  }

  return displayComponent(game);
}