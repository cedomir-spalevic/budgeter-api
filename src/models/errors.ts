export class AlreadyExistsError extends Error {
   constructor() {
      super("A user already exists with this email");
      this.stack = undefined;
   }
}

export class GeneralError extends Error {
   constructor(message: string) {
      super(message);
      this.stack = undefined;
   }
}

export class NoBudgetFoundError extends Error {
   constructor() {
      super("No Budget found with the given Id");
      this.stack = undefined;
   }
}

export class NoUserFoundError extends Error {
   constructor() {
      super("No user found with the given email address");
      this.stack = undefined;
   }
}

export class UnauthorizedError extends Error {
   constructor() {
      super("Unauthorized");
      this.stack = undefined;
   }
}

export class ExpiredTokenError extends UnauthorizedError { }

export class InvalidTokenError extends UnauthorizedError { }

export class InvalidJSONBodyError extends GeneralError {
   constructor() {
      super("JSON body is not valid");
      this.stack = undefined;
   }
}