const { getAllIncomes, getIncomeById } = require("./processors/incomes");
const { getAllPayments, getPaymentById } = require("./processors/payments");
const { getAllPaymentTags } = require("./processors/paymentTags");
const { findUserById } = require("./processors/user");

const getQueryResolver = (processor) => {
   return async (parent, args, context, info) => {
      const { req } = context;
      return processor(req, args);
   };
};

module.exports.resolvers = {
   Query: {
      // User
      user: getQueryResolver((req) => findUserById(req)),

      // Income
      incomes: getQueryResolver((req) => getAllIncomes(req)),
      incomeById: getQueryResolver((req, args) => getIncomeById(req, args.id)),

      // Payment
      payments: getQueryResolver((req) => getAllPayments(req)),
      paymentById: getQueryResolver((req, args) =>
         getPaymentById(req, args.id)
      ),

      // Payment Tag
      paymentTags: getQueryResolver((req) => getAllPaymentTags(req))
   }
};
