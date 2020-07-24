import { Contract, ContractTransaction } from "ethers";
import { useCallback, useState } from "react";
import { ContractReceipt } from "ethers/contract";

export type ContractFunctionState = "UNINITIALIZED" | "INITIALIZED" | "PENDING_CONFIRMATION" | "CONFIRMED" | "ERROR";
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

// Todo
// Deploy
// Deploy & Initialize

// interface useContractFunctionHookReturn<T extends Contract, S extends keyof T["functions"]> {
//   state: ContractFunctionState;
//   receipt?: ContractReceipt;
//   transaction?: ContractTransaction;
//   error?: Error;
//   value:
// }

export function useContractFunctionHook<T extends Contract, S extends keyof T["functions"]>(
  contract?: T,
  method?: S
): {
  call: T["functions"][S];
  send: T["functions"][S];
  reset: () => void;
  state: ContractFunctionState;
  receipt?: ContractReceipt;
  transaction?: ContractTransaction;
  error?: Error;
  value?: UnwrapPromise<ReturnType<T["functions"][S]>>;
  events?: ContractReceipt["events"];
  transactionHash?: string;
  errorMessage?: string;
} {
  const [state, setState] = useState<ContractFunctionState>("UNINITIALIZED");
  const [receipt, setReceipt] = useState<ContractReceipt>();
  const [transaction, setTransaction] = useState<ContractTransaction>();
  const [error, setError] = useState<Error>();
  const [value, setValue] = useState<UnwrapPromise<ReturnType<T["functions"][S]>>>();

  // Reset state is added to allow the same hook to be used for multiple transactions although
  // it is highly unrecommended.
  const resetState = (): void => {
    setState("UNINITIALIZED");
    setReceipt(undefined);
    setTransaction(undefined);
    setError(undefined);
  };

  const sendFn = (async (...params: any[]) => {
    if (!contract || !method) {
      setState("ERROR");
      setError(new Error("Contract or method is not specified"));
      return;
    }
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

  const callFn = (async (...params: any[]) => {
    if (!contract || !method) {
      setState("ERROR");
      setError(new Error("Contract or method is not specified"));
      return;
    }
    resetState();
    const contractMethod = contract.functions[method as string];
    const deferredTx = contractMethod(...params);
    setState("INITIALIZED");
    try {
      const response = await deferredTx;
      setState("CONFIRMED");
      setValue(response);
    } catch (e) {
      setError(e);
      setState("ERROR");
    }
  }) as T["functions"][S];

  const transactionHash = transaction?.hash;
  const events = receipt?.events;
  const errorMessage = error?.message;

  const send = useCallback(sendFn, [contract, method]);
  const call = useCallback(callFn, [contract, method]);
  const reset = useCallback(resetState, [contract, method]);

  return { state, call, events, send, receipt, transaction, transactionHash, errorMessage, error, value, reset };
}
