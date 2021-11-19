const { getPaymentGraphQueries } = require("services/neo4j");
const { NEO4J_RELATIONSHIPS } = require("utils/constants");

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
   const properties = {
      userId: req.user.id,
      ...input
   };
   if (properties.tags) {
      properties.tags = properties.tags.map((tag) => ({
         relationship: NEO4J_RELATIONSHIPS.TAGGED_WITH,
         value: tag
      }));
   }
   const paymentGraphQueries = getPaymentGraphQueries(req);
   const payments = await paymentGraphQueries.create(properties);
   return mapResponse(payments[0]);
};

const removePayment = async (req, id) => {
   const paymentGraphQueries = getPaymentGraphQueries(req);
   await paymentGraphQueries.delete(id);
};

const updatePayment = async (req, input) => {
   const paymentGraphQueries = getPaymentGraphQueries(req);
   const payments = await paymentGraphQueries.update(input.id, input.payment);
   return mapResponse(payments[0]);
};

const getPaymentById = async (req, id) => {
   const paymentGraphQueries = getPaymentGraphQueries(req);
   const payments = await paymentGraphQueries.getById(id);
   return mapResponse(payments[0]);
};

const getPayments = async (req) => {
   const paymentGraphQueries = getPaymentGraphQueries(req);
   const payments = await paymentGraphQueries.find({
      userId: req.user.id
   });
   return payments.map(mapResponse);
};

module.exports = {
   getPayments,
   addPayment,
   removePayment,
   updatePayment,
   getPaymentById
};
