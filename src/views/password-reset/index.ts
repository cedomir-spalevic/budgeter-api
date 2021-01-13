export const passwordResetTemplate = (code: string) => `
<html>

   <body>
      <div style="display: flex;flex-direction: row;align-items: center;">
         <img src="https://budgeter-api.s3.amazonaws.com/app-icon.png" width="25"
            style="border-radius: 5px;margin-right: 5px;" />
         <h3>Budgeter Password Reset</h1>
      </div>
      <p>Please verify your email by typing the following code in the app</p>
      <p>${code}</p>
   </body>

</html>`