/* eslint-disable @typescript-eslint/no-explicit-any */
import BudgeterMongoClient from "services/external/mongodb/client";
import { ObjectId } from "mongodb";
import { NotFoundError } from "models/errors";
import { BudgeterEntityCollection } from "services/external/mongodb/entityCollection";
import { transformResponse } from "./utils";
import { PublicUser, User } from "models/schemas/user";

class MeProcessor {
   static instance: MeProcessor;
   private _userId: ObjectId;
   private _collection: BudgeterEntityCollection<User>;
   constructor(userId: ObjectId) {
      this._userId = userId;
   }

   private async connect(): Promise<void> {
      const budgeterClient = await BudgeterMongoClient.getInstance();
      this._collection = budgeterClient.getUsersCollection();
   }

   static async getInstance(userId: ObjectId): Promise<MeProcessor> {
      if (!MeProcessor.instance) {
         MeProcessor.instance = new MeProcessor(userId);
         await MeProcessor.instance.connect();
      }
      return MeProcessor.instance;
   }

   public async update(input: Partial<User>): Promise<PublicUser> {
      const existingUser = await this._collection.find({
         _id: this._userId
      });
      if (!existingUser) throw new NotFoundError("No User found");

      if (
         input.firstName !== undefined &&
         existingUser.firstName !== input.firstName
      )
         existingUser.firstName = input.firstName;
      if (
         input.lastName !== undefined &&
         existingUser.lastName !== input.lastName
      )
         existingUser.lastName = input.lastName;
      if (
         input.notificationPreferences.incomeNotifications !== undefined &&
         existingUser.notificationPreferences.incomeNotifications !==
            input.notificationPreferences.incomeNotifications
      )
         existingUser.notificationPreferences.incomeNotifications =
            input.notificationPreferences.incomeNotifications;
      if (
         input.notificationPreferences.paymentNotifications !== undefined &&
         existingUser.notificationPreferences.paymentNotifications !==
            input.notificationPreferences.paymentNotifications
      )
         existingUser.notificationPreferences.paymentNotifications =
            input.notificationPreferences.paymentNotifications;

      const updatedUser = await this._collection.update(existingUser);
      return transformResponse(updatedUser);
   }

   public async get(): Promise<PublicUser> {
      const user = await this._collection.getById(this._userId.toHexString());
      if (!user) throw new NotFoundError("No User found");
      return transformResponse(user);
   }
}

export default {
   getInstance: MeProcessor.getInstance
};
