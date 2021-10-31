const { sendEmail } = require("services/sendgrid");

module.exports.sendOneTimeCodeEmail = async (req, email, code) => {
   const subject = "Your Budgeter verification code";
   const html = `
      <html>
         <body>
            <div style="display: flex;flex-direction: row;align-items: center;">
               <img src="https://budgeter-api.s3.amazonaws.com/app-icon.png" width="25"
                  style="border-radius: 5px;margin-right: 5px;" />
            </div>
            <p>Your Budgeter verification code is:</p>
            <b>${code}</b>
         </body>
      </html>
   `;
   await sendEmail(req, email, subject, html);
};