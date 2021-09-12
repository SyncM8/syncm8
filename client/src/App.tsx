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
        <img alt="logo" className="App-logo" src={logo} />

        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>

        <a
          className="App-link"
          href="https://reactjs.org"
          rel="noopener noreferrer"
          target="_blank"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
