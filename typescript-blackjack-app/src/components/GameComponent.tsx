import React, { useState } from 'react';
import * as blackjack from '../models/game';
import { HandsComponent } from './HandsComponent';
import { DealerComponent } from './DealerComponent';
import { newPlayer } from '../models/player';
import { Hand } from '../models/hand';
import { getValues } from '../models/deck';

const getRoundSummary = (game: blackjack.Game) => {
  console.log('getRoundSummary');
  const dealerHandValue = Array.from(getValues(game.dealer.cards))
    .filter(v => v <= 21)
    .reduce((x,y) => x > y ? x : y, 0);
  const playerHandValues = game.players[0].hands.map(h => 
    Array.from(getValues(h.cards))
      .filter(v => v <= 21)
      .reduce((x,y) => x > y ? x : y, 0)
  );
  const nWinningPlayerHands = playerHandValues.filter(hv => hv > dealerHandValue);
  if(nWinningPlayerHands.length > 0) {
    // player wins
    if(nWinningPlayerHands.length === 1) {
      return `${game.players[0].name} Wins`;
    } else {
      return `${game.players[0].name} wins ${nWinningPlayerHands.length} hands`;
    }
  } else {
    // dealer wins
    if(dealerHandValue <= 21) {
      if(playerHandValues.some(x => x < 21 && x !== 0)) {
        return "Dealer Wins";
      } else {
        return `Dealer Wins (${game.players[0].name} busted)`;
      }
    } else {
      return "Both Busted";
    }
  }
  // player wins with Blackjack
};

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

  // check if we need to start a new round
  const allPlayersHaveStayed = Array.from(game.stays.values())
    .every(x => x);
  if(allPlayersHaveStayed) { // New Round
    game.isRoundOver = true;
  }
  setGame(newGame);
};

const newRound = (game: blackjack.Game, setGame: (game: React.SetStateAction<blackjack.Game>) => void) => {
    console.log('newRound');
    let newGame = {...game}; 
    game.dealer.cards.length = 0;
    blackjack.dealCard(newGame.deck, newGame.dealer.cards, newGame.discard);
    blackjack.dealCard(newGame.deck, newGame.dealer.cards, newGame.discard);
    for (const player of game.players) {
      player.hands.length = 1
      player.hands[0].cards.length = 0;

      // deal new cards
      blackjack.dealCard(newGame.deck, player.hands[0].cards, newGame.discard);
      blackjack.dealCard(newGame.deck, player.hands[0].cards, newGame.discard);
    }
    const playersWithBlackjacks = game.players.filter(p => blackjack.hasBlackjack(game.dealer.cards, p.hands[0].cards));
    if(playersWithBlackjacks.length > 0) {
      playersWithBlackjacks.forEach(p => {
        p.money += p.hands[0].bet * game.blackJackPayout;
      });
      newGame.isRoundOver = true;
    } else {
      newGame.isRoundOver = false;
    }
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
  const showInsurance = () => { return true; }
  const doubleDown = () => {
    console.log('doubleDown');
  };
  const showDoubleDown = () => { return true; }

  const displayComponent = (game: blackjack.Game) => {
    if(game.isRoundOver) {
      return (
        <>
          <h1>{getRoundSummary(game)}</h1>
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
          <button onClick={() => newRound(game, setGame)}>New Round</button>
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