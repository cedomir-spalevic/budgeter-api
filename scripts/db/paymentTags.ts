import { PaymentTag } from "../../src/models/schemas/paymentTag";
import BudgeterMongoClient from "../../src/services/external/mongodb/client";
import { BudgeterEntityCollection } from "../../src/services/external/mongodb/entityCollection";

const tags = [
   "Housing",
   "Transportation",
   "Food",
   "Utilities",
   "Insurance",
   "Medical & Healthcare",
   "Saving, Investing & Debt Payments",
   "Personal Spending",
   "Recreation & Entertainment",
   "Miscellaneous"
]

const addTag = async (tag: string, collection: BudgeterEntityCollection<PaymentTag>) => {
   // First check if the tag exists
   const paymentTag = await collection.find({ tag: tag });
   if(paymentTag) {
      console.log(`${paymentTag.tag} already exists`);
      return; // do nothing
   }
   await collection.create({ tag }); // otherwise, create
   console.log(`Created ${tag}`);
}

const run = async (): Promise<void> => {
   const client = await BudgeterMongoClient.getInstance();
   const paymentTagsCollection = client.getPaymentTagsCollection();
   await Promise.all(tags.map(tag => addTag(tag, paymentTagsCollection)))
   client.close();
   console.log("Closing mongodb connection");
}

run();