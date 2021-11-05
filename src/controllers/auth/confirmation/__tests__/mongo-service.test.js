const confirm = require("controllers/auth/confirmation");
const {
   getOneTimeCodesCollection,
   getUsersCollection,
   getRefreshTokensCollection
} = require("services/mongodb");
const { ObjectId } = require("mongodb");
const { generateKey, generateCode, generateGuid } = require("utils/random");
const {
   EMAIL_USER_IDENTIFIER_TYPE,
   PHONE_USER_IDENTIFIER_TYPE
} = require("utils/constants");
const { generateRefreshToken } = require("lib/security/refreshToken");

jest.mock("services/mongodb");
jest.mock("jsonwebtoken");

let req;
let res;
let error;

describe("confirmation controller with mongo errors", () => {
   beforeEach(() => {
      req = {
         body: {
            key: generateKey(),
            code: generateCode()
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

   test("cannot find correct one time code", async () => {
      getOneTimeCodesCollection.mockImplementation(() =>
         Promise.resolve({
            find: async () => Promise.resolve(null)
         })
      );
      try {
         await confirm(req, res);
      } catch (e) {
         error = e;
      } finally {
         expect(error.message).toBe("Unauthorized");
      }
   });

   test("expired one time code", async () => {
      getOneTimeCodesCollection.mockImplementation(() =>
         Promise.resolve({
            find: async () =>
               Promise.resolve({
                  expires: Date.now() - 100000 // forcing expiration
               })
         })
      );
      try {
         await confirm(req, res);
      } catch (e) {
         error = e;
      } finally {
         expect(error.message).toBe("Unauthorized");
      }
   });

   test("user not found, user should get created", async () => {
      const createMock = jest.fn(() => Promise.resolve({ id: generateGuid() }));
      getOneTimeCodesCollection.mockImplementation(() =>
         Promise.resolve({
            find: async () =>
               Promise.resolve({
                  expires: Date.now() + 10000 // make sure its not expired
               })
         })
      );
      getUsersCollection.mockImplementation(() =>
         Promise.resolve({
            find: async () => Promise.resolve(null),
            create: createMock
         })
      );
      try {
         await confirm(req, res);
      } catch (e) {
         error = e;
      } finally {
         expect(createMock).toHaveBeenCalled();
         expect(error).toBe(null);
      }
   });

   test("user found with no email, user should get update", async () => {
      const updateMock = jest.fn();
      getOneTimeCodesCollection.mockImplementation(() =>
         Promise.resolve({
            find: async () =>
               Promise.resolve({
                  userIdentifierType: EMAIL_USER_IDENTIFIER_TYPE,
                  expires: Date.now() + 10000 // make sure its not expired
               })
         })
      );
      getUsersCollection.mockImplementation(() =>
         Promise.resolve({
            find: async () =>
               Promise.resolve({
                  id: generateGuid(),
                  email: null
               }),
            update: updateMock
         })
      );
      try {
         await confirm(req, res);
      } catch (e) {
         error = e;
      } finally {
         expect(updateMock).toHaveBeenCalled();
         expect(error).toBe(null);
      }
   });

   test("user found with no phoneNumber, user should get update", async () => {
      const updateMock = jest.fn();
      getOneTimeCodesCollection.mockImplementation(() =>
         Promise.resolve({
            find: async () =>
               Promise.resolve({
                  userIdentifierType: PHONE_USER_IDENTIFIER_TYPE,
                  expires: Date.now() + 10000 // make sure its not expired
               })
         })
      );
      getUsersCollection.mockImplementation(() =>
         Promise.resolve({
            find: async () =>
               Promise.resolve({
                  id: generateGuid(),
                  phoneNumber: null
               }),
            update: updateMock
         })
      );
      try {
         await confirm(req, res);
      } catch (e) {
         error = e;
      } finally {
         expect(updateMock).toHaveBeenCalled();
         expect(error).toBe(null);
      }
   });

   test("user found with phoneNumber, user should not get updated", async () => {
      const updateMock = jest.fn();
      getOneTimeCodesCollection.mockImplementation(() =>
         Promise.resolve({
            find: async () =>
               Promise.resolve({
                  userIdentifierType: PHONE_USER_IDENTIFIER_TYPE,
                  expires: Date.now() + 10000 // make sure its not expired
               })
         })
      );
      getUsersCollection.mockImplementation(() =>
         Promise.resolve({
            find: async () =>
               Promise.resolve({
                  id: generateGuid(),
                  phoneNumber: "123"
               }),
            update: updateMock
         })
      );
      try {
         await confirm(req, res);
      } catch (e) {
         error = e;
      } finally {
         expect(updateMock).not.toHaveBeenCalled();
         expect(error).toBe(null);
      }
   });

   test("user found with email, user should not get updated", async () => {
      const updateMock = jest.fn();
      getOneTimeCodesCollection.mockImplementation(() =>
         Promise.resolve({
            find: async () =>
               Promise.resolve({
                  userIdentifierType: EMAIL_USER_IDENTIFIER_TYPE,
                  expires: Date.now() + 10000 // make sure its not expired
               })
         })
      );
      getUsersCollection.mockImplementation(() =>
         Promise.resolve({
            find: async () =>
               Promise.resolve({
                  id: generateGuid(),
                  email: "123"
               }),
            update: updateMock
         })
      );
      try {
         await confirm(req, res);
      } catch (e) {
         error = e;
      } finally {
         expect(updateMock).not.toHaveBeenCalled();
         expect(error).toBe(null);
      }
   });
});
