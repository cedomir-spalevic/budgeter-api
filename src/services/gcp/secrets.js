const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");
const { exec } = require("child_process");
const yaml = require("js-yaml");

const client = new SecretManagerServiceClient();

const getProjectId = async () => {
   if (!process.env.LOCAL) return process.env.GOOGLE_CLOUD_PROJECT;

   return new Promise((resolve, reject) => {
      exec("gcloud app describe", (error, stdout) => {
         if (error) reject(error);
         const description = yaml.load(stdout);
         resolve(description.id);
      });
   });
};

const getSecrets = async () => {
   const secrets = {};

   const projectId = await getProjectId();

   const [secretsList] = await client.listSecrets({
      parent: `projects/${projectId}`
   });

   for (const secret of secretsList) {
      const [version] = await client.accessSecretVersion({
         name: `${secret.name}/versions/latest`
      });
      const name = secret.name.substr(secret.name.lastIndexOf("/") + 1);
      const data = version.payload.data.toString();
      secrets[name] = data;
   }

   return secrets;
};

module.exports = {
   getSecrets
};
