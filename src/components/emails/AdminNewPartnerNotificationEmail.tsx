
import React from 'react';

interface AdminNewPartnerNotificationEmailProps {
  partnerName: string;
  partnerEmail: string;
  businessModel: string;
}

export const AdminNewPartnerNotificationEmail: React.FC<AdminNewPartnerNotificationEmailProps> = ({ partnerName, partnerEmail, businessModel }) => (
  <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: 1.6, color: '#333' }}>
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', border: '1px solid #ddd', borderRadius: '10px', backgroundColor: '#f9f9f9' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ color: '#4E944F', margin: '0' }}>RN FinTech Admin Alert</h1>
      </div>
      <h2 style={{ color: '#4E944F', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>New Partner Registration</h2>
      <p>Hello Admin,</p>
      <p>A new partner has registered on the platform and is awaiting your approval.</p>
      
      <div style={{ borderLeft: '4px solid #4E944F', paddingLeft: '15px', margin: '20px 0', backgroundColor: '#fff', padding: '15px' }}>
        <p><strong>Partner Name:</strong> {partnerName}</p>
        <p><strong>Email:</strong> {partnerEmail}</p>
        <p><strong>Business Model:</strong> {businessModel}</p>
      </div>

      <p>Please log in to the admin dashboard to review their details and approve their account.</p>
       <div style={{ textAlign: 'center', margin: '30px 0' }}>
        <a 
            href={`${process.env.NEXT_PUBLIC_BASE_URL}/admin/dashboard?tab=pending_partners`}
            style={{ backgroundColor: '#4E944F', color: '#ffffff', padding: '12px 25px', textDecoration: 'none', borderRadius: '5px', fontWeight: 'bold' }}>
          Go to Admin Dashboard
        </a>
      </div>
      <p>Regards,<br/>The RN FinTech System</p>
    </div>
  </div>
);
