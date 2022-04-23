import ApiError from './api.error';
import constants from '../constants';

const {
  INTERNAL_SERVER_ERROR,
  NOT_FOUND_API,
  INVALID_CREDENTIAL,
  AUTH_REQUIRED,
} = constants;

export default {
  serverError: new ApiError({ message: INTERNAL_SERVER_ERROR, status: 500 }),
  notFoundApi: new ApiError({ message: NOT_FOUND_API, status: 404 }),
  invalidCredential: new ApiError({ message: INVALID_CREDENTIAL, status: 400 }),
  authRequired: new ApiError({ message: AUTH_REQUIRED, status: 401 }),
};
