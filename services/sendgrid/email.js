import { getClient } from "./connection.js";

export const sendEmail = async (to, html) => {
   const client = getClient();
   const data = {
      to,
      from: "budgeterbot@cedomir.tech",
      subject: "Sending with sendgrid is fun",
      html: "<b>nice</b>"
   };
   await client.send(data);
};