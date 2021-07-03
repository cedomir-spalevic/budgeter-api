import redis, { RedisClient } from "redis";

class BudgeterRedisClient {
   private _client: RedisClient;
   static instance: BudgeterRedisClient;

   private async connect(): Promise<void> {
      this._client = redis.createClient(
         parseInt(process.env.REDIS_SERVER_PORT, 10),
         process.env.REDIS_SERVER_HOST,
         {
            // Decode base64. PWD is base64 encoded because of dotenv special characters
            auth_pass: Buffer.from(
               process.env.REDIS_SERVER_PWD,
               "base64"
            ).toString(),
            return_buffers: true
         }
      );
   }

   static async getInstance(): Promise<BudgeterRedisClient> {
      if (!BudgeterRedisClient.instance) {
         BudgeterRedisClient.instance = new BudgeterRedisClient();
         await BudgeterRedisClient.instance.connect();
      }
      return BudgeterRedisClient.instance;
   }

   public set = (key: string, value: string): Promise<"OK"> => {
      return new Promise((resolve, reject) => {
         this._client.set(key, value, (err, res) => {
            if (err) reject(err);
            resolve(res);
         });
      });
   };

   public get = (key: string): Promise<string | null> => {
      return new Promise((resolve, reject) => {
         this._client.get(key, (err, reply) => {
            if (err) reject(err);
            resolve(reply as string | null);
         });
      });
   };

   public find = (match: string): Promise<string[] | null> => {
      return new Promise((resolve, reject) => {
         this._client.scan("0", "MATCH", match, (err, res) => {
            if (err) reject(err);
            const keys = res[1].map((k) => Buffer.from(k).toString());
            resolve(keys);
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
