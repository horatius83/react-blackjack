import React, { useState } from 'react';
import * as blackjack from '../models/game';
import { HandsComponent } from './HandsComponent';
import { DealerComponent } from './DealerComponent';
import Player, { newPlayer } from '../models/player';
import { Hand } from '../models/hand';
import { RulesComponent } from './RulesComponent';
import { GameOverComponent } from './GameOverComponent';
import { PlaceBetComponent } from './BetComponent';

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
  let newGame = {...game};
  blackjack.doubleDown(newGame, hand, rules);
  setGame(newGame);
}

const setBet = (hand: Hand, game: blackjack.Game, rules: blackjack.Rules, value: number, setGame: (game: React.SetStateAction<blackjack.Game>) => void) => {
  console.log('changed bet');
  if(value < rules.minimumBet) {
    console.log(`changed bet: ${value} is less than the minimum bet of ${rules.minimumBet}`);
    return;
  }
  if(value > rules.maximumBet) {
    console.log(`changed bet: ${value} is greater than the maximum bet of ${rules.maximumBet}`);
    return;
  }
  let newGame = {...game};
  const players = newGame.players.filter(p => p.hands.filter(h => h === hand).length);
  if(!players.length) {
    return;
  }
  const player = players[0];
  const index = player.hands.indexOf(hand);
  const delta = hand.bet - value;
  player.money += delta;
  hand.bet = value;
  player.hands = [...player.hands.splice(0,index), ...player.hands.splice(index+1), hand]
  newGame.state = blackjack.GameState.Round;
  setGame(newGame);
}

const restartGame = (game: blackjack.Game, rules: blackjack.Rules, setGame: (game: React.SetStateAction<blackjack.Game>) => void) => {
  console.log('restartGame');
  const newGame = blackjack.newGame(game.players.map<Player>(p => {return {...p, hands: [], money: 1000}}), rules);
  newGame.state = blackjack.GameState.Init;
  setGame(newGame);
}

export function GameComponent() {
  const [rules, setRules] = useState({
    minimumBet: 100,
    maximumBet: 1000,
    blackJackPayout: {numerator: 3, denominator: 2},
    numberOfSplits: 1,
    numberOfDecks: 2,
    surrenderRules: blackjack.SurrenderRules.No
  });
  const player = newPlayer("Max", 1000); 
  const [game, setGame] = useState(blackjack.newGame([player], rules));

  const showInsurance = (hand: Hand) => blackjack.shouldShowInsurance(game, hand);

  const insurance = (hand: Hand, game: blackjack.Game, setGame: (game: React.SetStateAction<blackjack.Game>) => void) => {
    console.log('insurance');
    const newGame = {...game};
    hand.insurance = true;
    setGame(newGame);
  }

  const updateRules = (rules: blackjack.Rules, startingMoney: number) => {
    if(game.state === blackjack.GameState.Init) {
      setRules({...rules});  
      game.players.forEach(p => p.money = startingMoney);
      const newGame = blackjack.newGame(game.players, rules);
      newGame.state = blackjack.GameState.PlaceBets;
      setGame(newGame);
    }
  };

  const displayComponent = (game: blackjack.Game) => {
    switch(game.state) {
      case blackjack.GameState.Init: 
        return (<RulesComponent rules={rules} money={{minimum: 100, starting: 1000}} submit={updateRules}/>);
      case blackjack.GameState.PlaceBets:
        return (
          <PlaceBetComponent
            onBetChanged={(v: number) => setBet(game.players[0].hands[0], game, rules, v, setGame)}
            bets={{minimum: rules.minimumBet, maximum: rules.maximumBet}}
            previousBet={game.players[0].hands[0].bet}
            money={game.players[0].money}
          />
        );
      case blackjack.GameState.Round: 
      case blackjack.GameState.RoundEnd:
        return (
          <>
            <DealerComponent  cards={game.dealer.cards} showAll={game.state === blackjack.GameState.RoundEnd}/>
            <HandsComponent name={
              game.players[0].name} 
              hands={game.players[0].hands} 
              showAll={true}
              money={game.players[0].money}
              bets={{minimum: rules.minimumBet, maximum: rules.maximumBet}}
              hit={(hand: Hand) => hit(hand, game, rules, setGame)}
              showHit={(hand: Hand) => blackjack.showHit(game, hand)}
              stay={(hand: Hand) => stay(hand, game, rules, setGame)}
              showStay={(hand: Hand) => blackjack.shouldShowStay(game, hand)}
              split={(hand: Hand) => blackjack.split(game, hand, rules, setGame)}
              showSplit={(h: Hand) => blackjack.shouldShowSplit(game, h)}
              insurance={(hand: Hand) => insurance(hand, game, setGame)}
              showInsurance={(hand: Hand) => showInsurance(hand)}
              doubleDown={(hand: Hand) => doubleDown(hand, game, rules, setGame)}
              showDoubleDown={(hand: Hand) => blackjack.shouldShowDoubleDown(game, hand)}
              showHandSummaries={() => game.state === blackjack.GameState.RoundEnd}
              handSummary={(hand: Hand) => blackjack.getHandSummary(game, hand)}
            />
            {game.state === blackjack.GameState.RoundEnd 
              ? <button onClick={() => blackjack.newRound(game, rules, setGame)}>New Round</button> 
              : null
            }
          </>
        );
      case blackjack.GameState.GameOver: {
        return <GameOverComponent restart={() => restartGame(game, rules, setGame)} />
      }
      default: return (<><h1>Not Implemented</h1></>);
    }
  }

  return displayComponent(game);
}