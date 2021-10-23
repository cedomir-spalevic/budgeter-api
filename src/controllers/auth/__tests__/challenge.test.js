import challenge from "../challenge.js";
import { jest } from "@jest/globals";

let req;
let res;
let error;

describe("Challenge controller invalid requests", () => {
   beforeEach(() => {
      req = {
         body: {}
      };
      res = {
         send: jest.fn()
      };
      error = null;
   });

   test("Missing userIdentifier", async () => {
      try {
         await challenge(req, res);
      }
      catch(e) {
         error = e;
      }
      finally {
         expect(res.send).not.toHaveBeenCalled();
         expect(error).toBeTruthy();
      }
   });

   test("Null userIdentifier", async () => {
      req.body = {
         email: null
      };
      try {
         await challenge(req, res);
      }
      catch(e) {
         error = e;
      }
      finally {
         expect(res.send).not.toHaveBeenCalled();
         expect(error).toBeTruthy();
      }
   });
   
   test("Blank userIdentifier", async () => {
      req.body = { userIdentifier: "" };
      try {
         await challenge(req, res);
      }
      catch(e) {
         error = e;
      }
      finally {
         expect(res.send).not.toHaveBeenCalled();
         expect(error).toBeTruthy();
      }
   });
   
   test("Invalid email", async () => {
      req.body = { userIdentifier: "@charlie.gmail.com" };
      try {
         await challenge(req, res);
      }
      catch(e) {
         error = e;
      }
      finally {
         expect(res.send).not.toHaveBeenCalled();
         expect(error).toBeTruthy();
      }
   });

   test("Email with only spaces", async () => {
      req.body = { userIdentifier: "       @           " };
      try {
         await challenge(req, res);
      }
      catch(e) {
         error = e;
      }
      finally {
         expect(res.send).not.toHaveBeenCalled();
         expect(error).toBeTruthy();
      }
   });

   test("Phone number with only spaces", async () => {
      req.body = { userIdentifier: "                  " };
      try {
         await challenge(req, res);
      }
      catch(e) {
         error = e;
      }
      finally {
         expect(res.send).not.toHaveBeenCalled();
         expect(error).toBeTruthy();
      }
   });   

   test("Email with spaces", async () => {
      req.body = { userIdentifier: "      CEDOMIR.SPALEVIC@GMAIL.COM         " };
      try {
         await challenge(req, res);
      }
      catch(e) {
         error = e;
      }
      finally {
         expect(res.send).not.toHaveBeenCalled();
         expect(error).toBeTruthy();
      }
   });
});

describe("Challenge controller valid requests", () => {
   beforeEach(() => {
      req = {
         body: {}, 
         logger: {
            info: jest.fn(),
            error: jest.fn()
         }
      };
      res = {
         send: jest.fn()
      };
   });

   test("All caps email", async () => {
      // eslint-disable-next-line no-undef
      const mongoDbService = require("../../../services/mongodb/index");
      const mock = jest.spyOn(mongoDbService, "oneTimeCodesService");
      mock.mockImplementation(() => Promise.resolve({}));
      //mongoDbService.oneTimeCodesService = jest.fn(() => Promise.resolve({}));
      //mongoDbService.oneTimeCodesService.mockImplementation(() => Promise.resolve({}));
      req.body = { userIdentifier: "CEDOMIR.SPALEVIC@GMAIL.COM" };
      await challenge(req, res);
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledWith({ email: "cedomir.spalevic@gmail.com", phoneNumber: null });
   });

//    test("Null email but valid phone number", () => {
//       req.body = { email: null, phoneNumber: "6309152350" };
//       challenge(req, res);
//       sinon.assert.calledOnce(res.send);
//       sinon.assert.calledWithMatch(res.send, { email: null, phoneNumber: "+1 630 915 2350"});
//    });

//    test("Valid email but blank phone number", () => {
//       req.body = {
//          email: "charlie.spalevic@gmail.com",
//          phoneNumber: null
//       };      
//       challenge(req, res);
//       sinon.assert.calledOnce(res.send);
//       sinon.assert.calledWith(res.send, { email: "charlie.spalevic@gmail.com", phoneNumber: null });
//    });
   
//    test("Valid email but blank phone number", () => {
//       req.body = {
//          email: "charlie.spalevic@gmail.com",
//          phoneNumber: ""
//       };
//       challenge(req, res);
//       sinon.assert.calledOnce(res.send);
//       sinon.assert.calledWith(res.send, { email: "charlie.spalevic@gmail.com", phoneNumber: null });
//    });
   
//    test("Valid email but undefined phone number", () => {
//       req.body = {
//          email: "charlie.spalevic@gmail.com"
//       };
//       challenge(req, res);
//       sinon.assert.calledOnce(res.send);
//       sinon.assert.calledWith(res.send, { email: "charlie.spalevic@gmail.com", phoneNumber: null });
//    });
   
//    test("Valid phone number but blank email", () => {
//       req.body = { phoneNumber: "6309152350" };
//       challenge(req, res);
//       sinon.assert.calledOnce(res.send);
//       sinon.assert.calledWith(res.send, { email: null, phoneNumber: "+1 630 915 2350" });
//    });
   
//    test("Valid phone number but blank email", () => {
//       req.body = {
//          phoneNumber: "6309152350",
//          email: null
//       };
//       challenge(req, res);
//       sinon.assert.calledOnce(res.send);
//       sinon.assert.calledWith(res.send, { email: null, phoneNumber: "+1 630 915 2350" });
//    });
   
//    test("Valid phone number but blank email", () => {
//       req.body = {
//          phoneNumber: "6309152350",
//          email: ""
//       };
//       challenge(req, res);
//       sinon.assert.calledOnce(res.send);
//       sinon.assert.calledWith(res.send, { email: null, phoneNumber: "+1 630 915 2350" });
//    });
});