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
        hit={props.game.hit} 
        stay={props.game.stay} 
        split={props.game.split} 
        insurance={props.game.insurance} 
        doubleDown={props.game.doubleDown} />
    </div>
  );
}

function PlayerControlsComponent(props) {
  return (
    <span>
      <button onClick={props.hit}>Hit</button>
      <button onClick={props.stay}>Stay</button>
      <button onClick={props.split}>Split</button>
      <button onClick={props.insurance}>Insurance</button>
      <button onClick={props.doubleDown}>Double Down</button>
    </span>
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
  return (
    <div className="App">
      <HandComponent player={dealer} />
      <HandComponent player={player} />
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
