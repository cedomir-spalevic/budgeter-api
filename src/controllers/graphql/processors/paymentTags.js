const { getPaymentTagGraphQueries } = require("services/neo4j");

const mapResponse = (paymentTag) => ({
   id: paymentTag.id,
   tag: paymentTag.tag
});

const addPaymentTag = async (req, input) => {
   const paymentTagGraphQueries = getPaymentTagGraphQueries();
   const existingTags = await paymentTagGraphQueries.find({ tag: input.tag });
   if (existingTags.length > 0)
      throw new Error(`Payment Tag of ${input.tag} already exists`);
   const paymentTag = await paymentTagGraphQueries.create(input);
   return mapResponse(paymentTag[0]);
};

const removePaymentTag = async (req, id) => {
   const paymentTagGraphQueries = getPaymentTagGraphQueries(req);
   await paymentTagGraphQueries.delete(id);
};

const getAllPaymentTags = async (req) => {
   const paymentTagGraphQueries = getPaymentTagGraphQueries(req);
   const paymentTags = await paymentTagGraphQueries.getAll();
   return paymentTags.map(mapResponse);
};

module.exports = {
   addPaymentTag,
   removePaymentTag,
   getAllPaymentTags
};
