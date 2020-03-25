import React, { FunctionComponent, useState, useEffect } from "react";
import { ContractTransaction, providers, Wallet, Contract, Signer, ContractFunction } from "ethers";
import { connect } from "./oa";
import { DocumentStore } from "./contracts/DocumentStore";

interface HelloWorld {
  name: string;
}

export const HelloWorld: FunctionComponent<HelloWorld> = ({ name }) => {
  return <div data-testid="hello-world">Hello {name}</div>;
};

type ContractFunctionState = "uninitialized" | "pending" | "received" | "error" | "completed";

function useContractFunctionHook<T extends Contract>(contract: Promise<T>, method: string) {
  const [state, setState] = useState<ContractFunctionState>("uninitialized");
  const transact = async (...params: any[]) => {
    const contractMethod = (await contract).functions[method];
    const deferredTx = contractMethod(...params);
    setState("pending");
    try {
      const receipt = await deferredTx;
      console.log("receipt", receipt);
      setState("received");
      const results = await receipt.wait();
      console.log("results", results);
      setState("completed");
    } catch (e) {
      setState("error");
    }
  } as (await contract).functions[method];
  return { state, transact };
}

const provider = new providers.JsonRpcProvider();
const signer = new Wallet("cd1452521e0bdbe560466fcc9e43fbebc9667d5fa7f5112cad7754553c6f7567", provider);

export const TestHook: FunctionComponent = () => {
  const contract = connect(
    "0xD3C951dBE13CF63E112c42dF8a92d0faB7eC219c",
    signer
  );
  const { state, transact } = useContractFunctionHook(contract, "issue");
  const handleTransaction = () => {
    transact("0xd6df43b7372d4c696612f5ca454489f40e76ab6b0575110a9965f083fafd2dd9");
  };

  return (
    <div data-testid="hello-world">
      <button onClick={handleTransaction}>Issue Transaction</button>
      {state}
    </div>
  );
};
