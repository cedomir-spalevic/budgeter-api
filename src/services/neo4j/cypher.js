const { CYPHER_KEYWORDS } = require("utils/constants");

class QueryBuilder {
   constructor() {
      this.query = "";
   }

   /**
    * create("p", "PaymentTag")
    * return
    * CREATE (p:PaymentTag)
    * @param {*} identifier
    * @param {*} entityName
    * @returns
    */
   create(identifier, entityName) {
      this.query += `${CYPHER_KEYWORDS.CREATE} (${identifier}:${entityName})\n`;
      return this;
   }

   /**
    * match("p", "PaymentTag")
    * returns
    * MATCH (p:PaymentTag)
    * @param {*} identifier
    * @param {*} entityName
    */
   match(identifier, entityName) {
      this.query += `${CYPHER_KEYWORDS.MATCH} (${identifier}:${entityName})\n`;
      return this;
   }

   /**
    * returns("a", "b")
    * returns
    * RETURNS a,b
    * @param  {...any} identifier
    */
   returns(...identifiers) {
      this.query += `${CYPHER_KEYWORDS.RETURNS} ${identifiers.join(",")}`;
      return this.query;
   }

   /**
    * where("p", { a: "apple", b: "banana" })
    * returns
    * WHERE p.a = "apple" AND p.b = "banana"
    * @param {*} identifier
    * @param {*} properties
    * @returns
    */
   where(identifier, properties) {
      const whereClause = Object.keys(properties)
         .map(
            (property) =>
               `${identifier}.${property} = $${identifier}.${property}`
         )
         .join(" AND ");
      this.query += `${CYPHER_KEYWORDS.WHERE} ${whereClause}\n`;
      return this;
   }

   /**
    * with("apple")
    * returns
    * WITH(apple)
    * @param {*} identifier
    * @returns
    */
   with(identifier) {
      this.query += `${CYPHER_KEYWORDS.WITH}(${identifier})\n`;
      return this;
   }
}

module.exports.getQueryBuilder = () => new QueryBuilder();
