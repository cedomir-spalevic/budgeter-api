const { generateGuid } = require("utils/random");
const { getDriver } = require("./connection");

class NeoGraphQueries {
   #req = null;
   #entityName = null;

   constructor(req, entityName) {
      this.#req = req;
      this.#entityName = entityName;
   }

   #logMessage(message, obj) {
      this.#req.logger.info(`Neo4J ${this.#entityName} service: ${message}`);
      if (obj) {
         this.#req.logger.info(obj);
      }
   }

   #getRecords(result) {
      return result.records.map((r) => r.toObject().n.properties);
   }

   /**
    * This query deletes all nodes and their relationships
    */
   async detachAndDelete() {
      /**
       * MATCH (n) DETACH DELTE n
       */
   }

   async delete(recordId) {
      const driver = getDriver();
      const session = driver.session();
      await session.run(
         `MATCH (n: ${this.#entityName} {id: '${recordId}'}) DELETE n`
      );
   }

   async create(record) {
      const utcDateTime = new Date().toUTCString();
      const driver = getDriver();
      const session = driver.session();
      const result = await session.run(
         `CREATE (n: ${this.#entityName} $props) RETURN n`,
         {
            props: {
               ...record,
               id: generateGuid(),
               createdOn: utcDateTime,
               modifiedOn: utcDateTime
            }
         }
      );
      return this.#getRecords(result);
   }

   async getAll() {
      const driver = getDriver();
      const session = driver.session();
      const result = await session.run(
         `MATCH (n: ${this.#entityName}) RETURN n`
      );
      return this.#getRecords(result);
   }
}

module.exports = NeoGraphQueries;
