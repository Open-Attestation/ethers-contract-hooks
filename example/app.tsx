import React, { useState } from "react";
import ReactDOM from "react-dom";
import { TestHookContainer } from "../src";

const App = (): React.ReactElement => {
  return <TestHookContainer />;
};

ReactDOM.render(<App />, document.getElementById("root"));
