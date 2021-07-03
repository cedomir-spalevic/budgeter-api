import { BudgetType, IBudgetItem } from "models/data/budgetItem";
import { GetBudgetQueryStringParameters } from "models/requests";
import { ObjectId } from "mongodb";
import BudgeterRedisClient from "services/external/redis/client";

class UserBudgetCachingStrategy {
   private _type: string;

   constructor(type: BudgetType) {
      this._type = type === "income" ? "income" : "payment";
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
      console.log(key);
      const response = await redisClient.get(key);
      console.log(JSON.parse(response));
      if (!response) return null;
      return JSON.parse(response) as IBudgetItem[];
   };

   public set = async (
      userId: ObjectId,
      queryParams: GetBudgetQueryStringParameters,
      value: IBudgetItem[]
   ): Promise<"OK"> => {
      const redisClient = await BudgeterRedisClient.getInstance();
      const key = this.buildKey(userId, queryParams);
      return redisClient.set(key, JSON.stringify(value));
   };

   public delete = async (userId: ObjectId): Promise<void> => {
      const redisClient = await BudgeterRedisClient.getInstance();
      const matchingKey = `${userId.toHexString()}-${this._type}-budget-*`;
      const keys = await redisClient.find(matchingKey);
      console.log(keys);
      keys.forEach((k) => redisClient.delete(k));
   };
}

export default UserBudgetCachingStrategy;
