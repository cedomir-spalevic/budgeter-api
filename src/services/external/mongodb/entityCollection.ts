import { Collection, FilterQuery, FindOneOptions, ObjectId, OptionalId, WithId } from "mongodb";
import { IEntity } from "models/data/ientity";

/**
 * Collection that performs basic CRUD functionality for a MongoDB collection
 */
export class BudgeterEntityCollection<T extends IEntity> {
   protected collection: Collection<T>;

   constructor(collection: Collection<T>) {
      this.collection = collection;
   }

   public async create(entity: Partial<T>): Promise<WithId<T>> {
      const date = new Date();
      const entityToCreate: any = {
         ...entity,
         createdOn: date,
         modifiedOn: date
      }
      const response = await this.collection.insertOne(entityToCreate as OptionalId<T>);
      return response.ops[0];
   }

   public async getById(id: string): Promise<WithId<T>> {
      return await this.collection.findOne({ _id: new ObjectId(id) } as FilterQuery<T>);
   }

   public async find(filter: FilterQuery<T>, options?: FindOneOptions<WithId<T> extends T ? T : WithId<T>>): Promise<WithId<T>> {
      return await this.collection.findOne(filter, options);
   }

   public async findMany(query: FilterQuery<T>, options?: FindOneOptions<WithId<T> extends T ? T : WithId<T>>): Promise<WithId<T>[]> {
      return await this.collection.find<WithId<T>>(query, options).toArray()
   }

   public async update(entity: T): Promise<WithId<T>> {
      const entityToUpdate: any = {
         ...entity,
         modifiedOn: new Date()
      }
      const response = await this.collection.replaceOne({ _id: entity._id } as FilterQuery<T>, entityToUpdate);
      return response.ops[0];
   }

   public async replace(filter: FilterQuery<T>, entity: Partial<T>): Promise<void> {
      const entityToUpdate: any = {
         ...entity,
         modifiedOn: new Date()
      }
      await this.collection.replaceOne(filter, entityToUpdate);
   }

   public async delete(id: ObjectId): Promise<void> {
      await this.collection.deleteOne({ _id: id } as FilterQuery<T>);
   }

   public async deleteAll(filter: FilterQuery<T>): Promise<void> {
      await this.collection.deleteMany(filter);
   }

   public async count(query?: FilterQuery<T>): Promise<number> {
      return await this.collection.countDocuments(query);
   }
}