import { BudgeterError } from "../../../lib/middleware/error.js";
import { isGuid } from "../../../lib/security/guid.js";
import { isOneTimeCode } from "../../../lib/security/oneTimeCode.js";
import { oneTimeCodesService } from "../../../services/mongodb/index.js";

const validate = (req) => {
   let key = null;
   let code = null;
   if(!req.body || req.body.key === undefined) {
      req.logger.error("No key found");
      throw new BudgeterError(400, "key is required"); 
   }

   if(!req.body || req.body.code === undefined) {
      req.logger.error("No code found");
      throw new BudgeterError(400, "code is required"); 
   }

   key = req.body.key?.toString().trim();
   if(!isGuid(key)) {
      req.logger.error(`Invalid key = ${key}`);
      throw new BudgeterError(400, "key is not valid");
   }
   req.logger.info(`Key provided = ${key}`);

   code = req.body.code?.toString().trim();
   if(!isOneTimeCode(code)) {
      req.logger.error(`Invalid code = ${code}`);
      throw new BudgeterError(400, "code is not valid");
   }
   req.logger.info(`Code provided = ${code}`);

   return { key, code };
};

const findRecord  = async (req, input) => {
   const service = await oneTimeCodesService(req);
   const record = await service.find({
      key: input.key,
      code: input.code
   });
   if(!record || record.expiresOn < Date.now()) {
      throw new BudgeterError(401, "Unauthorized");
   }
   return record;
};

const confirmation = async (req, res, next) => {
   const input = validate(req);
   const record = await findRecord(req, input);
   res.send("Confirmation");
};

export default confirmation;