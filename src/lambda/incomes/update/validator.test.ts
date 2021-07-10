import { expect, test } from "@jest/globals";
import { BudgeterRequest } from "middleware/handler";
import { GeneralError } from "models/errors";
import { ObjectId } from "mongodb";
import { validate } from "./validator";

const request: BudgeterRequest = {
   auth: {
      isAuthenticated: false
   },
   pathParameters: {},
   queryStrings: null,
   body: {      
      title: "123",
      amount: 10,
      initialDay: 5,
      initialDate: 15,
      initialMonth: 9,
      initialYear: 2021,
      recurrence: "yearly"
   }
};

test("Empty incomeId", () => {
   expect(() => {
      request.pathParameters = {
         incomeId: ""
      };
      validate(request);
   }).toThrowError(new GeneralError("Invalid Id"));
});

test("Invalid incomeId", () => {
   expect(() => {
      request.pathParameters = {
         incomeId: "!!!"
      };
      validate(request);
   }).toThrowError(new GeneralError("Invalid Id"));
});

test("Valid", () => {
   const objectId = new ObjectId().toHexString();
   request.pathParameters = {
      incomeId: objectId
   };
   expect(validate(request)._id.toHexString()).toBe(objectId);
});

test("Invalid title", () => {
   expect(() => {
      request.body = {
         title: 123,
         amount: 10,
         initialDay: 10,
         initialDate: 27,
         initialMonth: 3,
         initialYear: 2012,
         recurrence: "daily"
      };
      validate(request);
   }).toThrowError(new GeneralError("title must be a string"));
});

test("Empty title", () => {
   expect(() => {
      request.body = {
         title: "",
         amount: 10,
         initialDay: 10,
         initialDate: 27,
         initialMonth: 3,
         initialYear: 2012,
         recurrence: "daily"
      };
      validate(request);
   }).toThrowError();
});

test("Title too long", () => {
   expect(() => {
      request.body = {
         title: new Array(101).fill("a").join(""),
         amount: 10,
         initialDay: 10,
         initialDate: 27,
         initialMonth: 3,
         initialYear: 2012,
         recurrence: "daily"
      };
      validate(request);
   }).toThrowError();
});

test("Invalid initialDay", () => {
   expect(() => {
      request.body = {
         title: "123",
         amount: 10,
         initialDay: -1,
         initialDate: 27,
         initialMonth: 3,
         initialYear: 2012,
         recurrence: "daily"
      };
      validate(request);
   }).toThrowError(new GeneralError("initialDay must be between 0 and 6"));
});

test("Invalid initialDay", () => {
   expect(() => {
      request.body = {
         title: "123",
         amount: 10,
         initialDay: 7,
         initialDate: 27,
         initialMonth: 3,
         initialYear: 2012,
         recurrence: "daily"
      };
      validate(request);
   }).toThrowError(new GeneralError("initialDay must be between 0 and 6"));
});

test("initialDay is not a number", () => {
   expect(() => {
      request.body = {
         title: "123",
         amount: 10,
         initialDay: "a",
         initialDate: 27,
         initialMonth: 3,
         initialYear: 2012,
         recurrence: "daily"
      };
      validate(request);
   }).toThrowError(new GeneralError("initialDay must be a number"));
});

test("Invalid initialDate", () => {
   expect(() => {
      request.body = {
         title: "123",
         amount: 10,
         initialDay: 5,
         initialDate: 0,
         initialMonth: 3,
         initialYear: 2012,
         recurrence: "daily"
      };
      validate(request);
   }).toThrowError(new GeneralError("initialDate must be between 1 and 31"));
});

test("Invalid initialDate", () => {
   expect(() => {
      request.body = {
         title: "123",
         amount: 10,
         initialDay: 5,
         initialDate: 32,
         initialMonth: 3,
         initialYear: 2012,
         recurrence: "daily"
      };
      validate(request);
   }).toThrowError(new GeneralError("initialDate must be between 1 and 31"));
});

test("initialDate is not a number", () => {
   expect(() => {
      request.body = {
         title: "123",
         amount: 10,
         initialDay: 5,
         initialDate: "27",
         initialMonth: 3,
         initialYear: 2012,
         recurrence: "daily"
      };
      validate(request);
   }).toThrowError(new GeneralError("initialDate must be a number"));
});

test("Invalid initialMonth", () => {
   expect(() => {
      request.body = {
         title: "123",
         amount: 10,
         initialDay: 5,
         initialDate: 15,
         initialMonth: -1,
         initialYear: 2012,
         recurrence: "daily"
      };
      validate(request);
   }).toThrowError(new GeneralError("initialMonth must be between 0 and 11"));
});

test("Invalid initialMonth", () => {
   expect(() => {
      request.body = {
         title: "123",
         amount: 10,
         initialDay: 5,
         initialDate: 15,
         initialMonth: 12,
         initialYear: 2012,
         recurrence: "daily"
      };
      validate(request);
   }).toThrowError(new GeneralError("initialMonth must be between 0 and 11"));
});

