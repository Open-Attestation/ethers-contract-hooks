import React, { useState } from "react";
import ReactDOM from "react-dom";
import { TestHook } from "../src";

const App = (): React.ReactElement => {
  return <TestHook />;
};

ReactDOM.render(<App />, document.getElementById("root"));
