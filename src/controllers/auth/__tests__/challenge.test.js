import challenge from "../challenge.js";
import sinon from "sinon";

let req;
let res;

describe("Challenge controller invalid requests", () => {
   beforeEach(() => {
      req = {
         body: {}
      };
      res = {
         send: sinon.stub()
      };
   });

   test("Missing email and phone number", () => {
      expect(() => {
         challenge(req, res);
      }).toThrowError();
   });

   test("Null email", () => {
      expect(() => {
         req.body = {
            email: null
         };
         challenge(req, res);
      }).toThrowError();
   });
   
   test("Invalid email", () => {
      expect(() => {
         req.body = { email: "charlie.gmail.com" };
         challenge(req, res);
      }).toThrowError();
   });
   
   test("Blank email and phone number", () => {
      expect(() => {
         req.body = { email: "", phoneNumber: "" };
         challenge(req, res);
      }).toThrowError();
   });

   test("Email with only spaces", () => {
      expect(() => {
         req.body = { email: "                  " };
         challenge(req, res);
      }).toThrowError();
   });

   test("Phone number with only spaces", () => {
      expect(() => {
         req.body = { phoneNumber: "                  " };
         challenge(req, res);
      }).toThrowError();
   });   

   test("Email with spaces", () => {
      expect(() => {
         req.body = { email: "      CEDOMIR.SPALEVIC@GMAIL.COM         " };
         challenge(req, res);
      }).toThrowError();
   });
});

describe("Challenge controller valid requests", () => {
   beforeEach(() => {
      req = {
         body: {}
      };
      res = {
         send: sinon.spy()
      };
   });

   test("All caps email", () => {
      req.body = { email: "CEDOMIR.SPALEVIC@GMAIL.COM" };
      challenge(req, res);
      sinon.assert.calledOnce(res.send);
      sinon.assert.calledWithMatch(res.send, { email: "cedomir.spalevic@gmail.com", phoneNumber: null });
   });

   test("Null email but valid phone number", () => {
      req.body = { email: null, phoneNumber: "6309152350" };
      challenge(req, res);
      sinon.assert.calledOnce(res.send);
      sinon.assert.calledWithMatch(res.send, { email: null, phoneNumber: "+1 630 915 2350"});
   });

   test("Valid email but blank phone number", () => {
      req.body = {
         email: "charlie.spalevic@gmail.com",
         phoneNumber: null
      };      
      challenge(req, res);
      sinon.assert.calledOnce(res.send);
      sinon.assert.calledWith(res.send, { email: "charlie.spalevic@gmail.com", phoneNumber: null });
   });
   
   test("Valid email but blank phone number", () => {
      req.body = {
         email: "charlie.spalevic@gmail.com",
         phoneNumber: ""
      };
      challenge(req, res);
      sinon.assert.calledOnce(res.send);
      sinon.assert.calledWith(res.send, { email: "charlie.spalevic@gmail.com", phoneNumber: null });
   });
   
   test("Valid email but undefined phone number", () => {
      req.body = {
         email: "charlie.spalevic@gmail.com"
      };
      challenge(req, res);
      sinon.assert.calledOnce(res.send);
      sinon.assert.calledWith(res.send, { email: "charlie.spalevic@gmail.com", phoneNumber: null });
   });
   
   test("Valid phone number but blank email", () => {
      req.body = { phoneNumber: "6309152350" };
      challenge(req, res);
      sinon.assert.calledOnce(res.send);
      sinon.assert.calledWith(res.send, { email: null, phoneNumber: "+1 630 915 2350" });
   });
   
   test("Valid phone number but blank email", () => {
      req.body = {
         phoneNumber: "6309152350",
         email: null
      };
      challenge(req, res);
      sinon.assert.calledOnce(res.send);
      sinon.assert.calledWith(res.send, { email: null, phoneNumber: "+1 630 915 2350" });
   });
   
   test("Valid phone number but blank email", () => {
      req.body = {
         phoneNumber: "6309152350",
         email: ""
      };
      challenge(req, res);
      sinon.assert.calledOnce(res.send);
      sinon.assert.calledWith(res.send, { email: null, phoneNumber: "+1 630 915 2350" });
   });
});