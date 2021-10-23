import challenge from "../challenge.js";
import { generateOneTimeCode } from "../../../lib/security/oneTimeCode.js";
import { oneTimeCodesService } from "../../../services/mongodb/index.js";
import { v4 as generateGuid } from "uuid";
import { getClient } from "../../../services/twilio/connection";
import { ObjectId } from "mongodb";

jest.mock("../../../lib/security/oneTimeCode.js", () => ({
   ...jest.requireActual("../../../lib/security/oneTimeCode.js"),
   generateOneTimeCode: jest.fn()
}));
jest.mock("../../../services/twilio/connection");
jest.mock("../../../services/mongodb/index.js");
jest.mock("twilio");

let req;
let res;
let error;
let key;
let code;

describe("Challenge valid inputs with Twilio errors", () => {
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
         key,
         code,
         expiresOn: Date.now()
      }));
      oneTimeCodesService.mockImplementation(() => Promise.resolve({
         create: async () => Promise.resolve({
            _id: ObjectId(),
            modifiedOn: new Date(),
            createdOn: new Date(),
            code,
            key
         })
      }));
   });

   test("Twilio service threw an error on connection", async () => {
      getClient.mockImplementation(() => Promise.reject({}));
      try {
         await challenge(req, res);
      }
      catch(e) {
         error = e;
      }
      finally {
         expect(getClient).toHaveBeenCalled();
         expect(res.json).not.toHaveBeenCalled();
         expect(res.send).not.toHaveBeenCalled();
         expect(error).toBeTruthy();
      }
   });

   

   test("Twilio service threw an error on send", async () => {
      getClient.mockImplementation(() => Promise.resolve({
         messages: ({
            create: () => Promise.reject({})
         })
      }));
      try {
         await challenge(req, res);
      }
      catch(e) {
         error = e;
      }
      finally {
         expect(getClient).toHaveBeenCalled();
         expect(res.json).not.toHaveBeenCalled();
         expect(res.send).not.toHaveBeenCalled();
         expect(error).toBeTruthy();
      }
   });
});