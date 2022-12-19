import { ErrorParams, ErrorParamsValues } from '../types/errors/index.js';

export class BaseError extends Error {
  constructor(public message: string, public params: ErrorParams = {}) {
    super(message);
  }

  getParamsToPrint(): Record<string, ErrorParamsValues> {
    return {
      errorClass: this.constructor.name,
      ...this.params,
    };
  }
}
