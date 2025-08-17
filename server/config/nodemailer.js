import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp-relay.brevo.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verify transporter configuration (non-blocking)
transporter.verify(function(error, success) {
  if (error) {
    console.warn('SMTP Configuration Warning: Email functionality may not work properly. Error:', error.message);
    console.warn('This is not critical for basic app functionality. Please check your SMTP credentials in .env file.');
  } else {
    console.log('SMTP Server is ready to send emails');
  }
});

export default transporter;
// This transporter will be used to send emails using the SMTP credentials provided in the environment variables.
