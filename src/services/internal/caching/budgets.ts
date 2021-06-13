import { IBudgetItem } from "models/data/budgetItem";
import { GetBudgetQueryStringParameters } from "models/requests";
import { ObjectId } from "mongodb";
import BudgeterRedisClient from "services/external/redis/client";

export const getUserIncomeBudgetCache = async (userId: ObjectId, queryParams: GetBudgetQueryStringParameters): Promise<IBudgetItem[] | null> => {
   const redisClient = await BudgeterRedisClient.getInstance();
   const key = `${userId.toHexString()}-income-budget-${queryParams.month}-${queryParams.year}`;
   const start = Date.now();
   const response = await redisClient.get(key);
   const end = Date.now();
   console.log(`Redis Cache Request = ${(end-start)}ms`)
   if(!response) return null;
   return JSON.parse(response) as IBudgetItem[];
}

export const setUserIncomeBudgetCache = async (userId: ObjectId, queryParams: GetBudgetQueryStringParameters, incomes: IBudgetItem[]): Promise<boolean> => {
   const redisClient = await BudgeterRedisClient.getInstance();
   const key = `${userId.toHexString()}-income-budget-${queryParams.month}-${queryParams.year}`;
   return redisClient.set(key, JSON.stringify(incomes));
}

export const getUserPaymentBudgetCache = async (userId: ObjectId, queryParams: GetBudgetQueryStringParameters): Promise<IBudgetItem[] | null> => {
   const redisClient = await BudgeterRedisClient.getInstance();
   const key = `${userId.toHexString()}-payment-budget-${queryParams.month}-${queryParams.year}`;
   const start = Date.now();
   const response = await redisClient.get(key);
   const end = Date.now();
   console.log(`Redis Cache Request = ${(end-start)}ms`)
   if(!response) return null;
   return JSON.parse(response) as IBudgetItem[];
}

export const setUserPaymentBudgetCache = async (userId: ObjectId, queryParams: GetBudgetQueryStringParameters, payments: IBudgetItem[]): Promise<boolean> => {
   const redisClient = await BudgeterRedisClient.getInstance();
   const key = `${userId.toHexString()}-payment-budget-${queryParams.month}-${queryParams.year}`;
   return redisClient.set(key, JSON.stringify(payments));
}