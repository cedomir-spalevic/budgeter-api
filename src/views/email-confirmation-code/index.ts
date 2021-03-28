export const getEmailConfirmationCodeView = (code: string): string => `
<html>

   <body>
      <div style="display: flex;flex-direction: row;align-items: center;">
         <img src="https://budgeter-api.s3.amazonaws.com/app-icon.png" width="25"
            style="border-radius: 5px;margin-right: 5px;" />
         <h3>Budgeter Confirmation Code</h1>
      </div>
      <p>Here is the confirmation code you requested. If you did not request a code, please ignore.</p>
      <p>${code}</p>
   </body>

</html>`;
