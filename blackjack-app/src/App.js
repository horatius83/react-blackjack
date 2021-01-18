import logo from './logo.svg';
import './App.css';
import Player from './models/player.js'
import Deck from './models/deck.js'

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
