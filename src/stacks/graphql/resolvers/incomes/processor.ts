/* eslint-disable @typescript-eslint/no-explicit-any */
import BudgeterMongoClient from "services/external/mongodb/client";
import { Income, PublicIncome } from "models/schemas/income";
import { FilterQuery, FindOneOptions, ObjectId, WithId } from "mongodb";
import { NotFoundError } from "models/errors";
import { BudgeterEntityCollection } from "services/external/mongodb/entityCollection";
import { GetListQueryStringParameters } from "models/requests";
import { transformResponse } from "./utils";
import { BudgetTypeValue } from "models/schemas/budget";

class IncomesProcessor {
   static instance: IncomesProcessor;
   private _userId: ObjectId;
   private _collection: BudgeterEntityCollection<Income>;
   private _allowedFieldsToUpdate: (keyof WithId<Income>)[] = [
      "title",
      "amount",
      "initialDay",
      "initialDate",
      "initialMonth",
      "initialYear",
      "recurrence"
   ];

   constructor(userId: ObjectId) {
      this._userId = userId;
   }

   private async connect(): Promise<void> {
      const budgeterClient = await BudgeterMongoClient.getInstance();
      this._collection = budgeterClient.getIncomesCollection();
   }

   static async getInstance(userId: ObjectId): Promise<IncomesProcessor> {
      if (!IncomesProcessor.instance) {
         IncomesProcessor.instance = new IncomesProcessor(userId);
         await IncomesProcessor.instance.connect();
      }
      return IncomesProcessor.instance;
   }

   public async create(request: Partial<Income>): Promise<PublicIncome> {
      const income = await this._collection.create(request);

      return transformResponse(income);
   }

   public async delete(incomeId: ObjectId): Promise<void> {
      const income = await this._collection.find({
         userId: this._userId,
         _id: incomeId
      });
      if (!income) throw new NotFoundError("No Income found with the given Id");

      await this._collection.delete(incomeId);
   }

   public async update(
      incomeId: ObjectId,
      request: Partial<WithId<Income>>
   ): Promise<PublicIncome> {
      const existingIncome: any = await this._collection.find({
         userId: this._userId,
         _id: incomeId
      });
      if (!existingIncome)
         throw new NotFoundError("No Income found with the given Id");

      this._allowedFieldsToUpdate.forEach((field: keyof WithId<Income>) => {
         if (
            request[field] !== undefined &&
            existingIncome[field] !== request[field]
         )
            existingIncome[field] = request[field];
      });

      const updatedIncome = await this._collection.update(existingIncome);

      return transformResponse(updatedIncome);
   }

   public async get(
      queryStringParameters: GetListQueryStringParameters
   ): Promise<PublicIncome[]> {
      const userIncomesQuery: FilterQuery<Income> = {
         userId: this._userId
      };
      if (queryStringParameters.search) {
         userIncomesQuery.title = {
            $regex: queryStringParameters.search,
            $options: "$I"
         };
      }
      const queryOptions: FindOneOptions<Income> = {
         limit: queryStringParameters.limit,
         skip: queryStringParameters.skip
      };
      const incomes = await this._collection.findMany(
         userIncomesQuery,
         queryOptions
      );

      return incomes.map(transformResponse);
   }

   public async getById(incomeId: ObjectId): Promise<PublicIncome> {
      const income = await this._collection.find({
         userId: this._userId,
         _id: incomeId
      });
      if (!income) throw new NotFoundError("No Income found with the given Id");

      return transformResponse(income);
   }
}

export default {
   getInstance: IncomesProcessor.getInstance
};
