import sendgridMail from "@sendgrid/mail";

export const getClient = () => {
   sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);
   return sendgridMail;
};