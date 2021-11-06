const confirm = require("controllers/auth/confirmation");
const {
   getOneTimeCodesCollection,
   getUsersCollection,
   getRefreshTokensCollection
} = require("services/mongodb");
const { generateKey, generateGuid } = require("utils/random");

jest.mock("services/mongodb");
jest.mock("jsonwebtoken");

let req;
let res;
let error;

describe("confirmation controller invalid inputs", () => {
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

   test("missing key and code", async () => {
      try {
         await confirm(req, res);
      } catch (e) {
         error = e;
      } finally {
         expect(error.message).toBe("key is required");
      }
   });

   test("missing code", async () => {
      req.body = {
         key: generateKey()
      };
      try {
         await confirm(req, res);
      } catch (e) {
         error = e;
      } finally {
         expect(error.message).toBe("code is required");
      }
   });

   test("undefined key", async () => {
      req.body = {
         key: undefined
      };
      try {
         await confirm(req, res);
      } catch (e) {
         error = e;
      } finally {
         expect(error.message).toBe("key is required");
      }
   });

   test("null key", async () => {
      req.body = {
         key: null,
         code: "123456"
      };
      try {
         await confirm(req, res);
      } catch (e) {
         error = e;
      } finally {
         expect(error.message).toBe("key is not valid");
      }
   });

   test("missing code", async () => {
      req.body = {
         key: generateKey()
      };
      try {
         await confirm(req, res);
      } catch (e) {
         error = e;
      } finally {
         expect(error.message).toBe("code is required");
      }
   });

   test("null code", async () => {
      req.body = {
         key: generateKey(),
         code: null
      };
      try {
         await confirm(req, res);
      } catch (e) {
         error = e;
      } finally {
         expect(error.message).toBe("code is not valid");
      }
   });

   test("code with more than 6 digits", async () => {
      req.body = {
         key: generateKey(),
         code: 1234567
      };
      try {
         await confirm(req, res);
      } catch (e) {
         error = e;
      } finally {
         expect(error.message).toBe("code is not valid");
      }
   });

   test("code with less than 6 digits", async () => {
      req.body = {
         code: 123,
         key: generateKey()
      };
      try {
         await confirm(req, res);
      } catch (e) {
         error = e;
      } finally {
         expect(error.message).toBe("code is not valid");
      }
   });

   test("code with a word character", async () => {
      req.body = {
         code: "123A56",
         key: generateKey()
      };
      try {
         await confirm(req, res);
      } catch (e) {
         error = e;
      } finally {
         expect(error.message).toBe("code is not valid");
      }
   });
});

describe("confirmation controller valid inputs", () => {
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
      getOneTimeCodesCollection.mockImplementation(() =>
         Promise.resolve({
            find: async () =>
               Promise.resolve({
                  id: generateGuid(),
                  modifiedOn: new Date(),
                  createdOn: new Date()
               })
         })
      );
      getUsersCollection.mockImplementation(() =>
         Promise.resolve({
            find: async () => Promise.resolve({}),
            create: async () => Promise.resolve({}),
            update: async () => Promise.resolve({})
         })
      );
      getRefreshTokensCollection.mockImplementation(() =>
         Promise.resolve({
            create: async () => Promise.resolve({})
         })
      );
   });

   test("code is string of length 6", async () => {
      req.body = {
         code: "123456",
         key: generateKey()
      };
      try {
         await confirm(req, res);
      } catch (e) {
         error = e;
      } finally {
         expect(error).toBe(null);
         expect(res.json).toHaveBeenCalled();
      }
   });

   test("code is all numbers", async () => {
      req.body = {
         code: 123456,
         key: generateKey()
      };
      try {
         await confirm(req, res);
      } catch (e) {
         error = e;
      } finally {
         expect(error).toBe(null);
         expect(res.json).toHaveBeenCalled();
      }
   });
});
