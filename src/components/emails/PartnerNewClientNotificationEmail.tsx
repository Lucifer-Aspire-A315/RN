
import React from 'react';

interface PartnerNewClientNotificationEmailProps {
  partnerName: string;
  clientName: string;
  clientEmail: string;
}

export const PartnerNewClientNotificationEmail: React.FC<PartnerNewClientNotificationEmailProps> = ({ partnerName, clientName, clientEmail }) => (
  <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: 1.6, color: '#333' }}>
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', border: '1px solid #ddd', borderRadius: '10px', backgroundColor: '#f9f9f9' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ color: '#4E944F', margin: '0' }}>RN FinTech Partner Alert</h1>
      </div>
      <h2 style={{ color: '#4E944F', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>New Client Joined!</h2>
      <p>Hello {partnerName},</p>
      <p>A new user has registered on RN FinTech and selected you as their partner. They have been added to your client list.</p>
      
      <div style={{ borderLeft: '4px solid #4E944F', paddingLeft: '15px', margin: '20px 0', backgroundColor: '#fff', padding: '15px' }}>
        <p><strong>Client Name:</strong> {clientName}</p>
        <p><strong>Client Email:</strong> {clientEmail}</p>
      </div>

      <p>You can now submit and manage applications on their behalf through your Partner Dashboard.</p>
       <div style={{ textAlign: 'center', margin: '30px 0' }}>
        <a 
            href={`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?tab=my_clients`}
            style={{ backgroundColor: '#4E944F', color: '#ffffff', padding: '12px 25px', textDecoration: 'none', borderRadius: '5px', fontWeight: 'bold' }}>
          Go to Your Dashboard
        </a>
      </div>
      <p>Best regards,<br/>The RN FinTech Team</p>
    </div>
  </div>
);
