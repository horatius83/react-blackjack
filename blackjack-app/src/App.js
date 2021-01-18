import logo from './logo.svg';
import './App.css';
import Card from './models/card.js'

function CardComponent(props) {
  const cardClass = `card ${props.card.color}`;
  return (
    <>
      <span className={cardClass}>{props.card.unicodeChar}</span>
    </>
  )
}

function HandComponent(props) {
  const cards = [
    new Card('Ace', 'Spades', true),
    new Card('Ace', 'Hearts', true),
    new Card('2', 'Clubs', false)
  ];
  return (
    <>
      <h1>Hand Component</h1>
      {cards.map((x,i) => <CardComponent key={i} card={x} />)}
    </>
  )
}

function App() {
  return (
    <div className="App">
      <HandComponent />
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
