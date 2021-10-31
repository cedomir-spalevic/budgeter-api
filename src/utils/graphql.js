const graphqlTools = require("@graphql-tools/load-files");

module.exports.loadFiles = async (path, { extensions } = { extensions: [] }) => {
   return await graphqlTools.loadFiles(path, {
      extensions,
      recursive: false
   });
};