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

   async create(record) {
      const utcDateTime = new Date().toISOString();
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

   async delete(recordId) {
      const driver = getDriver();
      const session = driver.session();
      await session.run(
         `MATCH (n: ${this.#entityName} {id: '${recordId}'}) DELETE n`
      );
   }

   async getById(id) {
      const driver = getDriver();
      const session = driver.session();
      const query = `MATCH (n: ${
         this.#entityName
      }) WHERE n.id = '${id}' AND n.userId = '${this.#req.user.id}' RETURN n`;
      const result = await session.run(query);
      return this.#getRecords(result);
   }

   // TODO: clean this up
   async createAndMatchAndMerge() {
      /**
       * CREATE (p: Payment { title: 'Something' })
WITH (p)
MATCH (t: PaymentTag)
WHERE t.tag = 'Test' OR t.tag = 'Test 2'
WITH (t)
MERGE (p)-[rel: TAGGED_WITH]-(t)
RETURN p, rel, t
       */
   }

   // TODO: clean this up
   async find(properties, logicalOperator = "AND") {
      const driver = getDriver();
      const session = driver.session();
      const whereClause = Object.keys(properties)
         .map((key) => `n.${key} = '${properties[key]}'`)
         .join(logicalOperator);
      const query = `MATCH (n: ${
         this.#entityName
      }) WHERE ${whereClause} RETURN n`;
      const result = await session.run(query);
      return this.#getRecords(result);
   }

   // TODO: Clean up this query
   async getAll(properties) {
      const driver = getDriver();
      const session = driver.session();
      let query = `MATCH (n: ${this.#entityName}) RETURN n`;
      if (properties) {
         const keys = Object.keys(properties)
            .map((key) => `${key}: '${properties[key]}'`)
            .join(",");
         const propertyQuery = `{${keys}}`;
         query = `MATCH (n: ${this.#entityName} ${propertyQuery}) RETURN n`;
      }
      const result = await session.run(query);
      return this.#getRecords(result);
   }
}

module.exports = NeoGraphQueries;
