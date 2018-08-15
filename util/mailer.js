/* eslint no-console: 0 */ // PREVENT ESLINT FROM YELLING ABOUT SERVER CONSOLE MESSAGES
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const sgMail = require("@sendgrid/mail");

const Mailer = {};

// EMAIL TESTING WITH ETHEREAL
Mailer.sendTestEmail = (emailAddress, token) => {
  nodemailer.createTestAccount((err, account) => {
    if (err) {
      console.error(`Failed to create a testing account. ${err.message}`);
      return process.exit(1);
    }

    console.log("Credentials obtained, sending message...");

    // Create a SMTP transporter object
    const transporter = nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: {
        user: account.user,
        pass: account.pass
      }
    });

    // Message object
    const message = {
      from: "Sender Name <sender@example.com>",
      to: `Recipient ${emailAddress}`,
      subject: "Nodemailer is unicode friendly ✔",
      text: "Hello to myself!",
      html: `<a href="http://localhost:5000/api/user/verify/${token}/${emailAddress}">Verify</a>`
    };

    return transporter.sendMail(message, (sendErr, info) => {
      if (sendErr) {
        console.log(`Error occurred. ${sendErr.message}`);
        return process.exit(1);
      }

      console.log("Message sent: %s", info.messageId);
      // Preview only available when sending through an Ethereal account
      return console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    });
  });
};

// using SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs

Mailer.sendEmail = (type, emailAddress, host) => {
  console.log(host);
  // SET SENDGRID API KEY
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  let message;
  let verificationToken;
  switch (type) {
    case "verify":
      verificationToken = jwt.sign({ emailAddress }, process.env.JWTsecret, {});
      message = {
        to: emailAddress,
        from: "test@example.com",
        subject: "Welcome! Please verify your email address.",
        html: `
          <div>
            <p>Please use this link to verify your email address.</p>
            <a href="${
              process.env.NODE_ENV === "production" ? "https" : "http"
            }://${host}/api/user/verify/${verificationToken}/${emailAddress}">Verify</a>
          </div>
        `
      };
      sgMail.send(message);
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
      sgMail.send(message);
      break;
    default:
      break;
  }
};

module.exports = Mailer;
