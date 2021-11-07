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

   async create(properties) {
      const utcDateTime = new Date().toISOString();
      const driver = getDriver();
      const session = driver.session();
      const result = await session.run(
         `CREATE (n: ${this.#entityName} $input) RETURN n`,
         {
            input: {
               ...properties,
               id: generateGuid(),
               createdOn: utcDateTime,
               modifiedOn: utcDateTime
            }
         }
      );
      return this.#getRecords(result);
   }

   async update(id, properties) {
      const driver = getDriver();
      const session = driver.session();
      let query = `MATCH (n: ${this.#entityName} {id: $id})`;
      if (properties) {
         properties = { ...properties, modifiedOn: new Date().toISOString() };
         const whereClause = Object.keys(properties)
            .map((property) => `n.${property} = $input.${property}`)
            .join(", ");
         query += ` SET ${whereClause}`;
      }
      query += " RETURN n";
      const result = await session.run(query, {
         id,
         input: {
            ...properties
         }
      });
      return this.#getRecords(result);
   }

   async delete(id) {
      const driver = getDriver();
      const session = driver.session();
      await session.run(
         `MATCH (n: ${this.#entityName}) WHERE n.id = $input.id DELETE n`,
         {
            input: {
               id
            }
         }
      );
   }

   async getById(id) {
      const driver = getDriver();
      const session = driver.session();
      const result = await session.run(
         `MATCH (n: ${
            this.#entityName
         }) WHERE n.id = $input.id AND n.userId = $input.userId RETURN n`,
         {
            input: {
               id,
               userId: this.#req.user.id
            }
         }
      );
      return this.#getRecords(result);
   }

   async find(properties) {
      const driver = getDriver();
      const session = driver.session();
      let query = `MATCH (n: ${this.#entityName})`;
      if (properties) {
         const whereClause = Object.keys(properties)
            .map((property) => `n.${property} = $input.${property}`)
            .join(" AND ");
         query += ` WHERE ${whereClause}`;
      }
      query += " RETURN n";
      const result = await session.run(query, {
         input: {
            ...properties
         }
      });
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
   // async find(properties, logicalOperator = "AND") {
   //    const driver = getDriver();
   //    const session = driver.session();
   //    const whereClause = Object.keys(properties)
   //       .map((key) => `n.${key} = '${properties[key]}'`)
   //       .join(logicalOperator);
   //    const query = `MATCH (n: ${
   //       this.#entityName
   //    }) WHERE ${whereClause} RETURN n`;
   //    const result = await session.run(query);
   //    return this.#getRecords(result);
   // }
}

module.exports = NeoGraphQueries;
