import AWS from "aws-sdk";

const ses = new AWS.SES();

export const sendEmail = async (email: string, subject: string, html: string) => {
   return ses.sendEmail({
      Source: "cedomir.spalevic@gmail.com",
      Destination: { ToAddresses: [email] },
      Message: {
         Subject: {
            Data: subject,
            Charset: "utf-8"
         },
         Body: {
            Html: {
               Data: html,
               Charset: "utf-8"
            },
         }
      }
   }).promise();
}