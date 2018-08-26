/* eslint no-console: 0 */ // PREVENT ESLINT FROM YELLING ABOUT SERVER CONSOLE MESSAGES

const nodemailer = require("nodemailer");
const sgMail = require("@sendgrid/mail");

const Mailer = {};

Mailer.sendTestEmail = () => {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  nodemailer.createTestAccount((err, account) => {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: account.user, // generated ethereal user
        pass: account.pass // generated ethereal password
      }
    });

    // setup email data with unicode symbols
    const mailOptions = {
      from: '"Fred Foo 👻" <foo@example.com>', // sender address
      to: "bar@example.com, baz@example.com", // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: "<b>Hello world?</b>" // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("Message sent: %s", info.messageId);
      // Preview only available when sending through an Ethereal account
      return console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
  });
};

Mailer.sendEmail = (type, emailAddress, host, token) => {
  // SET SENDGRID API KEY
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  // INITIALIZE MESSAGE OBJECT
  let message;
  let link;
  // MESSAGE STYLE SETTINGS
  const messageStyle = {
    pFontSize: "1.2rem",
    subFontSize: "1rem"
  };
  // CHECK FOR MESSAGE TYPE, COMPELTE THE MESSAGE OBJECT, SEND MESSAGE
  switch (type) {
    case "verify":
      message = {
        to: emailAddress,
        from: "test@example.com",
        subject: "Account Verification",
        html: `
          <div class="email__container" style="color: rgba(0, 0, 0, 0.5);font-family: sans-serif;font-weight: 300;margin: 0 auto;max-width: 500px;padding: 0;width: 100%;text-align: center;">
            <h1 style="color: rgba(0, 0, 0, 0.5);font-family: sans-serif;font-weight: 300;margin: 50px 0 25px 0;">Verify your email address</h1>
            <div class="line" style="color: rgba(0, 0, 0, 0.5);font-family: sans-serif;font-weight: 300;background: rgba(0, 0, 0, .15);height: 1px;margin: 50px 0;width: 100%;"></div>
            <p style="color: rgba(0, 0, 0, 0.5);font-family: sans-serif;font-size: ${
              messageStyle.pFontSize
            };font-weight: 300;margin: 0 0 30px 0;"> Before you can sign into your account, you must verify your email address.</p>
            <a href="${
              process.env.NODE_ENV === "production" ? "https" : "http"
            }://${host}/login/${token}/${emailAddress}" style="color: rgba(0, 0, 0, 0.5);font-family: sans-serif;font-size: ${
          messageStyle.pFontSize
        };font-weight: 300;background: rgba(0, 0, 0, 0.2);border-radius: 5px;padding: 10px;text-decoration: none;">Verify
    Email Address</a>
            <div class="line" style="color: rgba(0, 0, 0, 0.5);font-family: sans-serif;font-weight: 300;background: rgba(0, 0, 0, .15);height: 1px;margin: 50px 0;width: 100%;"></div>
            <p class="sub" style="color: rgba(0, 0, 0, 0.3);font-family: sans-serif;font-size: ${
              messageStyle.subFontSize
            };font-weight: 300;margin: 0 0 30px 0;font-style: italic;">If you did not sign up for an account you can ignore this email.</p>
          </div>
        `
      };
      link = `${
        process.env.NODE_ENV === "production" ? "https" : "http"
      }://${host}/login/${token}/${emailAddress}`;
      break;
    case "verified":
      message = {
        to: emailAddress,
        from: "test@example.com",
        subject: "Account Verified",
        html: `
          <div class="email__container" style="color: rgba(0, 0, 0, 0.5);font-family: sans-serif;font-weight: 300;margin: 0 auto;max-width: 500px;padding: 0;width: 100%;text-align: center;">
            <h1 style="color: rgba(0, 0, 0, 0.5);font-family: sans-serif;font-weight: 300;margin: 50px 0 25px 0;">Thank you!</h1>
            <div class="line" style="color: rgba(0, 0, 0, 0.5);font-family: sans-serif;font-weight: 300;background: rgba(0, 0, 0, .15);height: 1px;margin: 50px 0;width: 100%;"></div>
            <p style="color: rgba(0, 0, 0, 0.5);font-family: sans-serif;font-size: ${
              messageStyle.pFontSize
            };font-weight: 300;margin: 0 0 30px 0;">Your account is now verified!</p>
            <a href="${
              process.env.NODE_ENV === "production" ? "https" : "http"
            }://${host}/login" style="color: rgba(0, 0, 0, 0.5);font-family: sans-serif;font-size: ${
          messageStyle.pFontSize
        };font-weight: 300;background: rgba(0, 0, 0, 0.2);border-radius: 5px;padding: 10px;text-decoration: none;">Sign In</a>
            <div class="line" style="color: rgba(0, 0, 0, 0.5);font-family: sans-serif;font-weight: 300;background: rgba(0, 0, 0, .15);height: 1px;margin: 50px 0;width: 100%;"></div>
          </div>
        `
      };
      link = `${
        process.env.NODE_ENV === "production" ? "https" : "http"
      }://${host}/login}`;
      break;
    case "reset":
      message = {
        to: emailAddress,
        from: "test@example.com",
        subject: "Password Reset Request",
        html: `
          <div class="email__container" style="color: rgba(0, 0, 0, 0.5);font-family: sans-serif;font-weight: 300;margin: 0 auto;max-width: 500px;padding: 0;width: 100%;text-align: center;">
            <h1 style="color: rgba(0, 0, 0, 0.5);font-family: sans-serif;font-weight: 300;margin: 50px 0 25px 0;">Password Reset</h1>
            <div class="line" style="color: rgba(0, 0, 0, 0.5);font-family: sans-serif;font-weight: 300;background: rgba(0, 0, 0, .15);height: 1px;margin: 50px 0;width: 100%;"></div>
            <p style="color: rgba(0, 0, 0, 0.5);font-family: sans-serif;font-size: ${
              messageStyle.pFontSize
            };font-weight: 300;margin: 0 0 30px 0;">A password reset has been requested for your account.</p>
            <a href="${
              process.env.NODE_ENV === "production" ? "https" : "http"
            }://${host}/reset/${token}/${emailAddress}" style="color: rgba(0, 0, 0, 0.5);font-family: sans-serif;font-size: ${
          messageStyle.pFontSize
        };font-weight: 300;background: rgba(0, 0, 0, 0.2);border-radius: 5px;padding: 10px;text-decoration: none;">Reset Password</a>
            <div class="line" style="color: rgba(0, 0, 0, 0.5);font-family: sans-serif;font-weight: 300;background: rgba(0, 0, 0, .15);height: 1px;margin: 50px 0;width: 100%;"></div>
            <p class="sub" style="color: rgba(0, 0, 0, 0.3);font-family: sans-serif;font-size: ${
              messageStyle.subFontSize
            };font-weight: 300;margin: 0 0 30px 0;font-style: italic;">If you did not request a password reset you can ignore this email.</p>
          </div>
        `
      };
      link = `${
        process.env.NODE_ENV === "production" ? "https" : "http"
      }://${host}/reset/${token}/${emailAddress}`;
      break;
    case "resetSuccess":
      message = {
        to: emailAddress,
        from: "test@example.com",
        subject: "Account Password Changed",
        html: `
          <div class="email__container" style="color: rgba(0, 0, 0, 0.5);font-family: sans-serif;font-weight: 300;margin: 0 auto;max-width: 500px;padding: 0;width: 100%;text-align: center;">
            <h1 style="color: rgba(0, 0, 0, 0.5);font-family: sans-serif;font-weight: 300;margin: 50px 0 25px 0;">Password Reset</h1>
            <div class="line" style="color: rgba(0, 0, 0, 0.5);font-family: sans-serif;font-weight: 300;background: rgba(0, 0, 0, .15);height: 1px;margin: 50px 0;width: 100%;"></div>
            <p style="color: rgba(0, 0, 0, 0.5);font-family: sans-serif;font-size: ${
              messageStyle.pFontSize
            };font-weight: 300;margin: 0 0 30px 0;">Your account password has been changed.</p>
            <div class="line" style="color: rgba(0, 0, 0, 0.5);font-family: sans-serif;font-weight: 300;background: rgba(0, 0, 0, .15);height: 1px;margin: 50px 0;width: 100%;"></div>
          </div>
        `
      };
      break;
    case "deleteSuccess":
      message = {
        to: emailAddress,
        from: "test@example.com",
        subject: "Account Deleted",
        html: `
          <div class="email__container" style="color: rgba(0, 0, 0, 0.5);font-family: sans-serif;font-weight: 300;margin: 0 auto;max-width: 500px;padding: 0;width: 100%;text-align: center;">
            <h1 style="color: rgba(0, 0, 0, 0.5);font-family: sans-serif;font-weight: 300;margin: 50px 0 25px 0;">Account Deleted</h1>
            <div class="line" style="color: rgba(0, 0, 0, 0.5);font-family: sans-serif;font-weight: 300;background: rgba(0, 0, 0, .15);height: 1px;margin: 50px 0;width: 100%;"></div>
            <p style="color: rgba(0, 0, 0, 0.5);font-family: sans-serif;font-size: ${
              messageStyle.pFontSize
            };font-weight: 300;margin: 0 0 30px 0;">The account associated with this email address has been deleted.</p>
            <div class="line" style="color: rgba(0, 0, 0, 0.5);font-family: sans-serif;font-weight: 300;background: rgba(0, 0, 0, .15);height: 1px;margin: 50px 0;width: 100%;"></div>
          </div>
        `
      };
      break;
    default:
      break;
  }
  // if (process.env.NODE_ENV !== "production") {
  // console.log(message);
  // console.log(link);
  // } else {
  sgMail.send(message);
  // }
};

module.exports = Mailer;
