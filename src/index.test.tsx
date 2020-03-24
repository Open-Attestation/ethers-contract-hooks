import React from "react";
import { render } from "@testing-library/react";
import { HelloWorld } from "./index";

// See https://testing-library.com/docs/react-testing-library/intro

describe("helloWorld", () => {
  it("should render correctly", () => {
    const { getByTestId } = render(<HelloWorld name="John" />);
    expect(getByTestId("hello-world").textContent).toBe("Hello John");
  });
});
