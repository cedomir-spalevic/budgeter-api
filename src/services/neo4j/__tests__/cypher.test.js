const { getQueryBuilder } = require("../cypher");

let cypherQueryBuilder;

describe("cypher query builder tests", () => {
   beforeEach(() => {
      cypherQueryBuilder = getQueryBuilder();
   });

   afterEach(() => {
      cypherQueryBuilder = null;
   });

   test("match query", () => {
      const query = cypherQueryBuilder
         .match("p", "PaymentTag")
         .returns("p")
         .replaceAll("\n", " ");
      expect(query).toBe("MATCH (p:PaymentTag) RETURNS p");
   });

   test("match query with where clause", () => {
      const query = cypherQueryBuilder
         .match("p", "PaymentTag")
         .where("p", { a: "apple" })
         .returns("p")
         .replaceAll("\n", " ");
      expect(query).toBe("MATCH (p:PaymentTag) WHERE p.a = $p.a RETURNS p");
   });
});
