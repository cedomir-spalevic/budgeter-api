import { BudgetType, IBudgetItem } from "models/data/budgetItem";
import { GetBudgetQueryStringParameters } from "models/requests";
import { ObjectId } from "mongodb";
import BudgeterRedisClient from "services/external/redis/client";

class UserBudgetCachingStrategy {
   private _type: string;
   static instance: UserBudgetCachingStrategy;

   constructor(type: BudgetType) {
      this._type = type === "income" ? "income" : "payment";
   }

   static getInstance(type: BudgetType): UserBudgetCachingStrategy {
      if (!UserBudgetCachingStrategy.instance)
         UserBudgetCachingStrategy.instance = new UserBudgetCachingStrategy(
            type
         );
      return UserBudgetCachingStrategy.instance;
   }

   private buildKey = (
      userId: ObjectId,
      queryParams: GetBudgetQueryStringParameters
   ) =>
      `${userId.toHexString()}-${this._type}-budget-${queryParams.month}-${
         queryParams.year
      }`;

   public get = async (
      userId: ObjectId,
      queryParams: GetBudgetQueryStringParameters
   ): Promise<IBudgetItem[] | null> => {
      const redisClient = await BudgeterRedisClient.getInstance();
      const key = this.buildKey(userId, queryParams);
      const response = await redisClient.get(key);
      if (!response) return null;
      return JSON.parse(response) as IBudgetItem[];
   };

   public set = async (
      userId: ObjectId,
      queryParams: GetBudgetQueryStringParameters,
      value: IBudgetItem[]
   ) => {
      const redisClient = await BudgeterRedisClient.getInstance();
      const key = this.buildKey(userId, queryParams);
      return redisClient.set(key, JSON.stringify(value));
   };

   public delete = async (
      userId: ObjectId,
      queryParams: GetBudgetQueryStringParameters
   ) => {
      const redisClient = await BudgeterRedisClient.getInstance();
      const key = this.buildKey(userId, queryParams);
      return redisClient.delete(key);
   };
}

export default {
   getInstance: UserBudgetCachingStrategy.getInstance
};
