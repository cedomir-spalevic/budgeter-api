import confirm from "controllers/auth/confirmation/index.js";
import { generateGuid } from "../../../../lib/security/guid";
import { oneTimeCodesService } from "services/mongodb/index.js";
import { ObjectId } from "mongodb";
import { getExpirationLength } from "../../../../lib/security/oneTimeCode";
import { EMAIL_USER_IDENTIFIER_TYPE } from "../../../../utils/constants";

jest.mock("services/mongodb/index.js");

let req;
let res;
let error;

describe("Confirmation controller invalid inputs", () => {
   beforeEach(() => {
      req = {
         body: {
         },
         logger: {
            info: jest.fn(),
            error: jest.fn()
         }
      };
      res = {
         json: jest.fn(),
         send: jest.fn()
      };
      error = null;
   });

   test("Missing key and code", async () => {
      try {
         await confirm(req, res);
      }
      catch(e) {
         error = e;
      }
      finally {
         expect(error.message).toBe("key is required");
      }
   });

   test("Missing code", async () => {
      req.body = {
         key: generateGuid()
      };
      try {
         await confirm(req, res);
      }
      catch(e) {
         error = e;
      }
      finally {
         expect(error.message).toBe("code is required");
      }
   });

   test("Undefined key", async () => {
      req.body = {
         key: undefined
      };
      try {
         await confirm(req, res);
      }
      catch(e) {
         error = e;
      }
      finally {
         expect(error.message).toBe("key is required");
      }
   });

   test("'Undefined' key", async () => {
      req.body = {
         key: "undefined"
      };
      try {
         await confirm(req, res);
      }
      catch(e) {
         error = e;
      }
      finally {
         expect(error.message).toBe("code is required");
      }
   });

   test("Non guid key", async () => {
      req.body = {
         key: "123",
         code: ""
      };
      try {
         await confirm(req, res);
      }
      catch(e) {
         error = e;
      }
      finally {
         expect(error.message).toBe("key is not valid");
      }
   });

   test("Numeric key", async () => {
      req.body = {
         key: 123,
         code: "123456"
      };
      try {
         await confirm(req, res);
      }
      catch(e) {
         error = e;
      }
      finally {
         expect(error.message).toBe("key is not valid");
      }
   });

   test("Null key", async () => {
      req.body = {
         key: null,
         code: "123456"
      };
      try {
         await confirm(req, res);
      }
      catch(e) {
         error = e;
      }
      finally {
         expect(error.message).toBe("key is not valid");
      }
   });

   test("Missing code", async () => {
      req.body = {
         key: generateGuid()
      };
      try {
         await confirm(req, res);
      }
      catch(e) {
         error = e;
      }
      finally {
         expect(error.message).toBe("code is required");
      }
   });

   test("Null code", async () => {
      req.body = {
         key: generateGuid(),
         code: null
      };
      try {
         await confirm(req, res);
      }
      catch(e) {
         error = e;
      }
      finally {
         expect(error.message).toBe("code is not valid");
      }
   });

   test("Code with more than 6 digits", async () => {
      req.body = {
         key: generateGuid(),
         code: 1234567
      };
      try {
         await confirm(req, res);
      }
      catch(e) {
         error = e;
      }
      finally {
         expect(error.message).toBe("code is not valid");
      }
   });

   test("Code with less than 6 digits", async () => {
      req.body = {
         code: 123,
         key: generateGuid()
      };
      try {
         await confirm(req, res);
      }
      catch(e) {
         error = e;
      }
      finally {
         expect(error.message).toBe("code is not valid");
      }
   });

   test("Code with a word character", async () => {
      req.body = {
         code: "123A56",
         key: generateGuid()
      };
      try {
         await confirm(req, res);
      }
      catch(e) {
         error = e;
      }
      finally {
         expect(error.message).toBe("code is not valid");
      }
   });
});

describe("Confirmation controller valid inputs", () => {
   beforeEach(() => {
      req = {
         body: {
         },
         logger: {
            info: jest.fn(),
            error: jest.fn()
         }
      };
      res = {
         json: jest.fn(),
         send: jest.fn()
      };
      error = null;
      oneTimeCodesService.mockImplementation(() => Promise.resolve({
         find: async () => Promise.resolve({
            _id: ObjectId(),
            modifiedOn: new Date(),
            createdOn: new Date(),
            code: "123456",
            userIdentifier: "cedomir.spalevic@gmail.com",
            expiresOn: Date.now(),
            type: EMAIL_USER_IDENTIFIER_TYPE,
            key: generateGuid()
         })
      }));
   });

   test("Code is string of length 6", async () => {
      req.body = {
         code: "123456",
         key: generateGuid()
      };
      try {
         await confirm(req, res);
      }
      catch(e) {
         error = e;
      }
      finally {
         expect(error).toBe(null);
         expect(res.send).toHaveBeenCalled();
      }
   });

   test("Code is all numbers", async () => {
      req.body = {
         code: 123456,
         key: generateGuid()
      };
      try {
         await confirm(req, res);
      }
      catch(e) {
         error = e;
      }
      finally {
         expect(error).toBe(null);
         expect(res.send).toHaveBeenCalled();
      }
   });
});