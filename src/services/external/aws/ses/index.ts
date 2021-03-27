import AWS from "aws-sdk";
import { PromiseResult } from "aws-sdk/lib/request";

const ses = new AWS.SES();

export const sendEmail = async (
   email: string,
   subject: string,
   html: string
): Promise<PromiseResult<AWS.SES.SendEmailResponse, AWS.AWSError>> => {
   return ses
      .sendEmail({
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
               }
            }
         }
      })
      .promise();
};
