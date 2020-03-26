import { Contract } from "ethers";
import { useContractFunctionHook } from "./index";
import { renderHook, act } from "@testing-library/react-hooks";

const mockMethod = jest.fn();
const mockContractImpl = { functions: { mockMethod } } as any;
const mockContract = mockContractImpl as Contract;

const transactionExample = {
  nonce: 12,
  gasPrice: {
    _hex: "0x04a817c800"
  },
  gasLimit: {
    _hex: "0xafbf"
  },
  to: "0xbC860c24583e4771b37DE92BCa37e74b442f0855",
  value: {
    _hex: "0x00"
  },
  data: "0x0f75e81fd6df43b7372d4c696612f5ca454489f40e76ab6b0575110a9965f083fafd2d40",
  chainId: 1585192385120,
  v: 3170384770276,
  r: "0xef1e7cf0bc01b33024aeef5c00bcb40da9aafca7f077fa91e381ceffab14c10a",
  s: "0x2031ba77a56533ca3831b14b61bbac9b4bc12eef26623544f3cc7aed056c3239",
  from: "0xFe3fEd8bcA1938efF9aef436aF13b31a84D2C237",
  hash: "0x8418e15d561f95a1d8cc78e96e751b6368302180b7f33a881132484d238d76af"
};

const receiptExample = {
  to: "0xbC860c24583e4771b37DE92BCa37e74b442f0855",
  from: "0xFe3fEd8bcA1938efF9aef436aF13b31a84D2C237",
  contractAddress: null,
  transactionIndex: 0,
  gasUsed: {
    _hex: "0xafbf"
  },
  logsBloom:
    "0x00000000000000000000004000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000100000000000000000000000000000000000400000000000000000010000000000000000000000000000004000000000000000000000000000000000000000000000000000000010000000000000000",
  blockHash: "0x1d8ace9ea00e948ae062b3fec7062736f632305b71ef3a6397730c8f2107a42e",
  transactionHash: "0x8418e15d561f95a1d8cc78e96e751b6368302180b7f33a881132484d238d76af",
  logs: [
    {
      transactionIndex: 0,
      blockNumber: 13,
      transactionHash: "0x8418e15d561f95a1d8cc78e96e751b6368302180b7f33a881132484d238d76af",
      address: "0xbC860c24583e4771b37DE92BCa37e74b442f0855",
      topics: [
        "0x01a1249f2caa0445b8391e02413d26f0d409dabe5330cd1d04d3d0801fc42db3",
        "0xd6df43b7372d4c696612f5ca454489f40e76ab6b0575110a9965f083fafd2d40"
      ],
      data: "0x",
      logIndex: 0,
      blockHash: "0x1d8ace9ea00e948ae062b3fec7062736f632305b71ef3a6397730c8f2107a42e",
      transactionLogIndex: 0
    }
  ],
  blockNumber: 13,
  confirmations: 1,
  cumulativeGasUsed: {
    _hex: "0xafbf"
  },
  status: 1,
  byzantium: true,
  events: [
    {
      transactionIndex: 0,
      blockNumber: 13,
      transactionHash: "0x8418e15d561f95a1d8cc78e96e751b6368302180b7f33a881132484d238d76af",
      address: "0xbC860c24583e4771b37DE92BCa37e74b442f0855",
      topics: [
        "0x01a1249f2caa0445b8391e02413d26f0d409dabe5330cd1d04d3d0801fc42db3",
        "0xd6df43b7372d4c696612f5ca454489f40e76ab6b0575110a9965f083fafd2d40"
      ],
      data: "0x",
      logIndex: 0,
      blockHash: "0x1d8ace9ea00e948ae062b3fec7062736f632305b71ef3a6397730c8f2107a42e",
      transactionLogIndex: 0,
      args: {
        "0": "0xd6df43b7372d4c696612f5ca454489f40e76ab6b0575110a9965f083fafd2d40",
        document: "0xd6df43b7372d4c696612f5ca454489f40e76ab6b0575110a9965f083fafd2d40",
        length: 1
      },
      event: "DocumentIssued",
      eventSignature: "DocumentIssued(bytes32)"
    }
  ]
};

