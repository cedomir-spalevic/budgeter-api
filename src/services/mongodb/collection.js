const { ObjectId } = require("mongodb");

class EntityCollection {
   #req = null;
   #collection = null;

   constructor(req, collection) {
      this.#req = req;
      this.#collection = collection;
   }

   #logMessage(message, obj) {
      this.#req.logger.info(`MongoDb ${this.#collection.collectionName} service: ${message}`);
      if(obj) {
         this.#req.logger.info(obj);
      }
   }

   async aggregate(pipeline, options) {
      return await this.#collection.aggregate(pipeline,options).toArray();
   }

   async create(entity) {
      const date = new Date();
      const entityToCreate = {
         ...entity,
         createdOn: date,
         modifiedOn: date
      };
      this.#logMessage("Creating record", entityToCreate);
      const response = await this.#collection.insertOne(entityToCreate);
      this.#logMessage("Create response", response.insertedId);
      return {
         ...entityToCreate,
         _id: response.insertedId
      };
   }

   async getById(id) {
      const entity = await this.#collection.findOne({
         _id: new ObjectId(id)
      });
      return entity;
   }

   async find(filter, options) {
      this.#logMessage("Finding one record", filter);
      const response = await this.#collection.findOne(filter, options);
      this.#logMessage("Find one response", response);
      return response;
   }

   async findMany(query, options) {
      this.#logMessage("Finding many records", query);
      const response = await this.#collection.find(query, options).toArray();
      this.#logMessage("Find many response", response);
      return response;
   }

   async update(entity) {
      const entityToUpdate = {
         ...entity,
         modifiedOn: new Date()
      };
      this.#logMessage("Updating record", entityToUpdate);
      const response = await this.#collection.replaceOne(
         { _id: entity._id },
         entityToUpdate
      );
      this.#logMessage("Update response", response);
      return response.ops[0];
   }

   async replace(filter, entity) {
      const entityToUpdate = {
         ...entity,
         modifiedOn: new Date()
      };
      await this.#collection.replaceOne(filter, entityToUpdate);
   }

   async delete(id) {
      await this.#collection.deleteOne({ _id: id });
   }

   async deleteAll(filter) {
      await this.#collection.deleteMany(filter);
   }

   async count(query) {
      return await this.#collection.countDocuments(query);
   }
} 

module.exports = EntityCollection;