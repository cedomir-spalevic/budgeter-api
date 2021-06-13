import redis, { RedisClient } from "redis";

class BudgeterRedisClient {
   private _client: RedisClient;
   static instance: BudgeterRedisClient;

   private async connect(): Promise<void> {
      this._client = redis.createClient("redis://127.0.0.1:6379");
   }

   static async getInstance(): Promise<BudgeterRedisClient> {
      if (!BudgeterRedisClient.instance) {
         BudgeterRedisClient.instance = new BudgeterRedisClient();
         await BudgeterRedisClient.instance.connect();
      }
      return BudgeterRedisClient.instance;
   }

   public set = (key: string, value: string): boolean => {
      return this._client.set(key, value);
   };

   public get = (key: string): Promise<string | null> => {
      return new Promise((resolve, reject) => {
         this._client.get(key, (err, reply) => {
            if (err) reject(err);
            resolve(reply as string | null);
         });
      });
   };

   public delete = (key: string): boolean => {
      return this._client.del(key);
   };
}

export default {
   getInstance: (): Promise<BudgeterRedisClient> =>
      BudgeterRedisClient.getInstance()
};
