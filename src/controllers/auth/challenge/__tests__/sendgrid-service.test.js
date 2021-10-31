const challenge = require("controllers/auth/challenge");
const { generateOneTimeCode } = require("lib/security/oneTimeCode");
const { getOneTimeCodesCollection } = require("services/mongodb");
const { v4 } = require("uuid");
const { ObjectId } = require("mongodb");
const { EMAIL_USER_IDENTIFIER_TYPE } = require("utils/constants");
const sendgridMail = require("@sendgrid/mail");

jest.mock("lib/security/oneTimeCode", () => ({
   ...jest.requireActual("lib/security/oneTimeCode"),
   generateOneTimeCode: jest.fn()
}));
jest.mock("services/mongodb");
jest.mock("@sendgrid/mail");

let req;
let res;
let error;
let key;
let code;

describe("challenge valid inputs with Sendgrid errors", () => {
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
         userIdentifierType: EMAIL_USER_IDENTIFIER_TYPE,
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
   });

   test("sendgrid service threw an error on connection", async () => {
      sendgridMail.setApiKey.mockImplementation(() => {
         throw new Error();
      });
      try {
         await challenge(req, res);
      }
      catch(e) {
         error = e;
      }
      finally {
         expect(error.message).toBe("Downstream error: Sendgrid connection error");
      }
   });

   test("sendgrid service threw an error on send", async () => {
      sendgridMail.setApiKey.mockImplementation(() => {});
      sendgridMail.send.mockImplementation(() => Promise.reject({}));
      try {
         await challenge(req, res);
      }
      catch(e) {
         error = e;
      }
      finally {
         expect(error.message).toBe("Downstream error: Sendgrid email error");
      }
   });
});