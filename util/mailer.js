/* eslint no-console: 0 */ // PREVENT ESLINT FROM YELLING ABOUT SERVER CONSOLE MESSAGES
const nodemailer = require("nodemailer");

const Mailer = {};

Mailer.sendTestRegistrationEmail = (emailAddress, token) => {
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

module.exports = Mailer;
