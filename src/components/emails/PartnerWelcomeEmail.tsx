
import React from 'react';

interface PartnerWelcomeEmailProps {
  name: string;
}

export const PartnerWelcomeEmail: React.FC<PartnerWelcomeEmailProps> = ({ name }) => (
  <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: 1.6, color: '#333' }}>
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', border: '1px solid #ddd', borderRadius: '10px', backgroundColor: '#f9f9f9' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ color: '#4E944F', margin: '0' }}>RN FinTech</h1>
      </div>
      <h2 style={{ color: '#4E944F', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Welcome to the RN FinTech Partner Program!</h2>
      <p>Hello {name},</p>
      <p>Thank you for registering as a partner with RN FinTech. We have received your application and are excited about the possibility of working together.</p>
      <p>Your application is currently under review by our team. We will notify you via email as soon as your account has been approved. This process typically takes 1-2 business days.</p>
      <p>Once approved, you will gain full access to your Partner Dashboard to submit applications on behalf of your clients and track your progress.</p>
      <p>We appreciate your patience.</p>
      <p>Best regards,<br/>The RN FinTech Partner Team</p>
    </div>
  </div>
);