test("initialMonth not a number", () => {
   expect(() => {
      request.body = {
         title: "123",
         amount: 10,
         initialDay: 5,
         initialDate: 15,
         initialMonth: "12",
         initialYear: 2012,
         recurrence: "daily"
      };
      validate(request);
   }).toThrowError(new GeneralError("initialMonth must be a number"));
});

test("invalid initialYear", () => {
   expect(() => {
      request.body = {
         title: "123",
         amount: 10,
         initialDay: 5,
         initialDate: 5,
         initialMonth: 10,
         initialYear: -1,
         recurrence: "daily"
      };
      validate(request);
   }).toThrowError(new GeneralError("initialYear is not valid"));
});

test("invalid initialYear", () => {
   expect(() => {
      request.body = {
         title: "123",
         amount: 10,
         initialDay: 5,
         initialDate: 5,
         initialMonth: 10,
         initialYear: 123,
         recurrence: "daily"
      };
      validate(request);
   }).toThrowError(new GeneralError("initialYear is not valid"));
});

test("invalid initialYear", () => {
   expect(() => {
      request.body = {
         title: "123",
         amount: 10,
         initialDay: 5,
         initialDate: 15,
         initialMonth: 10,
         initialYear: 12345,
         recurrence: "daily"
      };
      validate(request);
   }).toThrowError(new GeneralError("initialYear is not valid"));
});

test("invalid initialYear", () => {
   expect(() => {
      request.body = {
         title: "123",
         amount: 10,
         initialDay: 5,
         initialDate: 15,
         initialMonth: 10,
         initialYear: -123,
         recurrence: "daily"
      };
      validate(request);
   }).toThrowError(new GeneralError("initialYear is not valid"));
});

test("initialYear not a number", () => {
   expect(() => {
      request.body = {
         title: "123",
         amount: 10,
         initialDay: 5,
         initialDate: 15,
         initialMonth: 10,
         initialYear: "12345",
         recurrence: "daily"
      };
      validate(request);
   }).toThrowError(new GeneralError("initialYear must be a number"));
});

test("invalid recurrence", () => {
   expect(() => {
      request.body = {
         title: "123",
         amount: 10,
         initialDay: 5,
         initialDate: 15,
         initialMonth: 9,
         initialYear: 2021,
         recurrence: ""
      };
      validate(request);
   }).toThrowError(
      new GeneralError(
         "recurrence must have a value of 'oneTime' or 'daily' or 'weekly' or 'biweekly' or 'monthly' or 'yearly'"
      )
   );
});

test("invalid recurrence", () => {
   expect(() => {
      request.body = {
         title: "123",
         amount: 10,
         initialDay: 5,
         initialDate: 15,
         initialMonth: 9,
         initialYear: 2021,
         recurrence: "ONETIME"
      };
      validate(request);
   }).toThrowError(
      new GeneralError(
         "recurrence must have a value of 'oneTime' or 'daily' or 'weekly' or 'biweekly' or 'monthly' or 'yearly'"
      )
   );
});

test("invalid recurrence", () => {
   expect(() => {
      request.body = {
         title: "123",
         amount: 10,
         initialDay: 5,
         initialDate: 15,
         initialMonth: 9,
         initialYear: 2021,
         recurrence: "onetime"
      };
      validate(request);
   }).toThrowError(
      new GeneralError(
         "recurrence must have a value of 'oneTime' or 'daily' or 'weekly' or 'biweekly' or 'monthly' or 'yearly'"
      )
   );
});

test("valid request", () => {
   expect(() => {
      request.body = {
         title: "123",
         amount: 10,
         initialDay: 5,
         initialDate: 15,
         initialMonth: 9,
         initialYear: 2021,
         recurrence: "oneTime"
      };
      validate(request);
   }).not.toThrowError();
});

test("valid request", () => {
   expect(() => {
      request.body = {
         title: "123",
         amount: 10,
         initialDay: 5,
         initialDate: 15,
         initialMonth: 9,
         initialYear: 2021,
         recurrence: "daily"
      };
      validate(request);
   }).not.toThrowError();
});

test("valid request", () => {
   expect(() => {
      request.body = {
         title: "123",
         amount: 10,
         initialDay: 5,
         initialDate: 15,
         initialMonth: 9,
         initialYear: 2021,
         recurrence: "weekly"
      };
      validate(request);
   }).not.toThrowError();
});

test("valid request", () => {
   expect(() => {
      request.body = {
         title: "123",
         amount: 10,
         initialDay: 5,
         initialDate: 15,
         initialMonth: 9,
         initialYear: 2021,
         recurrence: "biweekly"
      };
      validate(request);
   }).not.toThrowError();
});

test("valid request", () => {
   expect(() => {
      request.body = {
         title: "123",
         amount: 10,
         initialDay: 5,
         initialDate: 15,
         initialMonth: 9,
         initialYear: 2021,
         recurrence: "monthly"
      };
      validate(request);
   }).not.toThrowError();
});

test("valid request", () => {
   expect(() => {
      request.body = {
         title: "123",
         amount: 10,
         initialDay: 5,
         initialDate: 15,
         initialMonth: 9,
         initialYear: 2021,
         recurrence: "yearly"
      };
      validate(request);
   }).not.toThrowError();
});
