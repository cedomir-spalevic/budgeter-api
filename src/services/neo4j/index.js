const { NEO4J_ENTITIES } = require("utils/constants");
const NeoGraphQueries = require("./graph");

const getNeoGraphInstance = (req, entityName) =>
   new NeoGraphQueries(req, entityName);

module.exports.getPaymentTagGraphQueries = (req) =>
   getNeoGraphInstance(req, NEO4J_ENTITIES.PAYMENT_TAGS);
