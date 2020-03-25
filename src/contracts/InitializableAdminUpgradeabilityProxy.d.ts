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

interface InitializableAdminUpgradeabilityProxyInterface extends Interface {
  functions: {
    admin: TypedFunctionDescription<{encode([]: []): string}>;

    changeAdmin: TypedFunctionDescription<{
      encode([newAdmin]: [string]): string;
    }>;

    implementation: TypedFunctionDescription<{encode([]: []): string}>;

    upgradeTo: TypedFunctionDescription<{
      encode([newImplementation]: [string]): string;
    }>;

    upgradeToAndCall: TypedFunctionDescription<{
      encode([newImplementation, data]: [string, Arrayish]): string;
    }>;

    initialize: TypedFunctionDescription<{
      encode([_logic, _admin, _data]: [string, string, Arrayish]): string;
    }>;
  };

  events: {
    AdminChanged: TypedEventDescription<{
      encodeTopics([previousAdmin, newAdmin]: [null, null]): string[];
    }>;

    Upgraded: TypedEventDescription<{
      encodeTopics([implementation]: [string | null]): string[];
    }>;
  };
}

export class InitializableAdminUpgradeabilityProxy extends Contract {
  connect(
    signerOrProvider: Signer | Provider | string
  ): InitializableAdminUpgradeabilityProxy;
  attach(addressOrName: string): InitializableAdminUpgradeabilityProxy;
  deployed(): Promise<InitializableAdminUpgradeabilityProxy>;

  on(
    event: EventFilter | string,
    listener: Listener
  ): InitializableAdminUpgradeabilityProxy;
  once(
    event: EventFilter | string,
    listener: Listener
  ): InitializableAdminUpgradeabilityProxy;
  addListener(
    eventName: EventFilter | string,
    listener: Listener
  ): InitializableAdminUpgradeabilityProxy;
  removeAllListeners(
    eventName: EventFilter | string
  ): InitializableAdminUpgradeabilityProxy;
  removeListener(
    eventName: any,
    listener: Listener
  ): InitializableAdminUpgradeabilityProxy;

  interface: InitializableAdminUpgradeabilityProxyInterface;

  functions: {
    admin(overrides?: TransactionOverrides): Promise<ContractTransaction>;

    changeAdmin(
      newAdmin: string,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    implementation(
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    upgradeTo(
      newImplementation: string,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    upgradeToAndCall(
      newImplementation: string,
      data: Arrayish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    initialize(
      _logic: string,
      _admin: string,
      _data: Arrayish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;
  };

  admin(overrides?: TransactionOverrides): Promise<ContractTransaction>;

  changeAdmin(
    newAdmin: string,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  implementation(
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  upgradeTo(
    newImplementation: string,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  upgradeToAndCall(
    newImplementation: string,
    data: Arrayish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  initialize(
    _logic: string,
    _admin: string,
    _data: Arrayish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  filters: {
    AdminChanged(previousAdmin: null, newAdmin: null): EventFilter;

    Upgraded(implementation: string | null): EventFilter;
  };

  estimate: {
    admin(): Promise<BigNumber>;

    changeAdmin(newAdmin: string): Promise<BigNumber>;

    implementation(): Promise<BigNumber>;

    upgradeTo(newImplementation: string): Promise<BigNumber>;

    upgradeToAndCall(
      newImplementation: string,
      data: Arrayish
    ): Promise<BigNumber>;

    initialize(
      _logic: string,
      _admin: string,
      _data: Arrayish
    ): Promise<BigNumber>;
  };
}
