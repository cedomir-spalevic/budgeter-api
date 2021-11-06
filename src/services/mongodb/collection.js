const { generateGuid } = require("utils/random");

class EntityCollection {
   #req = null;
   #collection = null;

   constructor(req, collection) {
      this.#req = req;
      this.#collection = collection;
   }

   #logMessage(message, obj) {
      this.#req.logger.info(
         `MongoDb ${this.#collection.collectionName} service: ${message}`
      );
      if (obj) {
         this.#req.logger.info(obj);
      }
   }

   async create(entity) {
      const date = new Date();
      const entityToCreate = {
         ...entity,
         id: generateGuid(),
         createdOn: date,
         modifiedOn: date
      };
      this.#logMessage("Creating record", entityToCreate);
      const response = await this.#collection.insertOne(entityToCreate);
      this.#logMessage("Create response", response.insertedId);
      return {
         ...entityToCreate
      };
   }

   async getById(id) {
      const entity = await this.#collection.findOne({ id });
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
         { id: entity.id },
         entityToUpdate
      );
      this.#logMessage("Update response", response);
      return entityToUpdate;
   }

   async delete(id) {
      this.#logMessage("Deleting record", id);
      await this.#collection.deleteOne({ id });
      this.#logMessage("Deleted record", id);
   }
}

module.exports = EntityCollection;
