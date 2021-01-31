import React from 'react';
import logo from './logo.svg';
import './App.css';
import { newPlayer } from './models/player';
import { newGame } from './models/game';
import { GameComponent } from './components/GameComponent';


function App() {
  const player = newPlayer("Max", 1000); 
  const game = newGame([player], 100, 1000, 3.0/2.0, 1);

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
