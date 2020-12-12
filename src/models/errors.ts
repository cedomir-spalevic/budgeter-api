export class AlreadyExistsError extends Error {
   constructor() {
      super("A user already exists with this email");
   }
}

export class GeneralError extends Error {
   constructor(message: string) {
      super(message);
   }
}

export class NoUserFoundError extends Error {
   constructor() {
      super("No user found with the given email address");
   }
}

export class UnauthorizedError extends Error {
   constructor() {
      super("Unauthorized");
   }
}

export const transformErrorToResponse = (error: Error) => JSON.stringify({ message: error.message, stack: error.stack })