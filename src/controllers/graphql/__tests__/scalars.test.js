const { ApolloServer, gql } = require("apollo-server-express");
const { loadFiles } = require("utils/graphql");
const { mergeTypeDefs, mergeResolvers } = require("@graphql-tools/merge");
const path = require("path");
const { getPaymentGraphQueries } = require("services/neo4j");
const { generateGuid } = require("utils/random");

jest.mock("services/neo4j");

let req;
let server;

const executeOp = async (input) => {
   return await server.executeOperation({
      query: gql`
         mutation ADD_PAYMENT($input: AddPaymentInput) {
            addPayment(payment: $input) {
               success
               message
            }
         }
      `,
      variables: { input }
   });
};

describe("Apollo Server custom scalar validation tests", () => {
   beforeEach(async () => {
      req = {
         user: {
            id: generateGuid()
         },
         logger: {
            info: jest.fn(),
            error: jest.fn()
         }
      };
      const typesArray = await loadFiles(path.join("schemas"), {
         recursive: true,
         extensions: ["gql"]
      });
      const typeDefs = mergeTypeDefs(typesArray);
      const resolversArray = await loadFiles(
         path.join("controllers", "graphql"),
         {
            recursive: false,
            extensions: ["js"]
         }
      );
      const resolvers = mergeResolvers(resolversArray);
      server = new ApolloServer({
         typeDefs,
         resolvers,
         context: () => ({ req })
      });
   });

   test("initialDate is less than 1", async () => {
      const result = await executeOp({
         title: "Test",
         amount: 95,
         initialDate: 0,
         initialDay: 4,
         initialMonth: 1,
         initialYear: 2021,
         recurrence: "MONTHLY"
      });
      expect(result.errors.length).toBeGreaterThan(0);
      expect(
         result.errors[0].message.includes(
            "Invalid Date scalar: provided value is not an integer between 1-31"
         )
      ).toBe(true);
   });

   test("initialDate is greater than 31", async () => {
      const result = await executeOp({
         title: "Test",
         amount: 95,
         initialDate: 35,
         initialDay: 4,
         initialMonth: 1,
         initialYear: 2021,
         recurrence: "MONTHLY"
      });
      expect(result.errors.length).toBeGreaterThan(0);
      expect(
         result.errors[0].message.includes(
            "Invalid Date scalar: provided value is not an integer between 1-31"
         )
      ).toBe(true);
   });

   test("initialDate is not a number", async () => {
      const result = await executeOp({
         title: "Test",
         amount: 95,
         initialDate: "35",
         initialDay: 4,
         initialMonth: 1,
         initialYear: 2021,
         recurrence: "MONTHLY"
      });
      expect(result.errors.length).toBeGreaterThan(0);
      expect(
         result.errors[0].message.includes(
            "Invalid Date scalar: provided value is not an integer between 1-31"
         )
      ).toBe(true);
   });

   test("initialDate is 1", async () => {
      const result = await executeOp({
         title: "Test",
         amount: 95,
         initialDate: 1,
         initialDay: 4,
         initialMonth: 1,
         initialYear: 2021,
         recurrence: "MONTHLY"
      });
      expect(result.errors).toBe(undefined);
   });

   test("initialDate is 31", async () => {
      const result = await executeOp({
         title: "Test",
         amount: 95,
         initialDate: 31,
         initialDay: 4,
         initialMonth: 1,
         initialYear: 2021,
         recurrence: "MONTHLY"
      });
      expect(result.errors).toBe(undefined);
   });

   test("initialDay is less than 0", async () => {
      const result = await executeOp({
         title: "Test",
         amount: 95,
         initialDate: 27,
         initialDay: -1,
         initialMonth: 1,
         initialYear: 2021,
         recurrence: "MONTHLY"
      });
      expect(result.errors.length).toBeGreaterThan(0);
      expect(
         result.errors[0].message.includes(
            "Invalid Day scalar: provided value is not an integer between 0-6"
         )
      ).toBe(true);
   });

   test("initialDay is greater than 6", async () => {
      const result = await executeOp({
         title: "Test",
         amount: 95,
         initialDate: 27,
         initialDay: 7,
         initialMonth: 1,
         initialYear: 2021,
         recurrence: "MONTHLY"
      });
      expect(result.errors.length).toBeGreaterThan(0);
      expect(
         result.errors[0].message.includes(
            "Invalid Day scalar: provided value is not an integer between 0-6"
         )
      ).toBe(true);
   });

   test("initialDay is not a number", async () => {
      const result = await executeOp({
         title: "Test",
         amount: 95,
         initialDate: 2,
         initialDay: "4",
         initialMonth: 1,
         initialYear: 2021,
         recurrence: "MONTHLY"
      });
      expect(result.errors.length).toBeGreaterThan(0);
      expect(
         result.errors[0].message.includes(
            "Invalid Day scalar: provided value is not an integer between 0-6"
         )
      ).toBe(true);
   });

   test("initialDay is 0", async () => {
      const result = await executeOp({
         title: "Test",
         amount: 95,
         initialDate: 2,
         initialDay: 0,
         initialMonth: 1,
         initialYear: 2021,
         recurrence: "MONTHLY"
      });
      expect(result.errors).toBe(undefined);
   });

   test("initialDay is 6", async () => {
      const result = await executeOp({
         title: "Test",
         amount: 95,
         initialDate: 2,
         initialDay: 6,
         initialMonth: 1,
         initialYear: 2021,
         recurrence: "MONTHLY"
      });
      expect(result.errors).toBe(undefined);
   });

   test("initialMonth is less than 0", async () => {
      const result = await executeOp({
         title: "Test",
         amount: 95,
         initialDate: 27,
         initialDay: 1,
         initialMonth: -1,
         initialYear: 2021,
         recurrence: "MONTHLY"
      });
      expect(result.errors.length).toBeGreaterThan(0);
      expect(
         result.errors[0].message.includes(
            "Invalid Month scalar: provided value is not an integer between 0-11"
         )
      ).toBe(true);
   });

   test("initialMonth is greater than 11", async () => {
      const result = await executeOp({
         title: "Test",
         amount: 95,
         initialDate: 27,
         initialDay: 4,
         initialMonth: 12,
         initialYear: 2021,
         recurrence: "MONTHLY"
      });
      expect(result.errors.length).toBeGreaterThan(0);
      expect(
         result.errors[0].message.includes(
            "Invalid Month scalar: provided value is not an integer between 0-11"
         )
      ).toBe(true);
   });

   test("initialMonth is not a number", async () => {
      const result = await executeOp({
         title: "Test",
         amount: 95,
         initialDate: 2,
         initialDay: 4,
         initialMonth: "1",
         initialYear: 2021,
         recurrence: "MONTHLY"
      });
      expect(result.errors.length).toBeGreaterThan(0);
      expect(
         result.errors[0].message.includes(
            "Invalid Month scalar: provided value is not an integer between 0-11"
         )
      ).toBe(true);
   });

   test("initialMonth is 0", async () => {
      const result = await executeOp({
         title: "Test",
         amount: 95,
         initialDate: 2,
         initialDay: 4,
         initialMonth: 0,
         initialYear: 2021,
         recurrence: "MONTHLY"
      });
      expect(result.errors).toBe(undefined);
   });

   test("initialMonth is 11", async () => {
      const result = await executeOp({
         title: "Test",
         amount: 95,
         initialDate: 2,
         initialDay: 4,
         initialMonth: 11,
         initialYear: 2021,
         recurrence: "MONTHLY"
      });
      expect(result.errors).toBe(undefined);
   });

   test("initialYear is 3 digits", async () => {
      const result = await executeOp({
         title: "Test",
         amount: 95,
         initialDate: 27,
         initialDay: 1,
         initialMonth: 1,
         initialYear: 221,
         recurrence: "MONTHLY"
      });
      expect(result.errors.length).toBeGreaterThan(0);
      expect(
         result.errors[0].message.includes(
            "Invalid Year scalar: provided value is not an integer between 1900-2100"
         )
      ).toBe(true);
   });

   test("initialYear is 5 digits", async () => {
      const result = await executeOp({
         title: "Test",
         amount: 95,
         initialDate: 27,
         initialDay: 4,
         initialMonth: 7,
         initialYear: 20212,
         recurrence: "MONTHLY"
      });
      expect(result.errors.length).toBeGreaterThan(0);
      expect(
         result.errors[0].message.includes(
            "Invalid Year scalar: provided value is not an integer between 1900-2100"
         )
      ).toBe(true);
   });

   test("initialYear is not a number", async () => {
      const result = await executeOp({
         title: "Test",
         amount: 95,
         initialDate: 2,
         initialDay: 4,
         initialMonth: 1,
         initialYear: "2021",
         recurrence: "MONTHLY"
      });
      expect(result.errors.length).toBeGreaterThan(0);
      expect(
         result.errors[0].message.includes(
            "Invalid Year scalar: provided value is not an integer between 1900-2100"
         )
      ).toBe(true);
   });

   test("Successful request", async () => {
      getPaymentGraphQueries.mockImplementation(() => ({
         create: async () => [{}]
      }));
      const result = await executeOp({
         title: "Test",
         amount: 95,
         initialDate: 5,
         initialDay: 4,
         initialMonth: 1,
         initialYear: 2021,
         recurrence: "MONTHLY"
      });
      expect(result.data.addPayment.success).toBe(true);
   });
});
