const refresh = require("controllers/auth/refresh");
const { getRefreshTokensCollection } = require("services/mongodb");
const { generateKey } = require("utils/random");

jest.mock("services/mongodb");
jest.mock("jsonwebtoken");

let req;
let res;
let error;

describe("refresh controller invalid inputs", () => {
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
   });

   test("Missing refreshToken", async () => {
      try {
         await refresh(req, res);
      } catch (e) {
         error = e;
      } finally {
         expect(error.message).toBe("refreshToken is required");
      }
   });

   test("Null refreshToken", async () => {
      req.body = {
         refreshToken: null
      };
      try {
         await refresh(req, res);
      } catch (e) {
         error = e;
      } finally {
         expect(error.message).toBe("refreshToken is not valid");
      }
   });
});

describe("refresh controller not found or expired refresh tokens", () => {
   beforeEach(() => {
      req = {
         body: {
            refreshToken: generateKey()
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

   test("no refresh token found", async () => {
      getRefreshTokensCollection.mockImplementation(() =>
         Promise.resolve({
            find: async () => Promise.resolve(null)
         })
      );
      try {
         await refresh(req, res);
      } catch (e) {
         error = e;
      } finally {
         expect(error.message).toBe("Unauthorized");
      }
   });

   test("expired refresh token", async () => {
      getRefreshTokensCollection.mockImplementation(() =>
         Promise.resolve({
            find: async () =>
               Promise.resolve({
                  expires: Date.now() - 100000 // forcing expiration
               })
         })
      );
      try {
         await refresh(req, res);
      } catch (e) {
         error = e;
      } finally {
         expect(error.message).toBe("Unauthorized");
      }
   });
});
