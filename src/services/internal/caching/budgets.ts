import { BudgetTypeValue } from "models/schemas/budget";
import { GetBudgetQueryStringParameters } from "models/requests";
import { ObjectId } from "mongodb";
import BudgeterRedisClient from "services/external/redis/client";

class UserBudgetCachingStrategy<T> {
   private _type: BudgetTypeValue;

   constructor(type: BudgetTypeValue) {
      this._type = type;
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
   ): Promise<T[] | null> => {
      const redisClient = await BudgeterRedisClient.getInstance();
      const key = this.buildKey(userId, queryParams);
      const response = await redisClient.get(key);
      if (!response) return null;
      return JSON.parse(response) as T[];
   };

   public set = async (
      userId: ObjectId,
      queryParams: GetBudgetQueryStringParameters,
      value: T[]
   ): Promise<"OK"> => {
      const redisClient = await BudgeterRedisClient.getInstance();
      const key = this.buildKey(userId, queryParams);
      return redisClient.set(key, JSON.stringify(value));
   };

   public delete = async (userId: ObjectId): Promise<void> => {
      const redisClient = await BudgeterRedisClient.getInstance();
      const matchingKey = `${userId.toHexString()}-${this._type}-budget-*`;
      const keys = await redisClient.find(matchingKey);
      keys.forEach((k) => redisClient.delete(k));
   };
}

export default UserBudgetCachingStrategy;
