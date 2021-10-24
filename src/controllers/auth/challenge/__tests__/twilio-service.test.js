import challenge from "controllers/auth/challenge";
import { generateOneTimeCode } from "lib/security/oneTimeCode";
import { getOneTimeCodesCollection } from "services/mongodb";
import { v4 as generateGuid } from "uuid";
import { ObjectId } from "mongodb";
import twilio from "twilio";
import { PHONE_USER_IDENTIFIER_TYPE } from "utils/constants";

jest.mock("lib/security/oneTimeCode", () => ({
   ...jest.requireActual("lib/security/oneTimeCode"),
   generateOneTimeCode: jest.fn()
}));
jest.mock("services/mongodb/index");
jest.mock("twilio");

let req;
let res;
let error;
let key;
let code;

describe("challenge valid inputs with Twilio errors", () => {
   beforeEach(() => {
      req = {
         body: {
            userIdentifier: "6309152350"
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
      generateOneTimeCode.mockImplementation(() => ({
         userIdentifier: req.body.userIdentifier,
         userIdentifierType: PHONE_USER_IDENTIFIER_TYPE,
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

   test("twilio service threw an error on connection", async () => {
      twilio.mockImplementation(() => {
         throw new Error();
      });
      try {
         await challenge(req, res);
      }
      catch(e) {
         error = e;
      }
      finally {
         expect(error.message).toBe("Downstream error: Twilio connection error");
      }
   });

   

   test("twilio service threw an error on send", async () => {
      twilio.mockImplementation(() => ({
         messages: {
            create: () => Promise.reject()
         }
      }));
      try {
         await challenge(req, res);
      }
      catch(e) {
         error = e;
      }
      finally {
         expect(error.message).toBe("Downstream error: Twilio SMS error");
      }
   });
});