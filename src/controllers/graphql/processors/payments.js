const { getPaymentGraphQueries } = require("services/neo4j");

const mapResponse = (payment) => ({
   id: payment.id,
   title: payment.title,
   amount: payment.amount,
   recurrence: payment.recurrence,
   createdOn: payment.createdOn,
   modifiedOn: payment.modifiedOn,
   initialDate: payment.initialDate,
   initialDay: payment.initialDay,
   initialMonth: payment.initialMonth,
   initialYear: payment.initialYear,
   endDate: payment.endDate ?? null,
   endDay: payment.endDay ?? null,
   endMonth: payment.endMonth ?? null,
   endYear: payment.endYear ?? null
});

const addPayment = async (req, input) => {
   const paymentGraphQueries = getPaymentGraphQueries(req);
   const payments = await paymentGraphQueries.create({
      userId: req.user.id,
      ...input
   });
   return mapResponse(payments[0]);
};

const removePayment = async (req, id) => {
   const paymentGraphQueries = getPaymentGraphQueries(req);
   await paymentGraphQueries.delete(id);
};

const getPaymentById = async (req, id) => {
   const paymentGraphQueries = getPaymentGraphQueries(req);
   const payments = await paymentGraphQueries.getById(id);
   return mapResponse(payments[0]);
};

const getAllPayments = async (req) => {
   const paymentGraphQueries = getPaymentGraphQueries(req);
   const payments = await paymentGraphQueries.getAll({
      userId: req.user.id
   });
   return payments.map(mapResponse);
};

module.exports = {
   getAllPayments,
   addPayment,
   removePayment,
   getPaymentById
};
