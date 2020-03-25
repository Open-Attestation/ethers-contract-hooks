import React, { FunctionComponent, useState, useEffect } from "react";
import { ContractTransaction, providers, Wallet, Contract, Signer, ContractFunction, Event } from "ethers";
import { connect } from "./oa";
import { DocumentStore } from "./contracts/DocumentStore";
import { ContractReceipt } from "ethers/contract";

type ContractFunctionState = "UNINITIALIZED" | "INITIALIZED" | "PENDING_CONFIRMATION" | "CONFIRMED" | "ERROR";

export function useContractFunctionHook<T extends Contract, S extends keyof T["functions"]>(contract: T, method: S) {
  const [state, setState] = useState<ContractFunctionState>("UNINITIALIZED");
  const [receipt, setReceipt] = useState<ContractReceipt>();
  const [transaction, setTransaction] = useState<ContractTransaction>();
  const [error, setError] = useState<Error>();

  // Reset state is added to allow the same hook to be used for multiple transactions although
  // it is highly unrecommended.
  const resetState = () => {
    setState("UNINITIALIZED");
    setReceipt(undefined);
    setTransaction(undefined);
    setError(undefined);
  }

  const send = (async (...params: any[]) => {
    resetState();
    const contractMethod = contract.functions[method as string];
    const deferredTx = contractMethod(...params);
    setState("INITIALIZED");
    try {
      const transaction: ContractTransaction = await deferredTx;
      setState("PENDING_CONFIRMATION");
      setTransaction(transaction);
      const receipt = await transaction.wait();
      setState("CONFIRMED");
      setReceipt(receipt);
    } catch (e) {
      setError(e);
      setState("ERROR");
    }
  }) as T["functions"][S];

  const transactionHash = transaction?.hash;
  const events = receipt?.events;
  const errorMessage = error?.message;

  return { state, events, send, receipt, transaction, transactionHash, errorMessage };
}

const provider = new providers.JsonRpcProvider();
const signer = new Wallet("cd1452521e0bdbe560466fcc9e43fbebc9667d5fa7f5112cad7754553c6f7567", provider);

export const TestHook = ({ contract }: { contract: DocumentStore }) => {
  const { state, send, events, receipt, transaction, transactionHash, errorMessage } = useContractFunctionHook(contract, "issue");
  const [hash, setHash] = useState("0xd6df43b7372d4c696612f5ca454489f40e76ab6b0575110a9965f083fafd2d40")
  const handleTransaction = () => {
    send(hash);
  };

  return (
    <div data-testid="hello-world">
      <input value={hash} onChange={(e) => setHash(e.target.value)} style={{width: "100%"}}></input>
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

export const TestHookContainer: FunctionComponent = () => {
  const [contract, setContract] = useState<DocumentStore>();
  useEffect(() => {
    connect(
      "0xD3C951dBE13CF63E112c42dF8a92d0faB7eC219c",
      signer
    ).then(setContract);
  }, []);
  return contract ? <TestHook contract={contract} /> : null;
};
