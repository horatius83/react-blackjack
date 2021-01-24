import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Card, Rank, Suit } from './models/card';
import { HandComponent } from './components/HandComponent';
import Player from './models/player';
import Deck, { newDeck } from './models/deck';
import { Game } from './models/game';
import { GameComponent } from './components/GameComponent';


function App() {
  const deck = new Deck([
    new Card(Rank.Ace, Suit.Spades),
    new Card(Rank.King, Suit.Hearts)
  ]);
  const player = new Player("Max", deck, 100);
  const dealer = new Player("Dealer", new Deck(), 1000);
  const game = new Game(dealer, player, [], newDeck())

  return (
    <div className="App">
      <GameComponent game={game} />
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
