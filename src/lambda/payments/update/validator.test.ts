import { GeneralError } from "models/errors";
import { validateForm, validatePathParameter } from "./validator";
import { test, expect } from "@jest/globals";
import { Form } from "models/requests";
import { ObjectId } from "mongodb";
import { APIGatewayProxyEventPathParameters } from "aws-lambda";

test("Empty paymentId", () => {
   expect(() => {
      const pathParameters: APIGatewayProxyEventPathParameters = {
         paymentId: ""
      };
      validatePathParameter(pathParameters);
   }).toThrowError(new GeneralError("Invalid Id"));
});

test("Invalid paymentId", () => {
   expect(() => {
      const pathParameters: APIGatewayProxyEventPathParameters = {
         paymentId: "!!!"
      };
      validatePathParameter(pathParameters);
   }).toThrowError(new GeneralError("Invalid Id"));
});

test("Valid", () => {
   const objectId = new ObjectId().toHexString();
   const pathParameters: APIGatewayProxyEventPathParameters = {
      paymentId: objectId
   };
   expect(validatePathParameter(pathParameters).toHexString()).toBe(objectId);
});

test("Invalid title", () => {
   expect(() => {
      const form: Form = {
         title: 123,
         amount: 10,
         initialDay: 10,
         initialDate: 27,
         initialMonth: 3,
         initialYear: 2012,
         recurrence: "daily"
      };
      validateForm(form);
   }).toThrowError(new GeneralError("title must be a string"));
});

test("Empty title", () => {
   expect(() => {
      const form: Form = {
         title: "",
         amount: 10,
         initialDay: 10,
         initialDate: 27,
         initialMonth: 3,
         initialYear: 2012,
         recurrence: "daily"
      };
      validateForm(form);
   }).toThrowError();
});

test("Title too long", () => {
   expect(() => {
      const form: Form = {
         title: new Array(101).fill("a").join(""),
         amount: 10,
         initialDay: 10,
         initialDate: 27,
         initialMonth: 3,
         initialYear: 2012,
         recurrence: "daily"
      };
      validateForm(form);
   }).toThrowError();
});

test("Invalid initialDay", () => {
   expect(() => {
      const form: Form = {
         title: "123",
         amount: 10,
         initialDay: -1,
         initialDate: 27,
         initialMonth: 3,
         initialYear: 2012,
         recurrence: "daily"
      };
      validateForm(form);
   }).toThrowError(new GeneralError("initialDay must be between 0 and 6"));
});

test("Invalid initialDay", () => {
   expect(() => {
      const form: Form = {
         title: "123",
         amount: 10,
         initialDay: 7,
         initialDate: 27,
         initialMonth: 3,
         initialYear: 2012,
         recurrence: "daily"
      };
      validateForm(form);
   }).toThrowError(new GeneralError("initialDay must be between 0 and 6"));
});

test("initialDay is not a number", () => {
   expect(() => {
      const form: Form = {
         title: "123",
         amount: 10,
         initialDay: "a",
         initialDate: 27,
         initialMonth: 3,
         initialYear: 2012,
         recurrence: "daily"
      };
      validateForm(form);
   }).toThrowError(new GeneralError("initialDay must be a number"));
});

test("Invalid initialDate", () => {
   expect(() => {
      const form: Form = {
         title: "123",
         amount: 10,
         initialDay: 5,
         initialDate: 0,
         initialMonth: 3,
         initialYear: 2012,
         recurrence: "daily"
      };
      validateForm(form);
   }).toThrowError(new GeneralError("initialDate must be between 1 and 31"));
});

test("Invalid initialDate", () => {
   expect(() => {
      const form: Form = {
         title: "123",
         amount: 10,
         initialDay: 5,
         initialDate: 32,
         initialMonth: 3,
         initialYear: 2012,
         recurrence: "daily"
      };
      validateForm(form);
   }).toThrowError(new GeneralError("initialDate must be between 1 and 31"));
});

test("initialDate is not a number", () => {
   expect(() => {
      const form: Form = {
         title: "123",
         amount: 10,
         initialDay: 5,
         initialDate: "27",
         initialMonth: 3,
         initialYear: 2012,
         recurrence: "daily"
      };
      validateForm(form);
   }).toThrowError(new GeneralError("initialDate must be a number"));
});

test("Invalid initialMonth", () => {
   expect(() => {
      const form: Form = {
         title: "123",
         amount: 10,
         initialDay: 5,
         initialDate: 15,
         initialMonth: -1,
         initialYear: 2012,
         recurrence: "daily"
      };
      validateForm(form);
   }).toThrowError(new GeneralError("initialMonth must be between 0 and 11"));
});

test("Invalid initialMonth", () => {
   expect(() => {
      const form: Form = {
         title: "123",
         amount: 10,
         initialDay: 5,
         initialDate: 15,
         initialMonth: 12,
         initialYear: 2012,
         recurrence: "daily"
      };
      validateForm(form);
   }).toThrowError(new GeneralError("initialMonth must be between 0 and 11"));
});

test("initialMonth not a number", () => {
   expect(() => {
      const form: Form = {
         title: "123",
         amount: 10,
         initialDay: 5,
         initialDate: 15,
         initialMonth: "12",
         initialYear: 2012,
         recurrence: "daily"
      };
      validateForm(form);
   }).toThrowError(new GeneralError("initialMonth must be a number"));
});

