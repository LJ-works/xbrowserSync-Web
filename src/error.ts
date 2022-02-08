export class BaseError extends Error {
  logged: boolean;

  constructor(message?: string, error?: Error) {
    let errMessage = message;
    if (error && !message) {
      errMessage = error.message;
    }

    super(errMessage);

    // Use error param stacktrace if provided and add error class name
    if (error && error.stack) {
      this.stack = error.stack;
    }
    this.stack = this.stack?.replace(/^(Error)/, `$1 (${this.constructor.name})`);

    // Set logged flag to default value
    this.logged = false;
  }
}
