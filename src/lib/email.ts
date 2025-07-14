
'use server';

import { Resend } from 'resend';
import type React from 'react';

interface EmailOptions {
  to: string;
  subject: string;
  react: React.ReactElement;
}

/**
 * Sends an email using the Resend service.
 * @param options - The email options including recipient, subject, and the React component to render as the body.
 * @returns An object indicating success or failure.
 */
export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; message: string }> {
  const { to, subject, react } = options;

  const resendApiKey = process.env.RESEND_API_KEY;
  const emailFrom = process.env.EMAIL_FROM;

  if (!resendApiKey || !emailFrom) {
    const errorMessage = "Email service is not configured on the server. Please check RESEND_API_KEY and EMAIL_FROM in your environment variables.";
    console.error(`[sendEmail] Aborted: ${errorMessage}`);
    return { success: false, message: errorMessage };
  }
  
  // Initialize Resend inside the function for reliability
  const resend = new Resend(resendApiKey);

  try {
    console.log(`[sendEmail] Attempting to send email to: ${to} with subject: "${subject}" from ${emailFrom}`);
    
    const { data, error } = await resend.emails.send({
      from: emailFrom,
      to,
      subject,
      react,
    });

    if (error) {
      console.error("[sendEmail] Resend API returned an error:", error);
      return { success: false, message: error.message };
    }

    console.log(`[sendEmail] Email sent successfully. Message ID: ${data?.id}`);
    return { success: true, message: "Email sent successfully." };
  } catch (error: any) {
    console.error("[sendEmail] An unexpected error occurred:", error);
    return { success: false, message: 'An unexpected error occurred while sending the email.' };
  }
}
