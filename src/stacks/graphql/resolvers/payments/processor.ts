/* eslint-disable @typescript-eslint/no-explicit-any */
import BudgeterMongoClient from "services/external/mongodb/client";
import { Payment, PublicPayment } from "models/schemas/payment";
import UserBudgetCachingStrategy from "services/internal/caching/budgets";
import { FilterQuery, FindOneOptions, ObjectId, WithId } from "mongodb";
import { NotFoundError } from "models/errors";
import { BudgeterEntityCollection } from "services/external/mongodb/entityCollection";
import { GetListQueryStringParameters } from "models/requests";
import { transformResponse } from "./utils";
import { BudgetTypeValue } from "models/schemas/budget";

class PaymentsProcessor {
   static instance: PaymentsProcessor;
   private _userId: ObjectId;
   private _collection: BudgeterEntityCollection<Payment>;
   private _allowedFieldsToUpdate: (keyof WithId<Payment>)[] = [
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
      this._collection = budgeterClient.getPaymentsCollection();
   }

   static async getInstance(userId: ObjectId): Promise<PaymentsProcessor> {
      if(!PaymentsProcessor.instance) {
         PaymentsProcessor.instance = new PaymentsProcessor(userId);
         await PaymentsProcessor.instance.connect();
      }
      return PaymentsProcessor.instance;
   }

   public async create(request: Partial<Payment>): Promise<PublicPayment> {
      const payment = await this._collection.create(request);
   
      const cachingStrategy = new UserBudgetCachingStrategy(BudgetTypeValue.Payment);
      cachingStrategy.delete(payment.userId);
   
      return transformResponse(payment);
   }

   public async delete(paymentId: ObjectId): Promise<void> {
      const payment = await this._collection.find({
         userId: this._userId,
         _id: paymentId
      });
      if (!payment) throw new NotFoundError("No Payment found with the given Id");

      const cachingStrategy = new UserBudgetCachingStrategy(BudgetTypeValue.Payment);
      cachingStrategy.delete(this._userId);

      await this._collection.delete(paymentId);
   }

   public async update(paymentId: ObjectId, request: Partial<WithId<Payment>>): Promise<PublicPayment> {
      const existingPayment: any = await this._collection.find({
         userId: this._userId,
         _id: paymentId
      });
      if (!existingPayment) throw new NotFoundError("No Payment found with the given Id");
      
      this._allowedFieldsToUpdate.forEach((field: keyof WithId<Payment>) => {
         if (
            request[field] !== undefined &&
            existingPayment[field] !== request[field]
         )
            existingPayment[field] = request[field];
      });

      const updatedPayment = await this._collection.update(existingPayment);

      const cachingStrategy = new UserBudgetCachingStrategy(BudgetTypeValue.Payment);
      cachingStrategy.delete(existingPayment.userId);

      return transformResponse(updatedPayment);
   }

   public async get(queryStringParameters: GetListQueryStringParameters): Promise<PublicPayment[]> {
      const userPaymentsQuery: FilterQuery<Payment> = {
         userId: this._userId
      };
      if (queryStringParameters.search) {
         userPaymentsQuery.title = {
            $regex: queryStringParameters.search,
            $options: "$I"
         };
      }
      const queryOptions: FindOneOptions<Payment> = {
         limit: queryStringParameters.limit,
         skip: queryStringParameters.skip
      };
      const payments = await this._collection.findMany(
         userPaymentsQuery,
         queryOptions
      );

      return payments.map(transformResponse);
   }

   public async getById(paymentId: ObjectId): Promise<PublicPayment> {
      const payment = await this._collection.find({
         userId: this._userId,
         _id: paymentId
      });
      if(!payment)
         throw new NotFoundError("No Payment found with the given Id");
      
      return transformResponse(payment);
   }
}

export default {
   getInstance: PaymentsProcessor.getInstance
}