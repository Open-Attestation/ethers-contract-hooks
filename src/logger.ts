import debug from "debug";

const logger = debug("ethers-contract-hook");

interface Logger {
  trace: debug.Debugger;
  info: debug.Debugger;
  error: debug.Debugger;
}

export const getLogger = (namespace: string): Logger => ({
  trace: logger.extend(`trace:${namespace}`),
  info: logger.extend(`info:${namespace}`),
  error: logger.extend(`error:${namespace}`),
});
