export default {
  get: jest.fn(() => Promise.resolve({ data: 'data' })),
  post: jest.fn(() => Promise.resolve({ data: 'data' }))
};
