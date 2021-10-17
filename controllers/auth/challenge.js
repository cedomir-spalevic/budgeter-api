import { isEmail, isPhoneNumber } from "../../utils/validators.js";
import { normalizePhoneNumber, normalizeStr } from "../../utils/normalizers.js";
import { BudgeterError } from "../../middleware/error.js";
import * as usersService from "../../services/mongodb/users.js";
import { sendEmail } from "../../services/sendgrid/email.js";

const validate = (body) => {
   let email = null;
   let phoneNumber = null;
   if(!body || (!body.email && !body.phoneNumber)) throw new BudgeterError(400, "Email or phone number is required"); 

   if(body.email) {
      if(!isEmail(body.email)) throw new BudgeterError(400, "Email is not valid");
      email = normalizeStr(body.email);
   }
   if(body.phoneNumber) {
      if(!isPhoneNumber(body.phoneNumber)) throw new BudgeterError(400, "Phone number is not valid");
      phoneNumber = normalizePhoneNumber(body.phoneNumber);
   }
   return { email, phoneNumber };
};

const challenge = async (req, res, next) => {
   const input = validate(req.body);
   //const user = await usersService.find(input);
   // Send challege
   try {
      await sendEmail("cedomir0527@gmail.com");
      res.send(input);
   }
   catch(error) {
      next(error);
   }
};

export default challenge;