// SMTP Email Adapter
// Supports Gmail, SendGrid, and custom SMTP providers
// Isolates nodemailer from business logic

import nodemailer from 'nodemailer';

/**
 * SMTP Email Adapter
 * Centralized email sending operations
 */
export const SMTPAdapter = {
  transporter: null,

  /**
   * Initialize SMTP transporter
   * @param {string} provider - Email provider (gmail, sendgrid, custom)
   */
  initialize(provider = 'gmail') {
    if (this.transporter) {
      return; // Already initialized
    }

    switch (provider) {
     case 'gmail':
     this.transporter = nodemailer.createTransport({
     host: 'smtp.gmail.com',
     port: 587,
     secure: false,          // use TLS, but not SSL
     requireTLS: true,
     auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
    connectionTimeout: 10000, // 10s
    socketTimeout: 10000,     // 10s
  });
     break;

      case 'sendgrid':
        this.transporter = nodemailer.createTransport({
          host: 'smtp.sendgrid.net',
          port: 587,
          secure: false,
          auth: {
            user: 'apikey',
            pass: process.env.SENDGRID_API_KEY,
          },
        });
        break;

      case 'custom':
      default:
        this.transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });
        break;
    }
  },

  /**
   * Send email
   * @param {Object} mailOptions - Email options
   * @param {string} mailOptions.to - Recipient email
   * @param {string} mailOptions.subject - Email subject
   * @param {string} mailOptions.text - Plain text body
   * @param {string} mailOptions.html - HTML body
   * @param {string} mailOptions.from - Sender email (optional)
   * @param {Array} mailOptions.attachments - Attachments (optional)
   * @returns {Promise<Object>} Send result
   */
  async sendEmail(mailOptions) {
    if (!this.transporter) {
      this.initialize();
    }

    const defaultFrom = process.env.EMAIL_FROM || 'noreply@tunisiaed.com';

    const options = {
      from: mailOptions.from || defaultFrom,
      to: mailOptions.to,
      subject: mailOptions.subject,
      text: mailOptions.text,
      html: mailOptions.html,
      attachments: mailOptions.attachments || [],
    };

    try {
      const info = await this.transporter.sendMail(options);
      return {
        success: true,
        messageId: info.messageId,
        response: info.response,
      };
    } catch (error) {
      console.error('Email send error:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  },

  /**
   * Send welcome email
   * @param {string} to - Recipient email
   * @param {string} name - Recipient name
   * @returns {Promise<Object>}
   */
  async sendWelcomeEmail(to, name) {
    return await this.sendEmail({
      to,
      subject: 'Welcome to TunisiaED!',
      html: `
        <h1>Welcome to TunisiaED, ${name}!</h1>
        <p>Thank you for joining our learning platform.</p>
        <p>Start exploring courses and begin your learning journey today.</p>
      `,
      text: `Welcome to TunisiaED, ${name}! Thank you for joining our learning platform.`,
    });
  },

  /**
   * Send course enrollment confirmation
   * @param {string} to - Recipient email
   * @param {string} courseName - Course name
   * @param {string} instructorName - Instructor name
   * @returns {Promise<Object>}
   */
  async sendEnrollmentConfirmation(to, courseName, instructorName) {
    return await this.sendEmail({
      to,
      subject: `Enrollment Confirmed: ${courseName}`,
      html: `
        <h1>Enrollment Confirmed!</h1>
        <p>You have successfully enrolled in <strong>${courseName}</strong>.</p>
        <p>Instructor: ${instructorName}</p>
        <p>Start learning now!</p>
      `,
      text: `Enrollment confirmed for ${courseName} by ${instructorName}.`,
    });
  },

  /**
   * Send certificate email
   * @param {string} to - Recipient email
   * @param {string} courseName - Course name
   * @param {string} certificateUrl - Certificate URL
   * @returns {Promise<Object>}
   */
  async sendCertificateEmail(to, courseName, certificateUrl) {
    return await this.sendEmail({
      to,
      subject: `Certificate Earned: ${courseName}`,
      html: `
        <h1>Congratulations!</h1>
        <p>You have earned a certificate for completing <strong>${courseName}</strong>.</p>
        <p><a href="${certificateUrl}">Download your certificate</a></p>
      `,
      text: `Congratulations! You earned a certificate for ${courseName}. Download: ${certificateUrl}`,
    });
  },

  /**
   * Send payment confirmation
   * @param {string} to - Recipient email
   * @param {number} amount - Payment amount
   * @param {string} courseName - Course name
   * @param {string} transactionId - Transaction ID
   * @returns {Promise<Object>}
   */
  async sendPaymentConfirmation(to, amount, courseName, transactionId) {
    return await this.sendEmail({
      to,
      subject: 'Payment Confirmation',
      html: `
        <h1>Payment Received</h1>
        <p>Your payment of <strong>${amount} TND</strong> for <strong>${courseName}</strong> has been confirmed.</p>
        <p>Transaction ID: ${transactionId}</p>
      `,
      text: `Payment of ${amount} TND confirmed for ${courseName}. Transaction: ${transactionId}`,
    });
  },

  /**
   * Send password reset email
   * @param {string} to - Recipient email
   * @param {string} resetLink - Password reset link
   * @returns {Promise<Object>}
   */
  async sendPasswordResetEmail(to, resetLink) {
    return await this.sendEmail({
      to,
      subject: 'Password Reset Request',
      html: `
        <h1>Password Reset</h1>
        <p>Click the link below to reset your password:</p>
        <p><a href="${resetLink}">Reset Password</a></p>
        <p>This link will expire in 1 hour.</p>
      `,
      text: `Reset your password: ${resetLink}`,
    });
  },

  /**
   * Verify transporter connection
   * @returns {Promise<boolean>}
   */
  async verifyConnection() {
    if (!this.transporter) {
      this.initialize();
    }

    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('SMTP connection error:', error);
      return false;
    }
  },
};

export default SMTPAdapter;
