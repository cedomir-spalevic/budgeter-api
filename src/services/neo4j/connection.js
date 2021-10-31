const neo4j = require("neo4j-driver");
const { getConfig } = require("config");

let driver = null;

module.exports.getDriver = () => {
   if(!driver) {
      driver = neo4j.driver(
         getConfig("NEO4J_URI"),
         neo4j.auth.basic(getConfig("NEO4J_USER"), getConfig("NEO4J_PASSWORD"))
      );
   }
   return driver;
};