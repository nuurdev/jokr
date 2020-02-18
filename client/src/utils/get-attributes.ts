export const getDataTestId = (status: number) =>
  status === 200 ? 'success-notification' : 'error-notifiction';

export const getClassName = (status: number) =>
  status === 200
    ? 'is-success is-light is-small'
    : 'is-danger is-light is-small';
