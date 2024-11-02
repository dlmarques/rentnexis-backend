/**
 * Generates an HTML email template for verifying email address.
 * @param {string} link - The verification link for the email.
 * @returns {string} - HTML content for the email template.
 */
const generateVerificationEmail = (link) => {
  return `
    <!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
      <!--[if gte mso 9]>
      <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG/>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
      <![endif]-->
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="x-apple-disable-message-reformatting">
      <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
      <title></title>
      
    </head>
    
    <body style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: #e7e7e7; color: #000000;">
      <!--[if IE]><div class="ie-container"><![endif]-->
      <!--[if mso]><div class="mso-container"><![endif]-->
      <table style="border-collapse: collapse; table-layout: fixed; border-spacing: 0; mso-table-lspace: 0pt; mso-table-rspace: 0pt; vertical-align: top; min-width: 320px; Margin: 0 auto; background-color: #e7e7e7; width: 100%;" cellpadding="0" cellspacing="0">
        <tbody>
          <tr style="vertical-align: top">
            <td style="word-break: break-word; border-collapse: collapse !important; vertical-align: top">
              <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #e7e7e7;"><![endif]-->
              
              <div style="padding: 20px 10px;">
                <table style="font-family: Arial, sans-serif; background-color: #ffffff; border: 1px solid #dddddd; border-radius: 8px; overflow: hidden; width: 100%;" role="presentation" cellpadding="0" cellspacing="0" border="0">
                  <tbody>
                    <tr>
                      <td style="padding: 20px;">
                        <table style="font-family: Arial, sans-serif;" role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                          <tbody>
                            <tr>
                              <td style="text-align: center;">
                                <h1 style="font-size: 20px; color: #333333; margin: 0;">Welcome to RentNexis!</h1>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 20px 0; text-align: center;">
                                <a href="${link}" style="color: #007bff; text-decoration: underline;">Click here to verify your email</a>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
            </td>
          </tr>
        </tbody>
      </table>
    </body>
    </html>
  `;
};

module.exports = {
  generateVerificationEmail,
};
