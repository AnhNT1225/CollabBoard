require("dotenv").config();
const nodemailer = require("nodemailer");

// Import Node mailer configuration
const { mailerConfig } = require("./config/mailerconfig");

// Create the transporter with service configuration
const transporter = nodemailer.createTransport(mailerConfig);

/**
 * @description function sendMail() to notify the coordinator if new submission is posted
 * @params
 *      - coordinatorEmail: String
 *      - studentEmail: String
 *      - eventInfo: Object
 *      - facultyInfo: Object
 * @return
 *
 * @notes
 */
const sendResetPasswordMail = (userEmail, resetLink) => {
  const details = {
    from: process.env.THE_HOST_EMAIL, // The mail used to send the OTP code
    to: userEmail, // The coordinator email
    subject: 'Reponse for resetPassword',
    html: `This link is used for reset password ${resetLink}.`, // Content of the mail
  };
  // Send mail
  transporter.sendMail(details, function (error, data) {
    if (error) console.log(error);
  });
};

module.exports ={sendMail: sendMail}
