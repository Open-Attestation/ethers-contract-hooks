import React, { useState } from "react";
import { render, fireEvent, act } from "@testing-library/react";
import { ContractTransaction, providers, Wallet, Contract, Signer, ContractFunction, Event } from "ethers";
import { useContractFunctionHook } from "./index";

const TestHook = ({ contract }: { contract: Contract }) => {
  const { state, send, events, receipt, transaction, transactionHash, errorMessage } = useContractFunctionHook(
    contract,
    "mockMethod"
  );
  const [hash, setHash] = useState("");
  const handleSend = () => {
    send(hash);
  };
  const { call, value } = useContractFunctionHook(contract, "mockMethod");
  const handleCheck = () => {
    call(hash);
  };

  return (
    <div data-testid="hello-world">
      <h2>State</h2>
      <div data-testid="state">{state}</div>
      <h2>Events</h2>
      <div data-testid="events">{JSON.stringify(events)}</div>
      <h2>Receipt</h2>
      <div data-testid="receipt">{JSON.stringify(receipt)}</div>
      <h2>Transaction</h2>
      <div data-testid="transaction">{JSON.stringify(transaction)}</div>
      <h2>Error</h2>
      <div data-testid="error">{errorMessage}</div>

      <input
        data-testid="data-input"
        value={hash}
        onChange={e => setHash(e.target.value)}
        style={{ width: "100%" }}
      ></input>
      <button data-testid="button-send" onClick={handleSend}>
        Send Transaction
      </button>
      <button onClick={handleCheck}>Is Issued? {JSON.stringify(value, null, 2)} </button>
    </div>
  );
};

const mockMethod = jest.fn();
const mockContractImpl = { functions: { mockMethod } } as any;
const mockContract = mockContractImpl as Contract;

describe("useContractFunctionHook", () => {
  xit("should initialize to default state", () => {
    const { getByTestId } = render(<TestHook contract={mockContract} />);
    expect(getByTestId("state").textContent).toBe("UNINITIALIZED");
    expect(getByTestId("events").textContent).toBe("");
    expect(getByTestId("receipt").textContent).toBe("");
    expect(getByTestId("transaction").textContent).toBe("");
    expect(getByTestId("error").textContent).toBe("");
  });

  it("should initialize to default state", () => {
    mockMethod.mockResolvedValueOnce({ wait: jest.fn() });
    const { getByTestId } = render(<TestHook contract={mockContract} />);
    act(() => {
      fireEvent.change(getByTestId("data-input"), {
        target: { value: "0xd6df43b7372d4c696612f5ca454489f40e76ab6b0575110a9965f083fafd2d40" }
      });
    });
    act(() => {
      fireEvent.click(getByTestId("button-send"));
    });
    expect(getByTestId("state").textContent).toBe("INITIALIZED");
  });
});
