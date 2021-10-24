import challenge from "controllers/auth/challenge/index";
import { generateOneTimeCode, getExpirationLength } from "lib/security/oneTimeCode";
import { getOneTimeCodesCollection } from "services/mongodb/index";
import { sendOneTimeCodeVerification } from "lib/verification/index";
import { ObjectId } from "mongodb";
import { v4 as generateGuid } from "uuid";

jest.mock("lib/security/oneTimeCode", () => ({
   ...jest.requireActual("lib/security/oneTimeCode"),
   generateOneTimeCode: jest.fn()
}));
jest.mock("services/mongodb/index");
jest.mock("lib/verification/index");

let req;
let res;
let error;
let key;
let code;
let expires;

describe("challenge controller invalid inputs", () => {
   beforeEach(() => {
      req = {
         body: {},
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
      key = generateGuid();
      code = "123456";
      expires = getExpirationLength();
   });

   test("missing userIdentifier", async () => {
      try {
         await challenge(req, res);
      }
      catch(e) {
         error = e;
      }
      finally {
         expect(error.message).toBe("userIdentifier is required");
      }
   });

   test("null userIdentifier", async () => {
      req.body = {
         userIdentifier: null
      };
      try {
         await challenge(req, res);
      }
      catch(e) {
         error = e;
      }
      finally {
         expect(error.message).toBe("email is not valid");
      }
   });
   
   test("blank userIdentifier", async () => {
      req.body = { userIdentifier: "" };
      try {
         await challenge(req, res);
      }
      catch(e) {
         error = e;
      }
      finally {
         expect(error.message).toBe("email is not valid");
      }
   });
   
   test("invalid email", async () => {
      req.body = { userIdentifier: "@charlie.gmail.com" };
      try {
         await challenge(req, res);
      }
      catch(e) {
         error = e;
      }
      finally {
         expect(error.message).toBe("email is not valid");
      }
   });

   test("email with only spaces", async () => {
      req.body = { userIdentifier: "       @           " };
      try {
         await challenge(req, res);
      }
      catch(e) {
         error = e;
      }
      finally {
         expect(error.message).toBe("email is not valid");
      }
   });

   test("phone number with only spaces", async () => {
      req.body = { userIdentifier: "                  " };
      try {
         await challenge(req, res);
      }
      catch(e) {
         error = e;
      }
      finally {
         expect(error.message).toBe("phoneNumber is not valid");
      }
   });   

   test("email with spaces", async () => {
      req.body = { userIdentifier: "      CEDOMIR.SPALEVIC@GMAIL.COM         " };
      try {
         await challenge(req, res);
      }
      catch(e) {
         error = e;
      }
      finally {
         expect(error.message).toBe("email is not valid");
      }
   });
});

describe("challenge controller valid inputs", () => {
   beforeEach(() => {
      req = {
         body: {
            userIdentifier: ""
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
      key = generateGuid();
      code = "123456";
      expires = getExpirationLength();
      generateOneTimeCode.mockImplementation(() => ({
         userIdentifier: req.body.userIdentifier,
         key,
         code,
         expiresOn: Date.now()
      }));
      getOneTimeCodesCollection.mockImplementation(() => Promise.resolve({
         create: async () => Promise.resolve({
            _id: ObjectId(),
            modifiedOn: new Date(),
            createdOn: new Date(),
            code,
            key
         })
      }));
      sendOneTimeCodeVerification.mockImplementation(() => Promise.resolve({}));
   });

   test("all caps email", async () => {
      req.body = { userIdentifier: "CEDOMIR.SPALEVIC@GMAIL.COM" };
      try {
         await challenge(req, res);
      }
      catch(e) {
         error = e;
      }
      finally {
         expect(error).toBe(null);
         expect(res.json).toHaveBeenCalledTimes(1);
         expect(res.json).toHaveBeenCalledWith({
            key,
            expires
         });
      }
   });

   test("valid phone number", async () => {
      req.body = { userIdentifier: "6309152350" };
      try {
         await challenge(req, res);
      }
      catch(e) {
         error = e;
      }
      finally {
         expect(error).toBe(null);
         expect(res.json).toHaveBeenCalledTimes(1);
         expect(res.json).toHaveBeenCalledWith({
            key,
            expires
         });
      }
   });

   
   test("valid phone number", async () => {
      req.body = { userIdentifier: "(630) 915-2350" };
      try {
         await challenge(req, res);
      }
      catch(e) {
         error = e;
      }
      finally {
         expect(error).toBe(null);
         expect(res.json).toHaveBeenCalledTimes(1);
         expect(res.json).toHaveBeenCalledWith({
            key,
            expires
         });
      }
   });

   test("valid phone number", async () => {
      req.body = { userIdentifier: "1 630 915 2350" };
      try {
         await challenge(req, res);
      }
      catch(e) {
         error = e;
      }
      finally {
         expect(error).toBe(null);
         expect(res.json).toHaveBeenCalledTimes(1);
         expect(res.json).toHaveBeenCalledWith({
            key,
            expires
         });
      }
   });
   
   test("valid phone number", async () => {
      req.body = { userIdentifier: "16309152350" };
      try {
         await challenge(req, res);
      }
      catch(e) {
         error = e;
      }
      finally {
         expect(error).toBe(null);
         expect(res.json).toHaveBeenCalledTimes(1);
         expect(res.json).toHaveBeenCalledWith({
            key,
            expires
         });
      }
   });

   test("valid phone number", async () => {
      req.body = { userIdentifier: "+16309152350" };
      try {
         await challenge(req, res);
      }
      catch(e) {
         error = e;
      }
      finally {
         expect(error).toBe(null);
         expect(res.json).toHaveBeenCalledTimes(1);
         expect(res.json).toHaveBeenCalledWith({
            key,
            expires
         });
      }
   });

   test("valid email", async () => {
      req.body = { userIdentifier: "charlie.spalevic@gmail.com" };
      try {
         await challenge(req, res);
      }
      catch(e) {
         error = e;
      }
      finally {
         expect(error).toBe(null);
         expect(res.json).toHaveBeenCalledTimes(1);
         expect(res.json).toHaveBeenCalledWith({
            key,
            expires
         });
      }
   });
});