import BudgeterMongoClient from "services/external/mongodb/client";
import { FilterQuery, FindOneOptions, ObjectId } from "mongodb";
import { NotFoundError } from "models/errors";
import { BudgeterEntityCollection } from "services/external/mongodb/entityCollection";
import { GetListQueryStringParameters } from "models/requests";
import { transformResponse } from "./utils";
import { PaymentTag, PublicPaymentTag } from "models/schemas/paymentTag";

class PaymentTagsProcessor {
   static instance: PaymentTagsProcessor;
   private _collection: BudgeterEntityCollection<PaymentTag>;

   private async connect(): Promise<void> {
      const budgeterClient = await BudgeterMongoClient.getInstance();
      this._collection = budgeterClient.getPaymentTagsCollection();
   }

   static async getInstance(): Promise<PaymentTagsProcessor> {
      if (!PaymentTagsProcessor.instance) {
         PaymentTagsProcessor.instance = new PaymentTagsProcessor();
         await PaymentTagsProcessor.instance.connect();
      }
      return PaymentTagsProcessor.instance;
   }

   public async create(
      request: Partial<PaymentTag>
   ): Promise<PublicPaymentTag> {
      const paymentTag = await this._collection.create(request);

      return transformResponse(paymentTag);
   }

   public async delete(id: ObjectId): Promise<void> {
      const paymentTag = await this._collection.find({
         _id: id
      });
      if (!paymentTag)
         throw new NotFoundError("No PaymentTag found with the given Id");

      await this._collection.delete(paymentTag._id);
   }

   public async get(
      queryStringParameters: GetListQueryStringParameters
   ): Promise<PublicPaymentTag[]> {
      const paymentTagsQuery: FilterQuery<PaymentTag> = {};
      if (queryStringParameters.search) {
         paymentTagsQuery.key = {
            $regex: queryStringParameters.search,
            $options: "$I"
         };
      }
      const queryOptions: FindOneOptions<PaymentTag> = {
         limit: queryStringParameters.limit,
         skip: queryStringParameters.skip
      };
      const paymentTags = await this._collection.findMany(
         paymentTagsQuery,
         queryOptions
      );

      return paymentTags.map(transformResponse);
   }

   public async getById(id: ObjectId): Promise<PublicPaymentTag> {
      const query: FilterQuery<PaymentTag> = {
         _id: id
      };
      const paymentTag = await this._collection.find(query);
      if (!paymentTag)
         throw new NotFoundError(`No Payment Tag found with the Id: ${id}`);

      return transformResponse(paymentTag);
   }
}

export default {
   getInstance: PaymentTagsProcessor.getInstance
};
