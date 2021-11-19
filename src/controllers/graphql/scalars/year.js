const { UserInputError } = require("apollo-server-errors");
const { GraphQLScalarType, Kind } = require("graphql");

const throwError = () => {
   throw new UserInputError(
      "Invalid Year scalar: provided value is not an integer between 1900-2100"
   );
};

const validateYear = (value) => {
   if (
      typeof value === "number" &&
      Number.isInteger(value) &&
      value >= 1900 &&
      value <= 2100
   ) {
      return value;
   }
   throwError();
};

const yearScalar = new GraphQLScalarType({
   name: "Year",
   description: "Describes a field that represents a year",
   serialize: validateYear,
   parseValue: validateYear,
   parseLiteral: (ast) => {
      if (ast.kind === Kind.INT) {
         return validateYear(parseInt(ast.value, 10));
      }
      throwError();
   }
});

module.exports = yearScalar;
