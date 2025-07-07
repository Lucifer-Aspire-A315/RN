
# RN FinTech Partner API Integration Guide v1.0

## Document Overview

This guide provides the complete technical specifications required for our partners to integrate their systems with the RN FinTech loan processing platform. It is designed for your development team and outlines the process for submitting loan applications on behalf of your customers (Event Clients) and your associated vendors (Event Vendors).

---

## 1. For RN FinTech: Internal Next Steps

Before the partner can begin their integration, we must complete the following actions on our end.

#### **A. Build the API Endpoint**

We need to create a new API route within our Next.js application to handle incoming requests from the partner.

*   **Route:** `src/app/api/v1/applications/partner-submit/route.ts`
*   **Functionality:** This route will contain a `POST` handler that performs the following actions:
    1.  **Authentication:** Read the `Authorization` header and validate the `Bearer` token against a secure list of partner API keys.
    2.  **Validation:** Use a new Zod schema (to be created based on the JSON schema below) to validate the incoming JSON payload.
    3.  **File Handling:** Decode the Base64 file strings back into file buffers.
    4.  **File Upload:** Use our existing `uploadFileAsStringAction` logic to upload the decoded files to Firebase Storage and get their public URLs.
    5.  **Data Processing:** Replace the Base64 data in the payload with the new file URLs.
    6.  **Application Creation:** Use our existing `submitApplicationAction` to save the processed application data into the appropriate Firestore collection.
    7.  **Response:** Return the appropriate JSON response (Success, Validation Error, etc.) as specified in this guide.

#### **B. Create the Zod Schema**

We need to create a new, comprehensive Zod schema in `src/lib/schemas.ts` that perfectly matches the `oneOf` structure defined in the JSON Schema in this document. This will allow for robust, type-safe validation of all incoming API requests.

#### **C. Generate and Share the API Key**

1.  **Generate:** Create a secure, unique, and random string to serve as the `partnerId` (API Key) for the events company. A good format is `partner_sk_[32_RANDOM_CHARS]`.
2.  **Store Securely:** Store this key in a secure location on our backend, ideally as an environment variable.
3.  **Share Securely:** Share this key with the partner's designated technical lead through a secure channel (e.g., a password-protected message or a direct, encrypted chat). **Do not send it over plain email.**

---

## 2. For Our Valued Partner: Integration Guide

This section contains everything your development team needs to integrate with our API.

### **2.1. Authentication**

All requests to our API must be authenticated using a `Bearer` token in the `Authorization` header. RN FinTech will provide you with a secret API key.

**Header Format:**
`Authorization: Bearer YOUR_SECRET_API_KEY`

*   Requests with a missing or invalid API key will be rejected with an `HTTP 401 Unauthorized` status.

### **2.2. Endpoint Details**

*   **HTTP Method:** `POST`
*   **URL:** `https://www.your-app-domain.com/api/v1/applications/partner-submit`
    *   *(Note: The final domain will be provided by RN FinTech upon deployment.)*

### **2.3. Request Body: JSON Schema**

