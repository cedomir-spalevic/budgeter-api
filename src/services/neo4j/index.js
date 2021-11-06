const { NEO4J_ENTITIES } = require("utils/constants");
const NeoGraphQueries = require("./graph");

const getNeoGraphInstance = (req, entityName) =>
   new NeoGraphQueries(req, entityName);

module.exports.getIncomeGraphQueries = (req) =>
   getNeoGraphInstance(req, NEO4J_ENTITIES.INCOMES);

module.exports.getPaymentGraphQueries = (req) =>
   getNeoGraphInstance(req, NEO4J_ENTITIES.PAYMENTS);

module.exports.getPaymentTagGraphQueries = (req) =>
   getNeoGraphInstance(req, NEO4J_ENTITIES.PAYMENT_TAGS);
