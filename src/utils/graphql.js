const graphqlTools = require("@graphql-tools/load-files");

module.exports.loadFiles = async (
   path,
   { extensions, recursive } = { extensions: [], recursive: false }
) => {
   return await graphqlTools.loadFiles(path, {
      extensions,
      recursive
   });
};
