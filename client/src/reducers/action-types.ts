import { ActionType } from 'redux-promise-middleware';

export const PENDING = (actionType: string): string =>
  `${actionType}_${ActionType.Pending}`;
export const FULFILLED = (actionType: string): string =>
  `${actionType}_${ActionType.Fulfilled}`;
export const REJECTED = (actionType: string): string =>
  `${actionType}_${ActionType.Rejected}`;
