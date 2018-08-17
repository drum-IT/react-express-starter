/* eslint no-console: 0 */ // PREVENT ESLINT FROM YELLING ABOUT SERVER CONSOLE MESSAGES
// const jwt = require("jsonwebtoken");
// const nodemailer = require("nodemailer");
const sgMail = require("@sendgrid/mail");

const Mailer = {};

Mailer.sendEmail = (type, emailAddress, host, token) => {
  // SET SENDGRID API KEY
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  let message;
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
    case "reset":
      message = {
        to: emailAddress,
        from: "test@example.com",
        subject: "Password reset request",
        html: `
          <div>
          <p>Please use this link to reset your password.</p>
          <a href="${
            process.env.NODE_ENV === "production" ? "https" : "http"
          }://${host}/reset/${token}/${emailAddress}">Reset Password</a>
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
