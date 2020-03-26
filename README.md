# Ethers.js Contract React Hooks

Automagically generate hooks from Ethers.js contract functions.

## Hooks

### useContractFunctionHook

```tsx
const {
  call,
  send,
  state,
  events,
  receipt,
  transaction,
  transactionHash,
  error,
  errorMessage,
} = useContractFunctionHook(contractInstance, "methodName");
```

## Sample usage

```tsx
export const TestHook = ({ contract }: { contract: DocumentStore }): ReactElement => {
  const { state, send, events, receipt, transaction, transactionHash, errorMessage } = useContractFunctionHook(
    contract,
    "issue"
  );
  const [hash, setHash] = useState("0x3e912831190e8fab93f35f16ba29598389cba9a681b2c22f49d1ec2701f15cd0");
  const handleTransaction = (): void => {
    send(hash);
  };
  return (
    <div>
      <input value={hash} onChange={(e) => setHash(e.target.value)} style={{ width: "100%" }} />
      <button onClick={handleTransaction}>Issue Merkle Root</button>
      <h2>Summary</h2>
      <p>Transaction State: {state}</p>
      <p>Transaction Hash: {transactionHash}</p>
      <p>Error: {errorMessage}</p>
      <h2>Transaction</h2>
      <pre>{JSON.stringify(transaction, null, 2)}</pre>
      <h2>Receipt</h2>
      <pre>{JSON.stringify(receipt, null, 2)}</pre>
      <h2>Events</h2>
      <pre>{JSON.stringify(events, null, 2)}</pre>
    </div>
  );
};
```

## Example application

An example application can be found in `/example/app.tsx`. The example is based off the document store smart contract used by OpenAttestation.

To run the example you will need to have a local ganache running:

```sh
npm run ganache
```

in a separate terminal, run the example application:

```sh
npm run example
```

your example application will now run at http://localhost:9001/

## Features

- [**React**](http://reactjs.org/) - A JavaScript library for building user interfaces.
- [**Webpack**](https://webpack.js.org/) - Component bundler.
- [**React testing library**](https://testing-library.com/) - Simple and complete testing utilities that encourage good testing practices.
- [**Jest**](https://facebook.github.io/jest) - JavaScript testing framework used by Facebook.
- [**ESLint**](http://eslint.org/) - Make sure you are writing a quality code.
- [**Prettier**](https://prettier.io/) - Enforces a consistent style by parsing your code and re-printing it.
- [**Typescript**](https://www.typescriptlang.org/) - JavaScript superset, providing optional static typing
- [**Circle CI**](https://circleci.com/) - Automate tests and linting for every push or pull request.
- [**Storybook**](https://storybook.js.org/) - Tool for developing UI components in isolation with documentation.
- [**Semantic Release**](https://semantic-release.gitbook.io/semantic-release/) - Fully automated version management and package publishing.
- [**Debug**](https://github.com/visionmedia/debug) - JS debugging utility that works both in node.js and browsers.

## Development

- `npm run storybook`: to start storybook, create stories and visualize the different component
- `npm run test`: to run tests
- `npm run lint`: to run lint
- `npm run example`: to run the example build with the library to develop an hosting application. Don't forget to update the example if you update this library.
