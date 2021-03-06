import logo from './logo.svg';
import './App.css';
import Player from './models/player.js'
import Deck from './models/deck.js'
import { useState } from 'react';

class Game {
  constructor(dealer, player, otherPlayers, deck) {
    this._dealer = dealer;
    this._player = player;
    this._otherPlayers = otherPlayers;
    this._deck = deck;
    this._discard = [];
  }

  get dealer() {
    return this._dealer;
  }

  get player() {
    return this._player;
  }

  get otherPlayers() {
    return this._otherPlayers;
  }

  hit() {

  }

  stay() {

  }

  split() {

  }

  insurance() {

  }

  doubleDown() {

  }
}

function GameComponent(props) {
  return (
    <div className="game">
      <HandComponent player={props.game.dealer} />
      <HandComponent player={props.game.player} />
      {props.game.otherPlayers.map((x, i) => <HandComponent key={i} player={x} />)}
      <PlayerControlsComponent 
        game={props.game} />
    </div>
  );
}

function PlayerControlsComponent(props) {
  return (
    <div>
      <span>
        <button onClick={props.game.hit}>Hit</button>
        <button onClick={props.game.stay}>Stay</button>
        <button onClick={props.game.split}>Split</button>
        <button onClick={props.game.insurance}>Insurance</button>
        <button onClick={props.game.doubleDown}>Double Down</button>
      </span>
    </div>
  );
}

function CardComponent(props) {
  const cardClass = `card ${props.card.color}`;
  return (
    <>
      <span className={cardClass}>{props.card.unicodeChar}</span>
    </>
  )
}

function HandComponent(props) {
  return (
    <>
      <h1>{props.player.name}</h1>
      {props.player.deck.cards.map((x,i) => <CardComponent key={i} card={x} />)}
    </>
  )
}

function App() {
  const deck = new Deck();
  deck.shuffle();
  const player = new Player("Max", new Deck(deck.deal().concat(deck.deal())), true);
  const dealer = new Player("Dealer", new Deck(deck.deal().concat(deck.deal())), false);
  const game = new Game(dealer, player, [], deck);

  return (
    <div className="App">
      <GameComponent game={game} />
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
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
