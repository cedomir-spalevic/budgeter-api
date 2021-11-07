const { UserInputError } = require("apollo-server-errors");
const { GraphQLScalarType, Kind } = require("graphql");

const throwError = () => {
   throw new UserInputError(
      "Invalid Month scalar: provided value is not an integer between 0-11"
   );
};

const validateMonth = (value) => {
   if (
      typeof value === "number" &&
      Number.isInteger(value) &&
      value >= 0 &&
      value <= 11
   ) {
      return value;
   }
   throwError();
};

const monthScalar = new GraphQLScalarType({
   name: "Month",
   description: "Describes a field that represents a month",
   serialize: validateMonth,
   parseValue: validateMonth,
   parseLiteral: (ast) => {
      if (ast.kind === Kind.INT) {
         return validateMonth(parseInt(ast.value, 10));
      }
      throwError();
   }
});

module.exports = monthScalar;