The body of your `POST` request must be a JSON object conforming to the following schema. The `applicantType` field is critical and determines the required structure for the rest of the payload.

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://www.your-app-domain.com/schemas/v1/partner-loan-application.json",
  "title": "Partner Loan Application",
  "description": "Comprehensive schema for submitting a loan application via a trusted partner API for an event ecosystem. This includes all fields necessary for loan processing.",
  "type": "object",
  "properties": {
    "partnerId": {
      "type": "string",
      "description": "The secret partner identifier (API Key) provided by RN FinTech."
    },
    "applicantType": {
      "type": "string",
      "description": "The type of applicant, which determines the required data structure.",
      "enum": ["EVENT_CLIENT", "EVENT_VENDOR"]
    },
    "loanDetails": {
      "type": "object",
      "properties": {
        "loanAmountRequired": { "type": "number", "description": "The requested loan amount in INR.", "minimum": 1 },
        "requestedTenureInMonths": { "type": "integer", "description": "The desired loan repayment period in months.", "minimum": 1 }
      },
      "required": ["loanAmountRequired", "requestedTenureInMonths"]
    },
    "eventContext": {
      "type": "object",
      "properties": {
        "eventName": { "type": "string", "description": "The name of the event (e.g., 'Priya & Rohan Wedding')." },
        "eventDate": { "type": "string", "description": "The date of the event in YYYY-MM-DD format.", "format": "date" }
      },
      "required": ["eventName", "eventDate"]
    }
  },
  "required": [
    "partnerId",
    "applicantType",
    "loanDetails",
    "eventContext"
  ],
  "allOf": [
    {
      "if": { "properties": { "applicantType": { "const": "EVENT_CLIENT" } } },
      "then": {
        "properties": {
          "personalDetails": { "$ref": "#/definitions/fullPersonalDetails" },
          "employmentIncome": { "$ref": "#/definitions/employmentIncome" },
          "existingLoans": { "$ref": "#/definitions/existingLoans" },
          "documentUploads": { "$ref": "#/definitions/clientDocumentUploads" }
        },
        "required": ["personalDetails", "employmentIncome", "documentUploads"]
      }
    },
    {
      "if": { "properties": { "applicantType": { "const": "EVENT_VENDOR" } } },
      "then": {
        "properties": {
          "proprietorDetails": { "$ref": "#/definitions/fullPersonalDetails" },
          "businessInformation": { "$ref": "#/definitions/vendorBusinessInformation" },
          "existingLoans": { "$ref": "#/definitions/existingLoans" },
          "roleInEvent": { "type": "string", "description": "The role of the vendor in the event (e.g., 'Catering', 'Photography')." },
          "documentUploads": { "$ref": "#/definitions/vendorDocumentUploads" }
        },
        "required": ["proprietorDetails", "businessInformation", "roleInEvent", "documentUploads"]
      }
    }
  ],
  "definitions": {
    "base64File": {
        "type": "object",
        "description": "A file encoded as a Base64 string.",
        "properties": {
            "fileName": { "type": "string", "description": "The original name of the file, e.g., 'pan_card.pdf'." },
            "mimeType": { "type": "string", "description": "The MIME type of the file, e.g., 'application/pdf'." },
            "data": { "type": "string", "contentEncoding": "base64", "description": "The Base64 encoded content of the file." }
        },
        "required": ["fileName", "mimeType", "data"]
    },
    "fullPersonalDetails": {
      "title": "Complete Personal Details",
      "type": "object",
      "properties": {
        "fullName": { "type": "string" },
        "fatherOrHusbandName": { "type": "string" },
        "dob": { "type": "string", "format": "date", "description": "YYYY-MM-DD format." },
        "gender": { "type": "string", "enum": ["Male", "Female", "Other"] },
        "email": { "type": "string", "format": "email" },
        "mobileNumber": { "type": "string", "pattern": "^\\d{10}$" },
        "panNumber": { "type": "string", "pattern": "^[A-Z]{5}[0-9]{4}[A-Z]{1}$" },
        "aadhaarNumber": { "type": "string", "pattern": "^\\d{12}$" },
        "currentAddress": { "type": "string" },
        "isPermanentAddressSame": { "type": "boolean", "description": "Set to true if permanent address is the same as current." },
        "permanentAddress": { "type": "string", "description": "Required if isPermanentAddressSame is false." }
      },
      "required": ["fullName", "fatherOrHusbandName", "dob", "gender", "email", "mobileNumber", "panNumber", "aadhaarNumber", "currentAddress", "isPermanentAddressSame"]
    },
    "employmentIncome": {
      "title": "Employment and Income Details",
      "type": "object",
      "properties": {
        "employmentType": { "type": "string", "enum": ["Salaried", "Self-Employed"] },
        "companyName": { "type": "string", "description": "Name of the employer or business." },
        "monthlyIncome": { "type": "number", "minimum": 0 },
        "yearsInCurrentJobOrBusiness": { "type": "integer", "minimum": 0 }
      },
      "required": ["employmentType", "monthlyIncome", "yearsInCurrentJobOrBusiness"]
    },
    "existingLoans": {
      "title": "Existing Financial Obligations",
      "type": "object",
      "properties": {
        "hasExistingLoans": {"type": "boolean"},
        "bankName": { "type": "string", "description": "Name of the bank(s) for existing loans." },
        "outstandingAmount": { "type": "number", "minimum": 0, "description": "Total outstanding amount of all other loans." },
        "emiAmount": { "type": "number", "minimum": 0, "description": "Total EMI of all other active loans." }
       },
       "required": ["hasExistingLoans"]
    },
    "vendorBusinessInformation": {
      "title": "Vendor Business Information",
      "type": "object",
      "properties": {
        "legalBusinessName": { "type": "string" },
        "businessType": { "type": "string", "enum": ["Proprietorship", "Partnership", "Pvt Ltd", "Other"] },
        "natureOfBusiness": { "type": "string" },
        "businessStartYear": { "type": "integer", "minimum": 1900 },
        "businessAddress": { "type": "string" },
        "annualTurnover": { "type": "number", "minimum": 0 },
        "profitAfterTax": { "type": "number", "minimum": 0 },
        "gstNumber": { "type": "string", "pattern": "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$" }
      },
      "required": ["legalBusinessName", "businessType", "natureOfBusiness", "businessStartYear", "annualTurnover"]
    },
    "clientDocumentUploads": {
        "type": "object",
        "properties": {
            "panCard": { "$ref": "#/definitions/base64File" },
            "aadhaarCard": { "$ref": "#/definitions/base64File" },
            "photograph": { "$ref": "#/definitions/base64File" },
            "incomeProof": { "$ref": "#/definitions/base64File", "description": "Latest Salary Slip or ITR." },
            "bankStatement": { "$ref": "#/definitions/base64File", "description": "Last 6 months bank statement." }
        },
        "required": ["panCard", "aadhaarCard", "photograph", "incomeProof", "bankStatement"]
    },
    "vendorDocumentUploads": {
        "type": "object",
        "properties": {
            "proprietorPanCard": { "$ref": "#/definitions/base64File" },
            "proprietorAadhaarCard": { "$ref": "#/definitions/base64File" },
            "proprietorPhotograph": { "$ref": "#/definitions/base64File" },
            "businessProof": { "$ref": "#/definitions/base64File", "description": "GST Certificate, Udyam, or Shop Act License." },
            "bankStatement": { "$ref": "#/definitions/base64File", "description": "Last 12 months business bank statement." },
            "itrLast2Years": { "$ref": "#/definitions/base64File", "description": "Income Tax Returns for the last 2 financial years." }
        },
        "required": ["proprietorPanCard", "proprietorAadhaarCard", "proprietorPhotograph", "businessProof", "bankStatement", "itrLast2Years"]
    }
  }
}
```

### **2.4. Example Payloads**

Use these examples for testing your implementation.

**Example: `EVENT_CLIENT`**
```json
{
  "partnerId": "YOUR_SECRET_PARTNER_ID",
  "applicantType": "EVENT_CLIENT",
  "loanDetails": { "loanAmountRequired": 150000, "requestedTenureInMonths": 12 },
  "eventContext": { "eventName": "Rohan & Priya Wedding", "eventDate": "2024-12-15" },
  "personalDetails": {
    "fullName": "Rohan Kumar", "fatherOrHusbandName": "Suresh Kumar", "dob": "1995-05-20", "gender": "Male",
    "email": "rohan.k@example.com", "mobileNumber": "9876543210", "panNumber": "ABCDE1234F", "aadhaarNumber": "123456789012",
    "currentAddress": "123, Sunshine Apartments, Mumbai, Maharashtra", "isPermanentAddressSame": true
  },
  "employmentIncome": { "employmentType": "Salaried", "companyName": "Tech Solutions Pvt Ltd", "monthlyIncome": 85000, "yearsInCurrentJobOrBusiness": 3 },
  "existingLoans": { "hasExistingLoans": true, "emiAmount": 12000 },
  "documentUploads": {
    "panCard": { "fileName": "rohan_pan.pdf", "mimeType": "application/pdf", "data": "JVBERi0xLjQKJ..." },
    "aadhaarCard": { "fileName": "rohan_aadhaar.pdf", "mimeType": "application/pdf", "data": "JVBERi0xLjQKJ..." },
    "photograph": { "fileName": "rohan.jpg", "mimeType": "image/jpeg", "data": "/9j/4AAQSkZJRg..." },
    "incomeProof": { "fileName": "salary_slip.pdf", "mimeType": "application/pdf", "data": "JVBERi0xLjQKJ..." },
    "bankStatement": { "fileName": "bank_statement.pdf", "mimeType": "application/pdf", "data": "JVBERi0xLjQKJ..." }
  }
}
```

**Example: `EVENT_VENDOR`**
```json
{
  "partnerId": "YOUR_SECRET_PARTNER_ID",
  "applicantType": "EVENT_VENDOR",
  "loanDetails": { "loanAmountRequired": 200000, "requestedTenureInMonths": 24 },
  "eventContext": { "eventName": "Rohan & Priya Wedding", "eventDate": "2024-12-15" },
  "roleInEvent": "Photography and Videography",
  "proprietorDetails": {
    "fullName": "Sunita Sharma", "fatherOrHusbandName": "Anil Sharma", "dob": "1990-11-02", "gender": "Female",
    "email": "sunita.clicks@example.com", "mobileNumber": "9123456780", "panNumber": "FGHIJ5678K", "aadhaarNumber": "098765432109",
    "currentAddress": "45, Creative Lane, Pune, Maharashtra", "isPermanentAddressSame": true
  },
  "businessInformation": {
    "legalBusinessName": "Sunita Clicks", "businessType": "Proprietorship", "natureOfBusiness": "Photography", "businessStartYear": 2018,
    "annualTurnover": 2500000, "gstNumber": "27FGHIJ5678K1Z5"
  },
  "existingLoans": { "hasExistingLoans": false },
  "documentUploads": {
    "proprietorPanCard": { "fileName": "sunita_pan.pdf", "mimeType": "application/pdf", "data": "JVBERi0xLjQKJ..." },
    "proprietorAadhaarCard": { "fileName": "sunita_aadhaar.pdf", "mimeType": "application/pdf", "data": "JVBERi0xLjQKJ..." },
    "proprietorPhotograph": { "fileName": "sunita.jpg", "mimeType": "image/jpeg", "data": "/9j/4AAQSkZJRg..." },
    "businessProof": { "fileName": "udyam_cert.pdf", "mimeType": "application/pdf", "data": "JVBERi0xLjQKJ..." },
    "bankStatement": { "fileName": "business_statement.pdf", "mimeType": "application/pdf", "data": "JVBERi0xLjQKJ..." },
    "itrLast2Years": { "fileName": "itr_2023.pdf", "mimeType": "application/pdf", "data": "JVBERi0xLjQKJ..." }
  }
}
```

### **2.5. API Response Handling**

Your system should be prepared to handle the following responses from our API.

**Success (`HTTP 201 Created`)**
*Indicates the application was accepted and is now in our system.*
```json
{
  "success": true,
  "message": "Application received successfully. Our team will begin processing shortly.",
  "applicationId": "rnfintech-app-AbC123XyZ",
  "status": "Submitted"
}
```

**Validation Error (`HTTP 400 Bad Request`)**
*Indicates the data sent was incomplete or invalid. The `errors` object will specify which fields failed.*
```json
{
  "success": false,
  "message": "Invalid application data provided.",
  "errors": {
    "personalDetails.panNumber": "Invalid PAN format.",
    "loanDetails.loanAmountRequired": "Loan amount must be a positive number."
  }
}
```

**Authentication Error (`HTTP 401 Unauthorized`)**
*Indicates your API key was missing or incorrect.*
```json
{
  "success": false,
  "message": "Authentication failed. Please check your API key."
}
```

**Server Error (`HTTP 500 Internal Server Error`)**
*Indicates an unexpected error on our side. We recommend retrying the request after a short delay.*
```json
{
  "success": false,
  "message": "An internal server error occurred. Please try again later."
}
```

---

If you have any questions during your development, please reach out to our technical contact. We look forward to a successful partnership.
