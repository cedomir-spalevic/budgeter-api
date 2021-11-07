const { getAllIncomes, getIncomeById } = require("./processors/incomes");
const { getPayments, getPaymentById } = require("./processors/payments");
const { getPaymentTags } = require("./processors/paymentTags");
const { getUserById } = require("./processors/user");

const getQueryResolver = (processor) => {
   return async (parent, args, context) => {
      const { req } = context;
      return processor(req, args);
   };
};

module.exports.resolvers = {
   Query: {
      // User
      user: getQueryResolver((req) => getUserById(req)),

      // Income
      incomes: getQueryResolver((req) => getAllIncomes(req)),
      incomeById: getQueryResolver((req, args) => getIncomeById(req, args.id)),

      // Payment
      payments: getQueryResolver((req) => getPayments(req)),
      paymentById: getQueryResolver((req, args) =>
         getPaymentById(req, args.id)
      ),

      // Payment Tag
      paymentTags: getQueryResolver((req) => getPaymentTags(req))
   }
};
