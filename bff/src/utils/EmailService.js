// EmailService - Handles sending transactional emails
// Uses SMTPAdapter for email operations (centralized email adapter)

import { SMTPAdapter } from '../adapters/smtpAdapter.js';

/**
 * EmailService - High-level service for transactional emails
 * Delegates email sending to SMTPAdapter for consistency
 */
class EmailService {
  constructor() {
    // Initialize SMTP adapter
    SMTPAdapter.initialize(process.env.EMAIL_PROVIDER || 'gmail');
  }

  /**
   * Send an email using SMTP adapter
   * @param {Object} options - Email options
   * @param {string} options.to - Recipient email
   * @param {string} options.subject - Email subject
   * @param {string} options.html - HTML content
   * @param {string} options.text - Plain text content (optional)
   */
  async sendEmail({ to, subject, html, text }) {
    try {
      const result = await SMTPAdapter.sendEmail({
        to,
        subject,
        html,
        text: text || this.htmlToText(html),
      });

      console.log(`📧 Email sent to ${to}: ${subject}`);
      return result;
    } catch (error) {
      console.error(`❌ Failed to send email to ${to}:`, error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Convert HTML to plain text (basic)
   */
  htmlToText(html) {
    return html
      .replace(/<style[^>]*>.*<\/style>/gi, '')
      .replace(/<script[^>]*>.*<\/script>/gi, '')
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // ====================================================================
  // PAYMENT EMAIL TEMPLATES
  // ====================================================================

  /**
   * Send payment success email
   * @param {Object} data - Payment data
   * @param {string} data.email - Customer email
   * @param {string} data.firstName - Customer first name
   * @param {string} data.lastName - Customer last name
   * @param {string} data.courseTitle - Course title
   * @param {number} data.amount - Payment amount
   * @param {string} data.transactionId - Transaction ID
   * @param {string} data.paymentMethod - Payment method used
   */
  async sendPaymentSuccessEmail(data) {
    const { email, firstName, lastName, courseTitle, amount, transactionId, paymentMethod } = data;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Successful</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <tr>
      <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px;">TunisiaED</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">Your Learning Journey</p>
      </td>
    </tr>
    
    <!-- Success Icon -->
    <tr>
      <td style="padding: 40px 30px 20px; text-align: center;">
        <div style="width: 80px; height: 80px; background-color: #10b981; border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
          <span style="color: white; font-size: 40px;">✓</span>
        </div>
        <h2 style="color: #10b981; margin: 20px 0 10px; font-size: 24px;">Payment Successful!</h2>
      </td>
    </tr>
    
    <!-- Greeting -->
    <tr>
      <td style="padding: 0 30px 20px;">
        <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0;">
          Hello <strong>${firstName} ${lastName}</strong>,
        </p>
        <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 15px 0 0 0;">
          Thank you for your purchase! Your payment has been processed successfully.
        </p>
      </td>
    </tr>
    
    <!-- Order Details -->
    <tr>
      <td style="padding: 0 30px 30px;">
        <div style="background-color: #f8f9fa; border-radius: 12px; padding: 25px; border: 1px solid #e9ecef;">
          <h3 style="color: #333; margin: 0 0 20px; font-size: 18px; border-bottom: 2px solid #667eea; padding-bottom: 10px;">
            Order Details
          </h3>
          
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding: 8px 0; color: #666; font-size: 14px;">Course:</td>
              <td style="padding: 8px 0; color: #333; font-size: 14px; text-align: right; font-weight: 600;">
                ${courseTitle}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666; font-size: 14px;">Amount Paid:</td>
              <td style="padding: 8px 0; color: #10b981; font-size: 18px; text-align: right; font-weight: 700;">
                ${amount} TND
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666; font-size: 14px;">Transaction ID:</td>
              <td style="padding: 8px 0; color: #333; font-size: 14px; text-align: right; font-family: monospace;">
                ${transactionId}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666; font-size: 14px;">Payment Method:</td>
              <td style="padding: 8px 0; color: #333; font-size: 14px; text-align: right; text-transform: capitalize;">
                ${paymentMethod}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666; font-size: 14px;">Date:</td>
              <td style="padding: 8px 0; color: #333; font-size: 14px; text-align: right;">
                ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </td>
            </tr>
          </table>
        </div>
      </td>
    </tr>
    
    <!-- CTA Button -->
    <tr>
      <td style="padding: 0 30px 30px; text-align: center;">
        <a href="${process.env.FRONTEND_URL || 'https://tunisiaed.netlify.app'}/dashboard" 
           style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: 600; font-size: 16px;">
          Start Learning Now
        </a>
      </td>
    </tr>
    
    <!-- Footer -->
    <tr>
      <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
        <p style="color: #666; font-size: 14px; margin: 0 0 10px;">
          If you have any questions, please contact us at
          <a href="mailto:support@tunisiaed.com" style="color: #667eea;">support@tunisiaed.com</a>
        </p>
        <p style="color: #999; font-size: 12px; margin: 0;">
          © ${new Date().getFullYear()} TunisiaED. All rights reserved.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    return this.sendEmail({
      to: email,
      subject: `✓ Payment Successful - ${courseTitle}`,
      html,
    });
  }

  /**
   * Send payment failed email
   * @param {Object} data - Payment data
   * @param {string} data.email - Customer email
   * @param {string} data.firstName - Customer first name
   * @param {string} data.lastName - Customer last name
   * @param {string} data.courseTitle - Course title
   * @param {number} data.amount - Payment amount
   * @param {string} data.reason - Failure reason (optional)
   */
  async sendPaymentFailedEmail(data) {
    const { email, firstName, lastName, courseTitle, amount, reason } = data;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Failed</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <tr>
      <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px;">TunisiaED</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">Your Learning Journey</p>
      </td>
    </tr>
    
    <!-- Failed Icon -->
    <tr>
      <td style="padding: 40px 30px 20px; text-align: center;">
        <div style="width: 80px; height: 80px; background-color: #ef4444; border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
          <span style="color: white; font-size: 40px;">✕</span>
        </div>
        <h2 style="color: #ef4444; margin: 20px 0 10px; font-size: 24px;">Payment Failed</h2>
      </td>
    </tr>
    
    <!-- Message -->
    <tr>
      <td style="padding: 0 30px 20px;">
        <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0;">
          Hello <strong>${firstName} ${lastName}</strong>,
        </p>
        <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 15px 0 0 0;">
          Unfortunately, we were unable to process your payment for the following course:
        </p>
      </td>
    </tr>
    
    <!-- Order Details -->
    <tr>
      <td style="padding: 0 30px 30px;">
        <div style="background-color: #fef2f2; border-radius: 12px; padding: 25px; border: 1px solid #fecaca;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding: 8px 0; color: #666; font-size: 14px;">Course:</td>
              <td style="padding: 8px 0; color: #333; font-size: 14px; text-align: right; font-weight: 600;">
                ${courseTitle}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666; font-size: 14px;">Amount:</td>
              <td style="padding: 8px 0; color: #333; font-size: 16px; text-align: right; font-weight: 600;">
                ${amount} TND
              </td>
            </tr>
            ${reason ? `
            <tr>
              <td style="padding: 8px 0; color: #666; font-size: 14px;">Reason:</td>
              <td style="padding: 8px 0; color: #ef4444; font-size: 14px; text-align: right;">
                ${reason}
              </td>
            </tr>
            ` : ''}
          </table>
        </div>
      </td>
    </tr>
    
    <!-- What to do next -->
    <tr>
      <td style="padding: 0 30px 20px;">
        <h3 style="color: #333; font-size: 16px; margin: 0 0 15px;">What you can do:</h3>
        <ul style="color: #666; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
          <li>Check your payment details and try again</li>
          <li>Ensure you have sufficient funds</li>
          <li>Try a different payment method</li>
          <li>Contact your bank if the issue persists</li>
        </ul>
      </td>
    </tr>
    
    <!-- CTA Button -->
    <tr>
      <td style="padding: 0 30px 30px; text-align: center;">
        <a href="${process.env.FRONTEND_URL || 'https://tunisiaed.netlify.app'}/courses" 
           style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: 600; font-size: 16px;">
          Try Again
        </a>
      </td>
    </tr>
    
    <!-- Footer -->
    <tr>
      <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
        <p style="color: #666; font-size: 14px; margin: 0 0 10px;">
          Need help? Contact us at
          <a href="mailto:support@tunisiaed.com" style="color: #667eea;">support@tunisiaed.com</a>
        </p>
        <p style="color: #999; font-size: 12px; margin: 0;">
          © ${new Date().getFullYear()} TunisiaED. All rights reserved.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    return this.sendEmail({
      to: email,
      subject: `Payment Failed - ${courseTitle}`,
      html,
    });
  }

  /**
   * Send enrollment confirmation email
   * @param {Object} data - Enrollment data
   */
  async sendEnrollmentConfirmationEmail(data) {
    const { email, firstName, courseTitle, instructorName } = data;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Enrollment Confirmed</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <tr>
      <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🎓 TunisiaED</h1>
      </td>
    </tr>
    
    <!-- Content -->
    <tr>
      <td style="padding: 40px 30px;">
        <h2 style="color: #333; margin: 0 0 20px; font-size: 22px;">Welcome to your new course!</h2>
        <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
          Hello <strong>${firstName}</strong>,
        </p>
        <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
          You are now enrolled in <strong>"${courseTitle}"</strong>${instructorName ? ` by ${instructorName}` : ''}.
        </p>
        <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0;">
          Start learning today and take the first step towards mastering new skills!
        </p>
      </td>
    </tr>
    
    <!-- CTA -->
    <tr>
      <td style="padding: 0 30px 40px; text-align: center;">
        <a href="${process.env.FRONTEND_URL || 'https://tunisiaed.netlify.app'}/dashboard" 
           style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: 600; font-size: 16px;">
          Go to Dashboard
        </a>
      </td>
    </tr>
    
    <!-- Footer -->
    <tr>
      <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
        <p style="color: #999; font-size: 12px; margin: 0;">
          © ${new Date().getFullYear()} TunisiaED. All rights reserved.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    return this.sendEmail({
      to: email,
      subject: `🎓 You're enrolled in: ${courseTitle}`,
      html,
    });
  }
}

// Export singleton instance
const emailService = new EmailService();
export default emailService;
