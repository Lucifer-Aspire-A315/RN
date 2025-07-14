
import React from 'react';

interface WelcomeEmailProps {
  name: string;
}

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({ name }) => (
  <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: 1.6, color: '#333' }}>
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', border: '1px solid #ddd', borderRadius: '10px', backgroundColor: '#f9f9f9' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ color: '#4E944F', margin: '0' }}>RN FinTech</h1>
      </div>
      <h2 style={{ color: '#4E944F', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Welcome Aboard!</h2>
      <p>Hello {name},</p>
      <p>Thank you for creating an account with RN FinTech. We're excited to help you achieve your financial goals.</p>
      <p>You can now log in to your dashboard to start applying for loans, CA services, and government schemes. Our platform is designed to make the process as simple and transparent as possible.</p>
      <div style={{ textAlign: 'center', margin: '30px 0' }}>
        <a href={`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`} style={{ backgroundColor: '#4E944F', color: '#ffffff', padding: '12px 25px', textDecoration: 'none', borderRadius: '5px', fontWeight: 'bold' }}>
          Go to Your Dashboard
        </a>
      </div>
      <p>If you have any questions, feel free to contact our support team.</p>
      <p>Best regards,<br/>The RN FinTech Team</p>
    </div>
  </div>
);
