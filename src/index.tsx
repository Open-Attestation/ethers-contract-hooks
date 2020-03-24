import React, { FunctionComponent } from "react";

interface HelloWorld {
  name: string;
}

export const HelloWorld: FunctionComponent<HelloWorld> = ({ name }) => {
  return <div data-testid="hello-world">Hello {name}</div>;
};
