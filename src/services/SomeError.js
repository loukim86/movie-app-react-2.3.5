export default class SomeError extends Error {
  constructor(message) {
    super();
    this.name = 'SomeError';
    this.message = message;
  }
}
