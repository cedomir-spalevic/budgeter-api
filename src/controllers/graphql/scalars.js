const monthScalarType = require("./scalars/month");
const yearScalarType = require("./scalars/year");
const dayScalarType = require("./scalars/day");
const dateScalarType = require("./scalars/date");

module.exports.resolvers = {
   Day: dayScalarType,
   Date: dateScalarType,
   Month: monthScalarType,
   Year: yearScalarType
};