const onSuccessResponse = () => {
  const mockTransaction = jest.fn();
  mockMethod.mockResolvedValueOnce({ ...transactionExample, wait: mockTransaction });
  mockTransaction.mockResolvedValueOnce(receiptExample);
};

const onErrorResponse = () => {
  const mockTransaction = jest.fn();
  mockMethod.mockRejectedValueOnce(new Error("Error: VM Exception while processing transaction: revert Error: Something cryptic, because blockchain?"));
};

describe("useContractFunctionHook", () => {
  beforeEach(() => {
    mockMethod.mockReset();
  });

  describe("send", () => {
    it("should initialize to default state", () => {
      const { result } = renderHook(() => useContractFunctionHook(mockContract, "mockMethod"));
      const { state, events, receipt, transaction, error, value } = result.current;
      expect(state).toBe("UNINITIALIZED");
      expect(events).toBe(undefined);
      expect(receipt).toBe(undefined);
      expect(transaction).toBe(undefined);
      expect(error).toBe(undefined);
      expect(value).toBe(undefined);
    });
  
    it("should initialize state on send", async () => {
      onSuccessResponse();
      const { result } = renderHook(() => useContractFunctionHook(mockContract, "mockMethod"));
  
      // Deferring state updates to end to allow state updates to happen only in `act`
      let deferredTx: Promise<any>;
  
      act(() => {
        deferredTx = result.current.send("SOME_VALUE");
      });
  
      expect(result.current.state).toBe("INITIALIZED");
      expect(result.current.events).toBe(undefined);
      expect(result.current.receipt).toBe(undefined);
      expect(result.current.transaction).toBe(undefined);
      expect(result.current.error).toBe(undefined);
      expect(result.current.value).toBe(undefined);
  
      await act(async () => {
        await deferredTx;
      });
    });
  
    it("should populate transaction when transaction is received & accepted by node", async () => {
      expect.assertions(2); // Ensures that the 2 intermediate state validation is ran
      onSuccessResponse();
      const { result, wait } = renderHook(() => useContractFunctionHook(mockContract, "mockMethod"));
      let deferredTx: Promise<any>;
  
      const intermediateStateValidation = () => {
        if (result.current.state !== "PENDING_CONFIRMATION") throw "SKIPPING";
        expect(result.current.state).toBe("PENDING_CONFIRMATION");
        expect(result.current.transaction?.hash).toBe("0x8418e15d561f95a1d8cc78e96e751b6368302180b7f33a881132484d238d76af");
      }
  
      await act(async () => {
        deferredTx = result.current.send("SOME_VALUE");
        await wait(intermediateStateValidation);
        await deferredTx;
      });
    });
  
    it("should update all states upon confirmation when transaction is mined", async () => {
      onSuccessResponse();
      const { result } = renderHook(() => useContractFunctionHook(mockContract, "mockMethod"));
      await act(async () => {
        await result.current.send("SOME_VALUE");
      });
      expect(result.current.state).toBe("CONFIRMED");
      expect(result.current.receipt).toEqual(receiptExample);
      expect(result.current.transaction?.data).toEqual(transactionExample.data);
      expect(result.current.events).toEqual(receiptExample.events);
      expect(result.current.transactionHash).toBe("0x8418e15d561f95a1d8cc78e96e751b6368302180b7f33a881132484d238d76af");
      expect(result.current.error).toBe(undefined);
      expect(result.current.value).toBe(undefined);
      expect(result.current.errorMessage).toBe(undefined);
    });

    it("should update error when transaction fails", async () => {
      onErrorResponse();
      const { result } = renderHook(() => useContractFunctionHook(mockContract, "mockMethod"));
      await act(async () => {
        await result.current.send("SOME_VALUE");
      });
      expect(result.current.state).toBe("ERROR");
      expect(result.current.errorMessage).toBe("Error: VM Exception while processing transaction: revert Error: Something cryptic, because blockchain?");
      expect(result.current.receipt).toBe(undefined);
      expect(result.current.transaction?.data).toBe(undefined);
      expect(result.current.events).toBe(undefined);
      expect(result.current.value).toBe(undefined);
      expect(result.current.error).toBeTruthy()
    });
  })
});
