import { BudgeterRequest, middy } from "middleware/handler";
import { buildSchema, graphql } from "graphql";
import { resolvers } from "./resolvers";
import { auth } from "middleware/auth";

const schema = buildSchema(`
   type PublicBudgetItemWithInfo {
      id: ID
      title: String 
      amount: Float
      initialDay: Int
      initialDate: Int
      initialMonth: Int
      initialYear: Int
      recurrence: String
      dueToday: Boolean
      numberOfOccurrences: Int
      totalAmount: Float
   }
   type GetBudgetResponse {
      incomes: [PublicBudgetItemWithInfo]
      payments: [PublicBudgetItemWithInfo]
   }
   type Query {
      budget(date: Int, month: Int, year: Int): GetBudgetResponse
   }
`)

const graphqlTest = async (request: BudgeterRequest) => {
   const body = request.body;
   const query = body["query"] as string;
   return await graphql(schema, query, resolvers, request.auth);
}

export const handler = middy()
   .useAuth(auth)
   .useJsonBodyParser()
   .use(graphqlTest)
   .go();
