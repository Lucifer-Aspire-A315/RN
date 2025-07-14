
import React from 'react';

interface PartnerApprovedEmailProps {
  name: string;
}

export const PartnerApprovedEmail: React.FC<PartnerApprovedEmailProps> = ({ name }) => (
  <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: 1.6, color: '#333' }}>
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', border: '1px solid #ddd', borderRadius: '10px', backgroundColor: '#f9f9f9' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ color: '#4E944F', margin: '0' }}>RN FinTech</h1>
      </div>
      <h2 style={{ color: '#4E944F', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Congratulations! Your Partner Account is Approved!</h2>
      <p>Hello {name},</p>
      <p>We are thrilled to inform you that your application to become an RN FinTech partner has been approved!</p>
      <p>You can now log in to your account and access your Partner Dashboard. Start submitting applications for your clients and track your earnings with our powerful tools.</p>
      <div style={{ textAlign: 'center', margin: '30px 0' }}>
        <a href={`${process.env.NEXT_PUBLIC_BASE_URL}/partner-login`} style={{ backgroundColor: '#4E944F', color: '#ffffff', padding: '12px 25px', textDecoration: 'none', borderRadius: '5px', fontWeight: 'bold' }}>
          Login to Your Partner Dashboard
        </a>
      </div>
      <p>We are excited to have you on board and look forward to a successful partnership.</p>
      <p>Best regards,<br/>The RN FinTech Partner Team</p>
    </div>
  </div>
);
