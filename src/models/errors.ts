export class BudgeterError extends Error {
   public statusCode;

   constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
      this.stack = undefined;
   }
}

export class GeneralError extends BudgeterError {
   constructor(message: string) {
      super(message, 400);
   }
}

export class InvalidJSONBodyError extends GeneralError {
   constructor() {
      super("JSON body is not valid");
   }
}

export class UnauthorizedError extends BudgeterError {
   constructor() {
      super("Unauthorized", 401);
   }
}

export class ExpiredTokenError extends UnauthorizedError { }

export class InvalidTokenError extends UnauthorizedError { }

export class NotFoundError extends BudgeterError {
   constructor(message: string) {
      super(message, 404);
   }
}

export class UserEmailNotVerifiedError extends BudgeterError {
   constructor() {
      super("User has not verified their email", 406);
   }
}

export class NoBudgetFoundError extends NotFoundError {
   constructor() {
      super("No Budget found with the given Id");
   }
}

export class NoPaymentFoundError extends NotFoundError {
   constructor() {
      super("No Payment found with the given Id");
   }
}

export class NoUserFoundError extends NotFoundError {
   constructor() {
      super("No User found with the given Id");
   }
}

export class NoUserEmailFoundError extends NotFoundError {
   constructor() {
      super("No user found with the given email address");
   }
}

export class AlreadyExistsError extends BudgeterError {
   constructor() {
      super("A user already exists with this email", 409);
   }
}