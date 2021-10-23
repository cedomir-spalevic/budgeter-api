import challenge from "../challenge.js";
import { generateOneTimeCode } from "../../../lib/security/oneTimeCode.js";
import { oneTimeCodesService } from "../../../services/mongodb/index.js";
import { v4 as generateGuid } from "uuid";

jest.mock("../../../lib/security/oneTimeCode.js", () => ({
   ...jest.requireActual("../../../lib/security/oneTimeCode.js"),
   generateOneTimeCode: jest.fn()
}));
jest.mock("../../../services/mongodb/index.js");

let req;
let res;
let error;
let key;
let code;

describe("Challenge valid inputs with Mongo errors", () => {
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
      key = generateGuid();
      code = "123456";
      generateOneTimeCode.mockImplementation(() => ({
         userIdentifier: req.body.userIdentifier,
         key,
         code,
         expiresOn: Date.now()
      }));
   });

   test("Mongodb service threw an error on connection", async () => {
      oneTimeCodesService.mockImplementation(() => Promise.reject({}));
      try {
         await challenge(req, res);
      }
      catch(e) {
         error = e;
      }
      finally {
         expect(error).toBeTruthy();
      }
   });

   test("Mongodb service threw an error on create", async () => {
      oneTimeCodesService.mockImplementation(() => Promise.resolve({
         create: async () => Promise.reject({})
      }));
      try {
         await challenge(req, res);
      }
      catch(e) {
         error = e;
      }
      finally {
         expect(res.json).not.toHaveBeenCalled();
         expect(res.send).not.toHaveBeenCalled();
         expect(error).toBeTruthy();
      }
   });
});