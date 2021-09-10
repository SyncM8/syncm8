import React from "react";
import logo from "./logo.svg";





import "./App.css";

const myAdd2: (baseValue: number, increment: number) => number = function (
  x,
  y
) {
  return x + y;
};

console.log(myAdd2(1, 2));

function App(): React.ReactElement {
  return (
    <div className="App">
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
