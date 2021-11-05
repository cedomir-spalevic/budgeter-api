const { getPaymentTagGraphQueries } = require("services/neo4j");

const mapResponse = (paymentTag) => ({
   id: paymentTag.id,
   tag: paymentTag.tag
});

const addPaymentTag = async (req, input) => {
   const paymentTagGraphQueries = getPaymentTagGraphQueries();
   const paymentTag = await paymentTagGraphQueries.create({ tag: input.tag });
   return mapResponse(paymentTag[0]);
};

const removePaymentTag = async (req, id) => {
   const paymentTagGraphQueries = getPaymentTagGraphQueries();
   await paymentTagGraphQueries.delete(id);
};

const getAllPaymentTags = async (req) => {
   const paymentTagGraphQueries = getPaymentTagGraphQueries();
   const paymentTags = await paymentTagGraphQueries.getAll();
   return paymentTags.map(mapResponse);
};

module.exports = {
   addPaymentTag,
   removePaymentTag,
   getAllPaymentTags
};
