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
         .build()
         .replaceAll("\n", " ");
      expect(query).toBe("MATCH (p:PaymentTag) RETURN p");
   });

   test("match query with where clause", () => {
      const query = cypherQueryBuilder
         .match("p", "PaymentTag")
         .where("p", { a: "apple" })
         .returns("p")
         .build()
         .replaceAll("\n", " ");
      expect(query).toBe("MATCH (p:PaymentTag) WHERE p.a = $p.a RETURN p");
   });

   test("match query and delete", () => {
      const query = cypherQueryBuilder
         .match("p", "PaymentTag")
         .delete("p")
         .build()
         .replaceAll("\n", " ");
      expect(query).toBe("MATCH (p:PaymentTag) DELETE p");
   });

   test("match and set and return", () => {
      const query = cypherQueryBuilder
         .match("p", "PaymentTag")
         .where("p", { id: 123 })
         .set("p", { a: "apple", b: "banana" })
         .returns("p")
         .build()
         .replaceAll("\n", " ");
      expect(query).toBe(
         "MATCH (p:PaymentTag) WHERE p.id = $p.id SET p.a = $p.a, p.b = $p.b RETURN p"
      );
   });

   test("create and return", () => {
      const query = cypherQueryBuilder
         .create("p", "PaymentTag")
         .returns("p")
         .build()
         .replaceAll("\n", " ");
      expect(query).toBe("CREATE (p:PaymentTag $p) RETURN p");
   });

   test("create and match and return", () => {
      const query = cypherQueryBuilder
         .create("p", "PaymentTag")
         .with("p")
         .match("a", "PaymentTag")
         .where("a", { id: 123 })
         .with("a")
         .returns("p", "a")
         .build()
         .replaceAll("\n", " ");
      expect(query).toBe(
         "CREATE (p:PaymentTag $p) WITH(p) MATCH (a:PaymentTag) WHERE a.id = $a.id WITH(a) RETURN p,a"
      );
   });

   test("match two and merge with relationship and return", () => {
      const query = cypherQueryBuilder
         .match("p", "Payment")
         .where("p", { id: 123 })
         .with("p")
         .match("a", "PaymentTag")
         .where("a", { tag: "Test" })
         .with("a")
         .merge("p", "rel", "TAGGED_WITH", "a")
         .returns("p", "rel", "a")
         .build()
         .replaceAll("\n", " ");
      expect(query).toBe(
         "MATCH (p:Payment) WHERE p.id = $p.id WITH(p) MATCH (a:PaymentTag) WHERE a.tag = $a.tag WITH(a) MERGE (p)-[rel: TAGGED_WITH]-(a) RETURN p,rel,a"
      );
   });

   test("create one and match one and merge with relationship and return", () => {
      const query = cypherQueryBuilder
         .create("p", "PaymentTag")
         .with("p")
         .match("a", "PaymentTag")
         .where("a", { id: 123 })
         .with("a")
         .merge("p", "rel", "TAGGED_WITH", "a")
         .returns("p", "a")
         .build()
         .replaceAll("\n", " ");
      expect(query).toBe(
         "CREATE (p:PaymentTag $p) WITH(p) MATCH (a:PaymentTag) WHERE a.id = $a.id WITH(a) MERGE (p)-[rel: TAGGED_WITH]-(a) RETURN p,a"
      );
   });
});
