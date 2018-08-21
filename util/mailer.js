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
  // CHECK FOR MESSAGE TYPE, COMPELTE THE MESSAGE OBJECT, SEND MESSAGE
  switch (type) {
    case "verify":
      message = {
        to: emailAddress,
        from: "test@example.com",
        subject: "Welcome! Please verify your email address.",
        html: `
          <div>
            <p>Please use this link to verify your email address.</p>
            <a href="${
              process.env.NODE_ENV === "production" ? "https" : "http"
            }://${host}/login/${token}/${emailAddress}">Verify</a>
          </div>
        `
      };
      break;
    case "verified":
      message = {
        to: emailAddress,
        from: "test@example.com",
        subject: "Thank you for verifying your email address!",
        html: `
          <div>
            <p>Welcome to the site!</p>
          </div>
        `
      };
      break;
    case "reset":
      message = {
        to: emailAddress,
        from: "test@example.com",
        subject: "Password reset request",
        html: `
          <div>
          <p>Please use this link to change your account password.</p>
          <a href="${
            process.env.NODE_ENV === "production" ? "https" : "http"
          }://${host}/reset/${token}/${emailAddress}">Reset Password</a>
          </div>
        `
      };
      break;
    case "resetSuccess":
      message = {
        to: emailAddress,
        from: "test@example.com",
        subject: "Account password reset",
        html: `
          <div>
            <p>Your account password has been changed.</p>
          </div>
        `
      };
      break;
    default:
      break;
  }
  if (process.env.NODE_ENV !== "production") {
    console.log(message);
  } else {
    sgMail.send(message);
  }
};

module.exports = Mailer;
