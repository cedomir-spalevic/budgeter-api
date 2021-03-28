export const getNewAccountConfirmationView = (code: string): string => `
<html>

   <body>
      <div style="display: flex;flex-direction: row;align-items: center;">
         <img src="https://budgeter-api.s3.amazonaws.com/app-icon.png" width="25"
            style="border-radius: 5px;margin-right: 5px;" />
         <h3>Thank you for signing up for Budgeter!</h1>
      </div>
      <p>Enter the following confirmation code in the app:</p>
      <p>${code}</p>
   </body>

</html>`;
