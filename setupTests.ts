import { beforeAll, afterAll } from "@jest/globals";
import BudgeterMongoClient from "./src/services/external/mongodb/client";

beforeAll(async (done) => {
   done();
})
afterAll(async (done) => {
   const budgeterClient = await BudgeterMongoClient.getInstance();
   await budgeterClient.close();
   done();
})
