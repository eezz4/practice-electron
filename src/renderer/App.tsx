import "./App.css";
import logo from "./logo.svg";
import { typiaExp } from "./typiaExp/typiaExp";

const { ipcRenderer } = window.require("electron");

typiaExp();

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <button
          onClick={() => {
            ipcRenderer.invoke("ipcChecker").then(console.log);
          }}
        >
          ipcChecker
        </button>
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
