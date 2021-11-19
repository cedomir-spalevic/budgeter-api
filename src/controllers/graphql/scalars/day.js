const { UserInputError } = require("apollo-server-errors");
const { GraphQLScalarType, Kind } = require("graphql");

const throwError = () => {
   throw new UserInputError(
      "Invalid Day scalar: provided value is not an integer between 0-6"
   );
};

const validateDay = (value) => {
   if (
      typeof value === "number" &&
      Number.isInteger(value) &&
      value >= 0 &&
      value <= 6
   ) {
      return value;
   }
   throwError();
};

const dayScalar = new GraphQLScalarType({
   name: "Day",
   description: "Describes a field that represents a day of the month",
   serialize: validateDay,
   parseValue: validateDay,
   parseLiteral: (ast) => {
      if (ast.kind === Kind.INT) {
         return validateDay(parseInt(ast.value, 10));
      }
      throwError();
   }
});

module.exports = dayScalar;
