import React from "react";
import { storiesOf } from "@storybook/react";
import { HelloWorld } from "./index";

const story = storiesOf("Components|Index", module);

story.add("John", () => <HelloWorld name="John" />);
story.add("Mark", () => <HelloWorld name="Mark" />);
