import { expect, test } from "@jest/globals";
import { BudgeterRequest } from "middleware/handler";
import { GeneralError } from "models/errors";
import { ObjectId } from "mongodb";
import { validate } from "./validator";

const getByIdRequest: BudgeterRequest = {
   auth: {
      isAuthenticated: false
   },
   pathParameters: {},
   queryStrings: null,
   body: {}
};
const nullRequest: BudgeterRequest = {
   auth: {
      isAuthenticated: true
   },
   pathParameters: null,
   queryStrings: null,
   body: {}
};
const getManyRequest: BudgeterRequest = {
   auth: {
      isAuthenticated: false
   },
   pathParameters: null,
   queryStrings: {},
   body: {}
};

test("Empty userId", () => {
   expect(() => {
      getByIdRequest.pathParameters = {
         userId: ""
      };
      validate(getByIdRequest);
   }).toThrowError(new GeneralError("Invalid Id"));
});

test("Invalid userId", () => {
   expect(() => {
      getByIdRequest.pathParameters = {
         userId: "!!!"
      };
      validate(getByIdRequest);
   }).toThrowError(new GeneralError("Invalid Id"));
});

test("Valid", () => {
   const objectId = new ObjectId().toHexString();
   getByIdRequest.pathParameters = {
      userId: objectId
   };
   expect(validate(getByIdRequest).userId.toHexString()).toBe(objectId);
});

test("Null query strings", () => {
   const result = validate(nullRequest);
   expect(result.queryStrings.limit).toBe(5);
   expect(result.queryStrings.skip).toBe(0);
});

test("Invalid limit", () => {
   expect(() => {
      getManyRequest.queryStrings = {
         limit: "-1"
      };
      validate(getManyRequest);
   }).toThrowError();
});

test("Invalid limit", () => {
   expect(() => {
      getManyRequest.queryStrings = {
         limit: "a"
      };
      validate(getManyRequest);
   }).toThrowError();
});

test("Invalid limit", () => {
   expect(() => {
      getManyRequest.queryStrings = {
         limit: "null"
      };
      validate(getManyRequest);
   }).toThrowError();
});

test("Valid limit", () => {
   getManyRequest.queryStrings = {
      limit: "7"
   };
   const result = validate(getManyRequest);
   expect(result.queryStrings.limit).toBe(7);
   expect(result.queryStrings.skip).toBe(0);
});

test("Invalid skip", () => {
   expect(() => {
      getManyRequest.queryStrings = {
         skip: "-1"
      };
      validate(getManyRequest);
   }).toThrowError();
});

test("Invalid skip", () => {
   expect(() => {
      getManyRequest.queryStrings = {
         skip: "a"
      };
      validate(getManyRequest);
   }).toThrowError();
});

test("Invalid skip", () => {
   expect(() => {
      getManyRequest.queryStrings = {
         skip: "null"
      };
      validate(getManyRequest);
   }).toThrowError();
});

test("Valid skip", () => {
   getManyRequest.queryStrings = {
      skip: "7"
   };
   const result = validate(getManyRequest);
   expect(result.queryStrings.limit).toBe(5);
   expect(result.queryStrings.skip).toBe(7);
});

test("Valid query strings", () => {
   getManyRequest.queryStrings = {
      limit: "10",
      skip: "5"
   };
   const result = validate(getManyRequest);
   expect(result.queryStrings.limit).toBe(10);
   expect(result.queryStrings.skip).toBe(5);
});

test("Valid query strings with", () => {
   getManyRequest.queryStrings = {
      limit: "10",
      skip: "5",
      search: "Test"
   };
   const result = validate(getManyRequest);
   expect(result.queryStrings.limit).toBe(10);
   expect(result.queryStrings.skip).toBe(5);
   expect(result.queryStrings.search).toBe("Test");
});
