const { CYPHER_KEYWORDS } = require("utils/constants");

class QueryBuilder {
   constructor() {
      this.query = "";
   }

   build() {
      return this.query;
   }

   /**
    * create("p", "PaymentTag")
    * return
    * CREATE (p:PaymentTag $p)
    * $p is the input provided to neo4j driver
    * @param {*} identifier
    * @param {*} entityName
    * @returns
    */
   create(identifier, entityName) {
      this.query += `${CYPHER_KEYWORDS.CREATE} (${identifier}:${entityName} $${identifier})\n`;
      return this;
   }

   /**
    * delete("p")
    * returns
    * DELETE p
    * @param {*} identifier
    */
   delete(identifier) {
      this.query += `${CYPHER_KEYWORDS.DELETE} ${identifier}`;
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
    * merge("p", "rel", "TAGGED_WITH", "a")
    * returns
    * MERGE (p)-[rel: TAGGED_WITH]-(a)
    * @param {*} firstIdentifier
    * @param {*} relationshipIdentifier
    * @param {*} relationshipName
    * @param {*} secondIdentifier
    * @returns
    */
   merge(
      firstIdentifier,
      relationshipIdentifier,
      relationshipName,
      secondIdentifier
   ) {
      this.query += `${CYPHER_KEYWORDS.MERGE} (${firstIdentifier})-[${relationshipIdentifier}: ${relationshipName}]-(${secondIdentifier})\n`;
      return this;
   }

   /**
    * returns("a", "b")
    * returns
    * RETURN a,b
    * @param  {...any} identifier
    */
   returns(...identifiers) {
      this.query += `${CYPHER_KEYWORDS.RETURN} ${identifiers.join(",")}`;
      return this;
   }

   /**
    * set("p", { c: "charlie is awesome", t: "test" })
    * returns
    * SET p.c = "charlie is awesome", p.t = "test"
    * @param {*} identifier
    * @param {*} properties
    * @returns
    */
   set(identifier, properties) {
      const setClause = Object.keys(properties)
         .map(
            (property) =>
               `${identifier}.${property} = $${identifier}.${property}`
         )
         .join(", ");
      this.query += `${CYPHER_KEYWORDS.SET} ${setClause}\n`;
      return this;
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
