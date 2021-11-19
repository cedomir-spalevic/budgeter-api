const { UserInputError } = require("apollo-server-errors");
const { GraphQLScalarType, Kind } = require("graphql");

const throwError = () => {
   throw new UserInputError(
      "Invalid Date scalar: provided value is not an integer between 1-31"
   );
};

const validateDate = (value) => {
   if (
      typeof value === "number" &&
      Number.isInteger(value) &&
      value >= 1 &&
      value <= 31
   ) {
      return value;
   }
   throwError();
};

const dateScalar = new GraphQLScalarType({
   name: "Date",
   description: "Describes a field that represents a date of the month",
   serialize: validateDate,
   parseValue: validateDate,
   parseLiteral: (ast) => {
      if (ast.kind === Kind.INT) {
         return validateDate(parseInt(ast.value, 10));
      }
      throwError();
   }
});

module.exports = dateScalar;
