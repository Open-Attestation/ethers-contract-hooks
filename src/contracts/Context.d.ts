/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */

import {Contract, ContractTransaction, EventFilter, Signer} from "ethers";
import {Listener, Provider} from "ethers/providers";
import {Arrayish, BigNumber, BigNumberish, Interface} from "ethers/utils";
import {
  TransactionOverrides,
  TypedEventDescription,
  TypedFunctionDescription
} from ".";

interface ContextInterface extends Interface {
  functions: {};

  events: {};
}

export class Context extends Contract {
  connect(signerOrProvider: Signer | Provider | string): Context;
  attach(addressOrName: string): Context;
  deployed(): Promise<Context>;

  on(event: EventFilter | string, listener: Listener): Context;
  once(event: EventFilter | string, listener: Listener): Context;
  addListener(eventName: EventFilter | string, listener: Listener): Context;
  removeAllListeners(eventName: EventFilter | string): Context;
  removeListener(eventName: any, listener: Listener): Context;

  interface: ContextInterface;

  functions: {};

  filters: {};

  estimate: {};
}
