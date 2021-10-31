const challenge = require("controllers/auth/challenge");
const { generateOneTimeCode } = require("lib/security/oneTimeCode");
const { v4 } = require("uuid");

jest.mock("lib/security/oneTimeCode", () => ({
   ...jest.requireActual("lib/security/oneTimeCode"),
   generateOneTimeCode: jest.fn()
}));
jest.mock("mongodb", () => ({
   MongoClient: function() {
      return {
         connect: () => Promise.reject({})
      };
   }
}));

let req;
let res;
let error;
let key;
let code;

describe("challenge valid inputs with mongodb errors", () => {
   beforeEach(() => {
      req = {
         body: {
            userIdentifier: "cedomir.spalevic@gmail.com"
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
      key = v4();
      code = "123456";
      generateOneTimeCode.mockImplementation(() => ({
         userIdentifier: req.body.userIdentifier,
         key,
         code,
         expiresOn: Date.now()
      }));
   });

   test("mongodb service threw an error on connection", async () => {
      try {
         await challenge(req, res);
      }
      catch(e) {
         error = e;
      }
      finally {
         expect(error.message).toBe("Downstream error: Mongodb connection error");
      }
   });

   // TODO: Fix Mongodb tests
   test.skip("mongodb service threw an error on create", async () => {
      try {
         await challenge(req, res);
      }
      catch(e) {
         error = e;
      }
      finally {
         expect(error.message).toBe("Hello");
      }
   });
});