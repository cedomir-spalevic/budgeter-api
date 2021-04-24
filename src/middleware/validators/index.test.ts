import { GeneralError } from "models/errors";
import { test, expect } from "@jest/globals";
import { Form } from "models/requests";
import {
   isBool,
   isDate,
   isId,
   isNumber,
   isOneOfStr,
   isStr,
   isValidEmail,
   isValidPhoneNumber
} from ".";
import { ObjectId } from "mongodb";

test("Invalid number", () => {
   expect(() => {
      const form: Form = {
         age: "11"
      };
      isNumber(form, "age");
   }).toThrowError(new GeneralError("age must be a number"));
});

test("Required number", () => {
   expect(() => {
      const form: Form = {};
      isNumber(form, "age", true);
   }).toThrowError(new GeneralError("age is required"));
});

test("Valid number", () => {
   const form: Form = {
      age: 11
   };
   const age = isNumber(form, "age");
   expect(age).toBe(11);
});

test("Invalid string", () => {
   expect(() => {
      const form: Form = {
         name: 10
      };
      isStr(form, "name");
   }).toThrowError(new GeneralError("name must be a string"));
});

test("Required string", () => {
   expect(() => {
      const form: Form = {};
      isStr(form, "name", true);
   }).toThrowError(new GeneralError("name is required"));
});

test("Valid string", () => {
   const form: Form = {
      name: "Charlie"
   };
   const name = isStr(form, "name");
   expect(name).toBe("Charlie");
});

test("Invalid specific values of strings", () => {
   expect(() => {
      const form: Form = {
         type: "wrong"
      };
      isOneOfStr(form, "type", ["valid", "invalid"]);
   }).toThrowError(
      new GeneralError("type must have a value of 'valid' or 'invalid'")
   );
});

test("Valid specific values of strings", () => {
   const form: Form = {
      type: "valid"
   };
   const type = isOneOfStr(form, "type", ["valid", "invalid"]);
   expect(type).toBe("valid");
});

test("Valid specific values of strings", () => {
   const form: Form = {
      type: "invalid"
   };
   const type = isOneOfStr(form, "type", ["valid", "invalid"]);
   expect(type).toBe("invalid");
});

test("Required specific values of strings", () => {
   expect(() => {
      const form: Form = {};
      isOneOfStr(form, "type", ["valid", "invalid"], true);
   }).toThrowError(new GeneralError("type is required"));
});

test("Invalid Id", () => {
   expect(() => {
      const form: Form = {
         id: "123"
      };
      isId(form, "id");
   }).toThrowError(new GeneralError("id is not valid"));
});

test("Required Id", () => {
   expect(() => {
      const form: Form = {};
      isId(form, "id", true);
   }).toThrowError(new GeneralError("id is required"));
});

test("Valid Id", () => {
   const form: Form = {
      id: "607b9ee8b9aaa54d221579fa"
   };
   const id = isId(form, "id");
   expect(id).toStrictEqual(new ObjectId("607b9ee8b9aaa54d221579fa"));
});

test("Invalid date", () => {
   expect(() => {
      const form: Form = {
         date: "123"
      };
      isDate(form, "date");
   }).toThrowError(new GeneralError("date must be in ISO format"));
});

test("Invalid date", () => {
   expect(() => {
      const form: Form = {
         date: "2021-04-18T024.896+00:00"
      };
      isDate(form, "date");
   }).toThrowError(new GeneralError("date must be in ISO format"));
});

test("Required date", () => {
   expect(() => {
      const form: Form = {};
      isDate(form, "date", true);
   }).toThrowError(new GeneralError("date is required"));
});

test("Valid date", () => {
   const form: Form = {
      date: "2021-04-18T02:52:24.896"
   };
   const d = isDate(form, "date", true);
   expect(d).toStrictEqual(new Date("2021-04-18T02:52:24.896"));
});

test("Invalid bool", () => {
   expect(() => {
      const form: Form = {
         valid: "false"
      };
      isBool(form, "valid");
   }).toThrowError(new GeneralError("valid must be a boolean"));
});

test("Valid bool", () => {
   const form: Form = {
      valid: true
   };
   const valid = isBool(form, "valid", true);
   expect(valid).toBe(true);
});

test("Invalid email", () => {
   expect(isValidEmail("123")).toBeFalsy();
});

test("Invalid email", () => {
   expect(isValidEmail("charlie.spalevic.com")).toBeFalsy();
});

test("Invalid email", () => {
   expect(isValidEmail("@gmail.com")).toBeFalsy();
});

test("Valid email", () => {
   expect(isValidEmail("cedomir.spalevic@gmail.com")).toBeTruthy();
});

test("Valid email", () => {
   expect(isValidEmail("cedomir.spalevic@gmail.net")).toBeTruthy();
});

test("Valid email", () => {
   expect(isValidEmail("cedomir@gmail.com")).toBeTruthy();
});

test("Invalid phone number", () => {
   expect(isValidPhoneNumber("123")).toBeFalsy();
});

test("Invalid phone number", () => {
   expect(isValidPhoneNumber("asdbasdf")).toBeFalsy();
});

test("Invalid phone number", () => {
   expect(isValidPhoneNumber("1111111111111111111111")).toBeFalsy();
});

test("Invalid phone number", () => {
   expect(isValidPhoneNumber("0909090909090909090")).toBeFalsy();
});

test("Invalid phone number", () => {
   expect(isValidPhoneNumber("---------")).toBeFalsy();
});

test("Valid phone number", () => {
   expect(isValidPhoneNumber("6309152350")).toBeTruthy();
});

test("Valid phone number", () => {
   expect(isValidPhoneNumber("(630)915-2350")).toBeTruthy();
});

test("Valid phone number", () => {
   expect(isValidPhoneNumber("630-915-2350")).toBeTruthy();
});