test("invalid initialYear", () => {
   expect(() => {
      const form: Form = {
         title: "123",
         amount: 10,
         initialDay: 5,
         initialDate: 5,
         initialMonth: 10,
         initialYear: -1,
         recurrence: "daily"
      };
      validateForm(form);
   }).toThrowError(new GeneralError("initialYear is not valid"));
});

test("invalid initialYear", () => {
   expect(() => {
      const form: Form = {
         title: "123",
         amount: 10,
         initialDay: 5,
         initialDate: 5,
         initialMonth: 10,
         initialYear: 123,
         recurrence: "daily"
      };
      validateForm(form);
   }).toThrowError(new GeneralError("initialYear is not valid"));
});

test("invalid initialYear", () => {
   expect(() => {
      const form: Form = {
         title: "123",
         amount: 10,
         initialDay: 5,
         initialDate: 15,
         initialMonth: 10,
         initialYear: 12345,
         recurrence: "daily"
      };
      validateForm(form);
   }).toThrowError(new GeneralError("initialYear is not valid"));
});

test("invalid initialYear", () => {
   expect(() => {
      const form: Form = {
         title: "123",
         amount: 10,
         initialDay: 5,
         initialDate: 15,
         initialMonth: 10,
         initialYear: -123,
         recurrence: "daily"
      };
      validateForm(form);
   }).toThrowError(new GeneralError("initialYear is not valid"));
});

test("initialYear not a number", () => {
   expect(() => {
      const form: Form = {
         title: "123",
         amount: 10,
         initialDay: 5,
         initialDate: 15,
         initialMonth: 10,
         initialYear: "12345",
         recurrence: "daily"
      };
      validateForm(form);
   }).toThrowError(new GeneralError("initialYear must be a number"));
});

test("invalid recurrence", () => {
   expect(() => {
      const form: Form = {
         title: "123",
         amount: 10,
         initialDay: 5,
         initialDate: 15,
         initialMonth: 9,
         initialYear: 2021,
         recurrence: ""
      };
      validateForm(form);
   }).toThrowError(
      new GeneralError(
         "recurrence must have a value of 'oneTime' or 'daily' or 'weekly' or 'biweekly' or 'monthly' or 'yearly'"
      )
   );
});

test("invalid recurrence", () => {
   expect(() => {
      const form: Form = {
         title: "123",
         amount: 10,
         initialDay: 5,
         initialDate: 15,
         initialMonth: 9,
         initialYear: 2021,
         recurrence: "ONETIME"
      };
      validateForm(form);
   }).toThrowError(
      new GeneralError(
         "recurrence must have a value of 'oneTime' or 'daily' or 'weekly' or 'biweekly' or 'monthly' or 'yearly'"
      )
   );
});

test("invalid recurrence", () => {
   expect(() => {
      const form: Form = {
         title: "123",
         amount: 10,
         initialDay: 5,
         initialDate: 15,
         initialMonth: 9,
         initialYear: 2021,
         recurrence: "onetime"
      };
      validateForm(form);
   }).toThrowError(
      new GeneralError(
         "recurrence must have a value of 'oneTime' or 'daily' or 'weekly' or 'biweekly' or 'monthly' or 'yearly'"
      )
   );
});

test("valid form", () => {
   expect(() => {
      const form: Form = {
         title: "123",
         amount: 10,
         initialDay: 5,
         initialDate: 15,
         initialMonth: 9,
         initialYear: 2021,
         recurrence: "oneTime"
      };
      validateForm(form);
   }).not.toThrowError();
});

test("valid form", () => {
   expect(() => {
      const form: Form = {
         title: "123",
         amount: 10,
         initialDay: 5,
         initialDate: 15,
         initialMonth: 9,
         initialYear: 2021,
         recurrence: "daily"
      };
      validateForm(form);
   }).not.toThrowError();
});

test("valid form", () => {
   expect(() => {
      const form: Form = {
         title: "123",
         amount: 10,
         initialDay: 5,
         initialDate: 15,
         initialMonth: 9,
         initialYear: 2021,
         recurrence: "weekly"
      };
      validateForm(form);
   }).not.toThrowError();
});

test("valid form", () => {
   expect(() => {
      const form: Form = {
         title: "123",
         amount: 10,
         initialDay: 5,
         initialDate: 15,
         initialMonth: 9,
         initialYear: 2021,
         recurrence: "biweekly"
      };
      validateForm(form);
   }).not.toThrowError();
});

test("valid form", () => {
   expect(() => {
      const form: Form = {
         title: "123",
         amount: 10,
         initialDay: 5,
         initialDate: 15,
         initialMonth: 9,
         initialYear: 2021,
         recurrence: "monthly"
      };
      validateForm(form);
   }).not.toThrowError();
});

test("valid form", () => {
   expect(() => {
      const form: Form = {
         title: "123",
         amount: 10,
         initialDay: 5,
         initialDate: 15,
         initialMonth: 9,
         initialYear: 2021,
         recurrence: "yearly"
      };
      validateForm(form);
   }).not.toThrowError();
});
