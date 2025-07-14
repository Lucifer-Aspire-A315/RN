
import React from 'react';

interface ResetPasswordEmailProps {
  name: string;
  resetLink: string;
}

export const ResetPasswordEmail: React.FC<ResetPasswordEmailProps> = ({ name, resetLink }) => (
  <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: 1.6, color: '#333' }}>
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', border: '1px solid #ddd', borderRadius: '10px', backgroundColor: '#f9f9f9' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ color: '#4E944F', margin: '0' }}>RN FinTech</h1>
      </div>
      <h2 style={{ color: '#4E944F', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Password Reset Request</h2>
      <p>Hello {name},</p>
      <p>We received a request to reset your password for your RN FinTech account. Please click the button below to set a new password:</p>
      <div style={{ textAlign: 'center', margin: '30px 0' }}>
        <a href={resetLink} style={{ backgroundColor: '#4E944F', color: '#ffffff', padding: '12px 25px', textDecoration: 'none', borderRadius: '5px', fontWeight: 'bold' }}>
          Reset Your Password
        </a>
      </div>
      <p>This link is valid for one hour. If you did not request a password reset, you can safely ignore this email.</p>
      <p>Thank you,<br/>The RN FinTech Team</p>
      <hr style={{ border: 'none', borderTop: '1px solid #eee', marginTop: '20px' }} />
      <p style={{ fontSize: '12px', color: '#999' }}>
        If you're having trouble clicking the button, copy and paste the following URL into your web browser:<br/>
        <a href={resetLink} style={{ color: '#4E944F', wordBreak: 'break-all' }}>{resetLink}</a>
      </p>
    </div>
  </div>
);
