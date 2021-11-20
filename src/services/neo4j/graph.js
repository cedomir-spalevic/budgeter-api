const { generateGuid } = require("utils/random");
const { getDriver } = require("./connection");
const { getQueryBuilder } = require("./cypher");

class NeoGraphQueries {
   constructor(req, entityName) {
      this.req = req;
      this.entityName = entityName;
   }

   getEntityName() {
      return this.entityName;
   }

   logMessage(message, obj) {
      this.req.logger.info(`Neo4J ${this.entityName} service: ${message}`);
      if (obj) {
         this.req.logger.info(obj);
      }
   }

   getRecords(result) {
      return result.records.map((r) => r.toObject().n.properties);
   }

   /**
    * Create a new record
    * @param {*} properties
    * @param {*} relationships [{ name: "<name of relationship>", properties: {} }]
    * @returns
    */
   async create(properties) {
      const query = getQueryBuilder()
         .create("input", this.entityName)
         .returns("input")
         .build();
      const utcDateTime = new Date().toISOString();
      const driver = getDriver();
      const session = driver.session();
      const result = await session.run(query, {
         input: {
            ...properties,
            id: generateGuid(),
            createdOn: utcDateTime,
            modifiedOn: utcDateTime
         }
      });
      return this.getRecords(result);
   }

   async update(id, properties) {
      properties = { ...properties, modifiedOn: new Date().toISOString() };
      const query = getQueryBuilder()
         .match("input", this.entityName)
         .where("input", { id })
         .set("input", properties)
         .returns("input")
         .build();
      const driver = getDriver();
      const session = driver.session();
      const result = await session.run(query, {
         input: {
            id,
            ...properties
         }
      });
      return this.getRecords(result);
   }

   async delete(id) {
      const query = getQueryBuilder()
         .match("input", this.entityName)
         .where("input", { id })
         .delete("input")
         .build();
      const driver = getDriver();
      const session = driver.session();
      await session.run(query, {
         input: {
            id
         }
      });
   }

   async getById(id) {
      const query = getQueryBuilder()
         .match("input", this.entityName)
         .where("input", { id })
         .returns("input")
         .build();
      const driver = getDriver();
      const session = driver.session();
      const result = await session.run(query, {
         input: {
            id,
            userId: this.req.user.id
         }
      });
      return this.getRecords(result);
   }

   async find(properties) {
      const query = getQueryBuilder()
         .match("input", this.entityName)
         .where("input", properties)
         .returns("input")
         .build();
      const driver = getDriver();
      const session = driver.session();
      const result = await session.run(query, {
         input: {
            ...properties
         }
      });
      return this.getRecords(result);
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
   //       this.entityName
   //    }) WHERE ${whereClause} RETURN n`;
   //    const result = await session.run(query);
   //    return this.getRecords(result);
   // }
}

module.exports = NeoGraphQueries;
