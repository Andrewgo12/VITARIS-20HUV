const nodemailer = require('nodemailer');
const logger = require('./logger');

// Create transporter
const createTransporter = () => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    logger.warn('Email configuration not found. Email functionality disabled.');
    return null;
  }

  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const transporter = createTransporter();

const sendEmail = async (options) => {
  if (!transporter) {
    logger.warn('Email transporter not configured. Skipping email send.');
    return { success: false, message: 'Email not configured' };
  }

  try {
    const mailOptions = {
      from: `"VITARIS Hospital System" <${process.env.SMTP_USER}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
    
    logger.info(`Email sent successfully to ${options.to}`, {
      messageId: info.messageId,
      to: options.to,
      subject: options.subject
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error('Email send failed:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendEmail };
