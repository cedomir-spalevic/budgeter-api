/* eslint-disable @typescript-eslint/no-explicit-any */
import BudgeterMongoClient from "services/external/mongodb/client";
import { Payment, PublicPayment } from "models/schemas/payment";
import { FilterQuery, ObjectId, WithId } from "mongodb";
import { NotFoundError } from "models/errors";
import { BudgeterEntityCollection } from "services/external/mongodb/entityCollection";
import { GetListQueryStringParameters } from "models/requests";
import { transformResponse } from "./utils";

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
      if (!PaymentsProcessor.instance) {
         PaymentsProcessor.instance = new PaymentsProcessor(userId);
         await PaymentsProcessor.instance.connect();
      }
      return PaymentsProcessor.instance;
   }

   public async create(request: Partial<Payment>): Promise<PublicPayment> {
      const payment = await this._collection.create(request);

      return transformResponse(payment);
   }

   public async delete(paymentId: ObjectId): Promise<void> {
      const payment = await this._collection.find({
         userId: this._userId,
         _id: paymentId
      });
      if (!payment)
         throw new NotFoundError("No Payment found with the given Id");

      await this._collection.delete(paymentId);
   }

   public async update(
      paymentId: ObjectId,
      request: Partial<WithId<Payment>>
   ): Promise<void> {
      const existingPayment: any = await this._collection.find({
         userId: this._userId,
         _id: paymentId
      });
      if (!existingPayment)
         throw new NotFoundError("No Payment found with the given Id");

      this._allowedFieldsToUpdate.forEach((field: keyof WithId<Payment>) => {
         if (
            request[field] !== undefined &&
            existingPayment[field] !== request[field]
         )
            existingPayment[field] = request[field];
      });
      if(request["tags"]) {
         existingPayment["tags"] = request["tags"];
      }

      await this._collection.update(existingPayment);
   }

   public async get(
      filters: GetListQueryStringParameters
   ): Promise<PublicPayment[]> {
      const match: Record<string, FilterQuery<Payment>> = {
         $match: {
            userId: this._userId
         }
      }
      if(filters.search) {
         match["$match"].title = {
            $regex: filters.search,
            $options: "$I"
         }
      }
      const pipeline: Record<string, unknown>[] = [
         match,
         {
            $skip: filters.skip
         },
         {
            $limit: filters.limit
         },
         {
            $lookup: {
               from: "paymentTags",
               localField: "tags",
               foreignField: "id",
               as: "tags"
            }
         }
      ];
      const payments = await this._collection.aggregate(pipeline);

      return payments.map(transformResponse);
   }

   public async getById(paymentId: ObjectId): Promise<PublicPayment> {
      const pipeline: Record<string, unknown>[] = [
         {
            $match: {
               userId: this._userId,
               _id: paymentId
            }
         },
         {
            $lookup: {
               from: "paymentTags",
               localField: "tags",
               foreignField: "id",
               as: "tags"
            }
         }
      ];
      const payments = await this._collection.aggregate(pipeline);
      if (payments.length !== 1)
         throw new NotFoundError("No Payment found with the given Id");

      return transformResponse(payments[0]);
   }
}

export default {
   getInstance: PaymentsProcessor.getInstance
};
