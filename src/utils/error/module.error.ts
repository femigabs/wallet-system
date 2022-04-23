import constants from '../constants';

const { MODULE_ERROR } = constants;

/**
 * A custom error class for handling module related errors.
 *
 * @class ModuleError
 */
export default class ModuleError extends Error {
  status: string | number;
  errors?: Array<any[]>;
  /**
  * The ModuleError Constructor.
  * @param {Object} options - A configuration object for errors.
  * @param {String} options.message - The error message if any.
  * @param {Array} options.errors - Additional error details if any.
  * @constructor ModuleError
  */
  constructor(options: Record<string, any> = {}) {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = options.message || MODULE_ERROR;
    this.status = options.status;
    if (options.errors) this.errors = options.errors;
  }
}
