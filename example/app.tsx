import React, { useState } from "react";
import ReactDOM from "react-dom";
import { HelloWorld } from "../src";

const App = (): React.ReactElement => {
  const [name, setName] = useState("");
  return (
    <div>
      <h1>Enter your name</h1>
      <input value={name} onChange={e => setName(e.target.value)} />
      <HelloWorld name={name} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
