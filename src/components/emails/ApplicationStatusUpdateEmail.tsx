
import React from 'react';

interface ApplicationStatusUpdateEmailProps {
  name: string;
  applicationType: string;
  applicationId: string;
  newStatus: string;
  adminMessage?: string;
}

export const ApplicationStatusUpdateEmail: React.FC<ApplicationStatusUpdateEmailProps> = ({ name, applicationType, applicationId, newStatus, adminMessage }) => (
  <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: 1.6, color: '#333' }}>
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', border: '1px solid #ddd', borderRadius: '10px', backgroundColor: '#f9f9f9' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ color: '#4E944F', margin: '0' }}>RN FinTech</h1>
      </div>
      <h2 style={{ color: '#4E944F', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Application Status Update</h2>
      <p>Hello {name},</p>
      <p>There has been an update on your application for a <strong>{applicationType}</strong> (ID: {applicationId}).</p>
      <p>The new status is: <strong style={{ 
          color: newStatus.toLowerCase() === 'approved' ? '#28a745' : newStatus.toLowerCase() === 'rejected' ? '#dc3545' : '#333',
          padding: '4px 8px',
          borderRadius: '4px',
          backgroundColor: newStatus.toLowerCase() === 'approved' ? '#d4edda' : newStatus.toLowerCase() === 'rejected' ? '#f8d7da' : '#e2e3e5'
      }}>{newStatus}</strong></p>
      
      {adminMessage && (
        <div style={{ borderLeft: '4px solid #4E944F', paddingLeft: '15px', margin: '20px 0' }}>
          <p><strong>A message from our team:</strong></p>
          <p><em>{adminMessage}</em></p>
        </div>
      )}

      <p>You can view the full details by logging into your dashboard.</p>
       <div style={{ textAlign: 'center', margin: '30px 0' }}>
        <a href={`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`} style={{ backgroundColor: '#4E944F', color: '#ffffff', padding: '12px 25px', textDecoration: 'none', borderRadius: '5px', fontWeight: 'bold' }}>
          View Application Details
        </a>
      </div>
      <p>Best regards,<br/>The RN FinTech Team</p>
    </div>
  </div>
);
