import url from "url";
import { loadFiles as graphqlLoadFiles } from "@graphql-tools/load-files";

export const loadFiles = async (path, { extensions } = { extensions: [] }) => {
   return await graphqlLoadFiles(path, {
      extensions,
      ignoreIndex: true,
      requireMethod: async (path) => import(url.pathToFileURL(path))
   });
};