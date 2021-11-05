const challenge = require("controllers/auth/challenge");
const { generateOneTimeCode } = require("lib/security/oneTimeCode");
const { getOneTimeCodesCollection } = require("services/mongodb");
const { v4 } = require("uuid");
const { ObjectId } = require("mongodb");
const twilio = require("twilio");
const { PHONE_USER_IDENTIFIER_TYPE } = require("utils/constants");
const { generateGuid } = require("utils/random");

jest.mock("lib/security/oneTimeCode", () => ({
   ...jest.requireActual("lib/security/oneTimeCode"),
   generateOneTimeCode: jest.fn()
}));
jest.mock("services/mongodb");
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
      key = v4();
      code = "123456";
      generateOneTimeCode.mockImplementation(() => ({
         userIdentifier: req.body.userIdentifier,
         userIdentifierType: PHONE_USER_IDENTIFIER_TYPE,
         key,
         code,
         expiresOn: Date.now()
      }));
      getOneTimeCodesCollection.mockImplementation(() =>
         Promise.resolve({
            create: async () =>
               Promise.resolve({
                  id: generateGuid(),
                  modifiedOn: new Date(),
                  createdOn: new Date(),
                  code,
                  key
               })
         })
      );
   });

   test("twilio service threw an error on connection", async () => {
      twilio.mockImplementation(() => {
         throw new Error();
      });
      try {
         await challenge(req, res);
      } catch (e) {
         error = e;
      } finally {
         expect(error.message).toBe(
            "Downstream error: Twilio connection error"
         );
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
      } catch (e) {
         error = e;
      } finally {
         expect(error.message).toBe("Downstream error: Twilio SMS error");
      }
   });
});
