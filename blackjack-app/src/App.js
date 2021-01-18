import logo from './logo.svg';
import './App.css';

function CardComponent(props) {
  return (
    <>
      <h1>Card Component</h1>
    </>
  )
}

function HandComponent(props) {
  return (
    <>
      <h1>Hand Component</h1>
      <CardComponent />
      <CardComponent />
      <CardComponent />
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
