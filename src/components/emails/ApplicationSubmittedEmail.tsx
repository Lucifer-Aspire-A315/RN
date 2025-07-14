
import React from 'react';

interface ApplicationSubmittedEmailProps {
  name: string;
  applicationType: string;
  applicationId: string;
}

export const ApplicationSubmittedEmail: React.FC<ApplicationSubmittedEmailProps> = ({ name, applicationType, applicationId }) => (
  <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: 1.6, color: '#333' }}>
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', border: '1px solid #ddd', borderRadius: '10px', backgroundColor: '#f9f9f9' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ color: '#4E944F', margin: '0' }}>RN FinTech</h1>
      </div>
      <h2 style={{ color: '#4E944F', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Application Received!</h2>
      <p>Hello {name},</p>
      <p>We have successfully received your application for a <strong>{applicationType}</strong>.</p>
      <p>Your Application ID is: <strong>{applicationId}</strong>. Please use this ID for any future correspondence.</p>
      <p>Our team will now begin the review process. You can track the status of your application at any time by logging into your dashboard.</p>
      <div style={{ textAlign: 'center', margin: '30px 0' }}>
        <a href={`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`} style={{ backgroundColor: '#4E944F', color: '#ffffff', padding: '12px 25px', textDecoration: 'none', borderRadius: '5px', fontWeight: 'bold' }}>
          Track Your Application
        </a>
      </div>
      <p>We will notify you as soon as there is an update.</p>
      <p>Thank you,<br/>The RN FinTech Team</p>
    </div>
  </div>
);
