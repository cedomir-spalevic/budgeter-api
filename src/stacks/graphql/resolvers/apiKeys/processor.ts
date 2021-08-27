import BudgeterMongoClient from "services/external/mongodb/client";
import { ApiKey, PublicApiKey } from "models/schemas/apiKey";
import { getRandomKey } from "services/internal/security/randomKey";
import { generateHash } from "services/internal/security/hash";
import { ObjectId } from "mongodb";
import { NotFoundError } from "models/errors";
import { BudgeterEntityCollection } from "services/external/mongodb/entityCollection";

class ApiKeyProcessor {
   static instance: ApiKeyProcessor;
   private _collection: BudgeterEntityCollection<ApiKey>;

   private async connect(): Promise<void> {
      const budgeterClient = await BudgeterMongoClient.getInstance();
      this._collection = budgeterClient.getApiKeyCollection();
   }

   static async getInstance(): Promise<ApiKeyProcessor> {
      if(!ApiKeyProcessor.instance) {
         ApiKeyProcessor.instance = new ApiKeyProcessor();
         await ApiKeyProcessor.instance.connect();
      }
      return ApiKeyProcessor.instance;
   }

   private buildKey = (): string => `budgeter/${getRandomKey()}`;

   public async create(): Promise<PublicApiKey> {
      const key = this.buildKey();
      const hash = generateHash(key);
      const apiKey = await this._collection.create({ key: hash });

      return {
         id: apiKey._id.toHexString(),
         key: key
      }
   }

   public async get(): Promise<PublicApiKey[]> {
      const apiKeys = await this._collection.findMany({});

      return apiKeys.map((apiKey) => ({
         id: apiKey._id.toHexString(),
         key: apiKey.key
      }))
   }

   public async delete(apiKeyId: ObjectId): Promise<ObjectId> {
      const apiKey = await this._collection.find({ _id: apiKeyId });
      if (!apiKey) throw new NotFoundError("No API Key found with the given Id");
   
      await this._collection.delete(apiKeyId);
      return apiKeyId;
   }
}

export default {
   getInstance: ApiKeyProcessor.getInstance
}