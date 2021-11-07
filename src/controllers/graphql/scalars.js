const monthScalarType = require("./scalarTypes/month");
const yearScalarType = require("./scalarTypes/year");
const dayScalarType = require("./scalarTypes/day");
const dateScalarType = require("./scalarTypes/date");

module.exports.resolvers = {
   Day: dayScalarType,
   Date: dateScalarType,
   Month: monthScalarType,
   Year: yearScalarType
};
