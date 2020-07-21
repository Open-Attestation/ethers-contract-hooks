import { Contract } from "ethers";
import { useContractFunctionHook } from "./index";
import { renderHook, act } from "@testing-library/react-hooks";
import { transactionExample, receiptExample } from "./test/example";

const mockMethod = jest.fn();
const mockContractImpl = { functions: { mockMethod } } as any;
const mockContract = mockContractImpl as Contract;

const onSendSuccessResponse = (): void => {
  const mockTransaction = jest.fn();
  mockMethod.mockResolvedValueOnce({ ...transactionExample, wait: mockTransaction });
  mockTransaction.mockResolvedValueOnce(receiptExample);
};

const onCallSuccessResponse = (): void => {
  mockMethod.mockResolvedValueOnce("RETURNED_VALUE");
};

const onErrorResponse = (): void => {
  mockMethod.mockRejectedValueOnce(
    new Error("Error: VM Exception while processing transaction: revert Error: Something cryptic, because blockchain?")
  );
};

describe("useContractFunctionHook", () => {
  // eslint-disable-next-line jest/no-hooks
  beforeEach(() => {
    mockMethod.mockReset();
  });

  it("should initialize to default state", () => {
    const { result } = renderHook(() => useContractFunctionHook(mockContract, "mockMethod"));
    const { state, events, receipt, transaction, error, value } = result.current;
    expect(state).toBe("UNINITIALIZED");
    expect(events).toBeUndefined();
    expect(receipt).toBeUndefined();
    expect(transaction).toBeUndefined();
    expect(error).toBeUndefined();
    expect(value).toBeUndefined();
  });

  describe("send", () => {
    it("should initialize state on send", async () => {
      onSendSuccessResponse();
      const { result } = renderHook(() => useContractFunctionHook(mockContract, "mockMethod"));

      // Deferring state updates to end to allow state updates to happen only in `act`
      let deferredTx: Promise<any>;

      act(() => {
        deferredTx = result.current.send("SOME_VALUE");
      });

      expect(result.current.state).toBe("INITIALIZED");
      expect(result.current.events).toBeUndefined();
      expect(result.current.receipt).toBeUndefined();
      expect(result.current.transaction).toBeUndefined();
      expect(result.current.error).toBeUndefined();
      expect(result.current.value).toBeUndefined();

      await act(async () => {
        await deferredTx;
      });
    });

    it("should populate transaction when transaction is received & accepted by node", async () => {
      expect.assertions(2); // Ensures that the 2 intermediate state validation is ran
      onSendSuccessResponse();
      const { result, wait } = renderHook(() => useContractFunctionHook(mockContract, "mockMethod"));
      let deferredTx: Promise<any>;

      const intermediateStateValidation = (): void => {
        if (result.current.state !== "PENDING_CONFIRMATION") throw "SKIPPING";
        expect(result.current.state).toBe("PENDING_CONFIRMATION");
        expect(result.current.transaction?.hash).toBe(
          "0x8418e15d561f95a1d8cc78e96e751b6368302180b7f33a881132484d238d76af"
        );
      };

      await act(async () => {
        deferredTx = result.current.send("SOME_VALUE");
        await wait(intermediateStateValidation);
        await deferredTx;
      });
    });

    it("should update all states upon confirmation when transaction is mined", async () => {
      onSendSuccessResponse();
      const { result } = renderHook(() => useContractFunctionHook(mockContract, "mockMethod"));
      await act(async () => {
        await result.current.send("SOME_VALUE");
      });
      expect(result.current.state).toBe("CONFIRMED");
      expect(result.current.receipt).toStrictEqual(receiptExample);
      expect(result.current.transaction?.data).toStrictEqual(transactionExample.data);
      expect(result.current.events).toStrictEqual(receiptExample.events);
      expect(result.current.transactionHash).toBe("0x8418e15d561f95a1d8cc78e96e751b6368302180b7f33a881132484d238d76af");
      expect(result.current.error).toBeUndefined();
      expect(result.current.value).toBeUndefined();
      expect(result.current.errorMessage).toBeUndefined();
    });

    it("should update error when transaction fails", async () => {
      onErrorResponse();
      const { result } = renderHook(() => useContractFunctionHook(mockContract, "mockMethod"));
      await act(async () => {
        await result.current.send("SOME_VALUE");
      });
      expect(result.current.state).toBe("ERROR");
      expect(result.current.errorMessage).toBe(
        "Error: VM Exception while processing transaction: revert Error: Something cryptic, because blockchain?"
      );
      expect(result.current.receipt).toBeUndefined();
      expect(result.current.transaction?.data).toBeUndefined();
      expect(result.current.events).toBeUndefined();
      expect(result.current.value).toBeUndefined();
    });
  });

  describe("call", () => {
    it("should initialize state on call", async () => {
      onCallSuccessResponse();
      const { result } = renderHook(() => useContractFunctionHook(mockContract, "mockMethod"));

      // Deferring state updates to end to allow state updates to happen only in `act`
      let deferredTx: Promise<any>;

      act(() => {
        deferredTx = result.current.call("SOME_VALUE");
      });

      expect(result.current.state).toBe("INITIALIZED");
      expect(result.current.events).toBeUndefined();
      expect(result.current.receipt).toBeUndefined();
      expect(result.current.transaction).toBeUndefined();
      expect(result.current.error).toBeUndefined();
      expect(result.current.value).toBeUndefined();

      await act(async () => {
        await deferredTx;
      });
    });

    it("should update all states upon confirmation when transaction is mined", async () => {
      onCallSuccessResponse();
      const { result } = renderHook(() => useContractFunctionHook(mockContract, "mockMethod"));
      await act(async () => {
        await result.current.call("SOME_VALUE");
      });
      expect(result.current.state).toBe("CONFIRMED");
      expect(result.current.value).toBe("RETURNED_VALUE");
      expect(result.current.receipt).toBeUndefined();
      expect(result.current.transaction).toBeUndefined();
      expect(result.current.events).toBeUndefined();
      expect(result.current.transactionHash).toBeUndefined();
      expect(result.current.error).toBeUndefined();
      expect(result.current.errorMessage).toBeUndefined();
    });
  });

  describe("reset", () => {
    it("should reset all states", async () => {
      onCallSuccessResponse();
      const { result } = renderHook(() => useContractFunctionHook(mockContract, "mockMethod"));
      await act(async () => {
        await result.current.call("SOME_VALUE");
      });
      expect(result.current.state).toBe("CONFIRMED");
      expect(result.current.value).toBe("RETURNED_VALUE");
      expect(result.current.receipt).toBeUndefined();
      expect(result.current.transaction).toBeUndefined();
      expect(result.current.events).toBeUndefined();
      expect(result.current.transactionHash).toBeUndefined();
      expect(result.current.error).toBeUndefined();
      expect(result.current.errorMessage).toBeUndefined();
      await act(async () => {
        await result.current.reset();
      });
      expect(result.current.state).toBe("UNINITIALIZED");
    });
  });
});
