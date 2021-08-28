import { makeExecutableSchema } from "@graphql-tools/schema";
import {
   DateTimeTypeDefinition,
   ObjectIDTypeDefinition
} from "graphql-scalars";
import ApiKeyTypeDefinition from "models/schemas/apiKey.graphql";
import BudgetTypeDefinition from "models/schemas/budget.graphql";
import RecurrenceTypeDefinition from "models/schemas/recurrence.graphql";
//import UserTypeDefinition from "models/schemas/user.graphql";
//import BudgetItemTypeDefinition from "models/schemas/budgetItem.graphql";
//import IncomeTypeDefinition from "models/schemas/income.graphql";
//import PaymentTypeDefinition from "models/schemas/payment.graphql";

const schema = makeExecutableSchema({
   typeDefs: [
      DateTimeTypeDefinition,
      ObjectIDTypeDefinition,
      ApiKeyTypeDefinition,
      BudgetTypeDefinition,
      RecurrenceTypeDefinition
   ]
});

export default schema;
