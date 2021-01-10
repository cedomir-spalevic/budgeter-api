import AWS from "aws-sdk";
import { newAccountConfirmationTemplate } from "views/new-account-confirmation";

const ses = new AWS.SES();

export const sendVerificationEmail = async (email: string, code: string) => {
   return ses.sendEmail({
      Source: "cedomir.spalevic@gmail.com",
      Destination: { ToAddresses: [email] },
      Message: {
         Subject: {
            Data: "Budgeter - confirm your email",
            Charset: "utf-8"
         },
         Body: {
            Html: {
               Data: newAccountConfirmationTemplate(code),
               Charset: "utf-8"
            },
         }
      }
   }).promise();
}