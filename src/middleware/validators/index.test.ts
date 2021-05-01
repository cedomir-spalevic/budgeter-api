import { GeneralError } from "models/errors";
import { test, expect } from "@jest/globals";
import { Form } from "models/requests";
import {
   validateBool,
   validateDate,
   validateObjectId,
   validateNumber,
   validateIsOneOfStr,
   validateStr,
   validateDayOfMonth,
   validateDayOfWeek,
   isValidEmail,
   validateMonth,
   isValidPhoneNumber,
   validateYear
} from ".";
import { ObjectId } from "mongodb";

test("Invalid number", () => {
   expect(() => {
      const form: Form = {
         age: "11"
      };
      validateNumber(form, "age");
   }).toThrowError(new GeneralError("age must be a number"));
});

test("Required number", () => {
   expect(() => {
      const form: Form = {};
      validateNumber(form, "age", true);
   }).toThrowError(new GeneralError("age is required"));
});

test("Valid number", () => {
   const form: Form = {
      age: 11
   };
   const age = validateNumber(form, "age");
   expect(age).toBe(11);
});

test("Invalid string", () => {
   expect(() => {
      const form: Form = {
         name: 10
      };
      validateStr(form, "name");
   }).toThrowError(new GeneralError("name must be a string"));
});

test("Required string", () => {
   expect(() => {
      const form: Form = {};
      validateStr(form, "name", true);
   }).toThrowError(new GeneralError("name is required"));
});

test("Valid string", () => {
   const form: Form = {
      name: "Charlie"
   };
   const name = validateStr(form, "name");
   expect(name).toBe("Charlie");
});

test("Invalid specific values of strings", () => {
   expect(() => {
      const form: Form = {
         type: "wrong"
      };
      validateIsOneOfStr(form, "type", ["valid", "invalid"]);
   }).toThrowError(
      new GeneralError("type must have a value of 'valid' or 'invalid'")
   );
});

test("Valid specific values of strings", () => {
   const form: Form = {
      type: "valid"
   };
   const type = validateIsOneOfStr(form, "type", ["valid", "invalid"]);
   expect(type).toBe("valid");
});

test("Valid specific values of strings", () => {
   const form: Form = {
      type: "invalid"
   };
   const type = validateIsOneOfStr(form, "type", ["valid", "invalid"]);
   expect(type).toBe("invalid");
});

test("Required specific values of strings", () => {
   expect(() => {
      const form: Form = {};
      validateIsOneOfStr(form, "type", ["valid", "invalid"], true);
   }).toThrowError(new GeneralError("type is required"));
});

test("Invalid Id", () => {
   expect(() => {
      const form: Form = {
         id: "123"
      };
      validateObjectId(form, "id");
   }).toThrowError(new GeneralError("id is not valid"));
});

test("Required Id", () => {
   expect(() => {
      const form: Form = {};
      validateObjectId(form, "id", true);
   }).toThrowError(new GeneralError("id is required"));
});

test("Valid Id", () => {
   const form: Form = {
      id: "607b9ee8b9aaa54d221579fa"
   };
   const id = validateObjectId(form, "id");
   expect(id).toStrictEqual(new ObjectId("607b9ee8b9aaa54d221579fa"));
});

test("Invalid date", () => {
   expect(() => {
      const form: Form = {
         date: "123"
      };
      validateDate(form, "date");
   }).toThrowError(new GeneralError("date must be in ISO format"));
});

test("Invalid date", () => {
   expect(() => {
      const form: Form = {
         date: "2021-04-18T024.896+00:00"
      };
      validateDate(form, "date");
   }).toThrowError(new GeneralError("date must be in ISO format"));
});

test("Required date", () => {
   expect(() => {
      const form: Form = {};
      validateDate(form, "date", true);
   }).toThrowError(new GeneralError("date is required"));
});

test("Valid date", () => {
   const form: Form = {
      date: "2021-04-18T02:52:24.896"
   };
   const d = validateDate(form, "date", true);
   expect(d).toStrictEqual(new Date("2021-04-18T02:52:24.896"));
});

test("Invalid bool", () => {
   expect(() => {
      const form: Form = {
         valid: "false"
      };
      validateBool(form, "valid");
   }).toThrowError(new GeneralError("valid must be a boolean"));
});

test("Valid bool", () => {
   const form: Form = {
      valid: true
   };
   const valid = validateBool(form, "valid", true);
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

test("Valid day of week", () => {
   expect(validateDayOfWeek({ day: 4 }, "day")).toBeTruthy();
});

test("Valid day of week", () => {
   expect(validateDayOfWeek({ day: 0 }, "day")).toBe(0);
});

test("Valid day of week", () => {
   expect(validateDayOfWeek({ day: 6 }, "day")).toBe(6);
});

test("Invalid day of week", () => {
   expect(() => validateDayOfWeek({ day: -1 }, "day")).toThrowError(
      GeneralError
   );
});

test("Invalid day of week", () => {
   expect(() => validateDayOfWeek({ day: 7 }, "day")).toThrowError(
      GeneralError
   );
});

test("Valid day of month", () => {
   expect(validateDayOfMonth({ day: 27 }, "day")).toBeTruthy();
});

test("Valid day of month", () => {
   expect(validateDayOfMonth({ day: 1 }, "day")).toBeTruthy();
});

test("Valid day of month", () => {
   expect(validateDayOfMonth({ day: 31 }, "day")).toBeTruthy();
});

test("Invalid day of month", () => {
   expect(() => validateDayOfMonth({ day: 32 }, "day")).toThrowError(
      GeneralError
   );
});

test("Invalid day of month", () => {
   expect(() => validateDayOfMonth({ day: -1 }, "day")).toThrowError(
      GeneralError
   );
});

test("Valid month", () => {
   expect(validateMonth({ month: 0 }, "month")).toBe(0);
});

test("Valid month", () => {
   expect(validateMonth({ month: 11 }, "month")).toBe(11);
});

test("Valid month", () => {
   expect(validateMonth({ month: 6 }, "month")).toBe(6);
});

test("Invalid month", () => {
   expect(() => validateMonth({ month: 12 }, "month")).toThrowError(
      GeneralError
   );
});

test("Invalid month", () => {
   expect(() => validateMonth({ month: -1 }, "month")).toThrowError(
      GeneralError
   );
});

test("Valid year", () => {
   expect(validateYear({ year: 2021 }, "year")).toBe(2021);
});

test("Invalid year", () => {
   expect(() => validateYear({ year: 1 }, "year")).toThrowError(GeneralError);
});

test("Invalid year", () => {
   expect(() => validateYear({ year: 20211 }, "year")).toThrowError(
      GeneralError
   );
});
