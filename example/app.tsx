import React, { useState, useEffect, ReactElement } from "react";
import ReactDOM from "react-dom";
import { providers } from "ethers";
import { DocumentStore } from "./contracts/DocumentStore";
import { DocumentStoreFactory } from "./contracts/DocumentStoreFactory";
import { useContractFunctionHook } from "../src";

const provider = new providers.JsonRpcProvider();
const signer = provider.getSigner();
const documentStoreFactory = new DocumentStoreFactory(signer);

export const TestHook = ({ contract }: { contract: DocumentStore }): ReactElement => {
  const { state, send, events, receipt, transaction, transactionHash, errorMessage } = useContractFunctionHook(
    contract,
    "issue"
  );
  const [hash, setHash] = useState("0x3e912831190e8fab93f35f16ba29598389cba9a681b2c22f49d1ec2701f15cd0");
  const handleTransaction = (): void => {
    send(hash);
  };
  const { call, value } = useContractFunctionHook(contract, "isIssued");
  const handleCheck = (): void => {
    call(hash);
  };

  return (
    <div data-testid="hello-world">
      <input value={hash} onChange={(e) => setHash(e.target.value)} style={{ width: "100%" }} />
      <button onClick={handleTransaction}>Issue Merkle Root</button>
      <button onClick={handleCheck}>Is Issued? {JSON.stringify(value, null, 2)} </button>
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

const App = (): ReactElement => {
  const [contract, setContract] = useState<DocumentStore>();
  const initializeDocumentStore = async (): Promise<void> => {
    const deployedContract = await documentStoreFactory.deploy();
    const address = await signer.getAddress();
    await deployedContract.initialize("TEST_DOCUMENT_STORE", address);
    setContract(deployedContract);
  };
  useEffect(() => {
    initializeDocumentStore();
  }, []);
  console.log(contract);
  return contract ? (
    <TestHook contract={contract} />
  ) : (
    <div>Initializing document store contract... You might need to run ganache with `npm run ganache`</div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
