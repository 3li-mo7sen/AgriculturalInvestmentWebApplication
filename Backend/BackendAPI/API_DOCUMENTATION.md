# Agricultural Investment Platform - API Documentation

**Version:** 1.0  
**API Base URL:** `http://localhost:5000/api`  
**Platform:** .NET 10 Backend API  
**Last Updated:** 2024

## Table of Contents

1. [Overview](#overview)
2. [Authentication & Authorization](#authentication--authorization)
3. [API Response Format](#api-response-format)
4. [Authentication Module](#1-authentication-module)
5. [Account Module](#2-account-module)
6. [Projects Module](#3-projects-module)
7. [Investments Module](#4-investments-module)
8. [Investor Module](#5-investor-module)
9. [Farmer Module](#6-farmer-module)
10. [Expert Module](#7-expert-module)
11. [Contracts Module](#8-contracts-module)
12. [Reports Module](#9-reports-module)
13. [Admin Module](#10-admin-module)
14. [User Roles & Permissions](#user-roles--permissions)
15. [Error Handling](#error-handling)

---

## Overview

The Agricultural Investment Platform API enables secure connection between farmers seeking investment, investors looking for opportunities, and experts who validate projects. The platform supports user authentication, project management, investment tracking, contract handling, and comprehensive reporting.

### Key Features
- **User Management**: Support for multiple user roles (Farmer, Investor, Expert, Admin)
- **Project Management**: Full lifecycle management from creation to completion
- **Investment Handling**: Secure investment transactions with profit distribution
- **Contract Management**: Automated contract generation and profit calculation
- **Expert Review**: Project validation by qualified experts
- **Admin Dashboard**: Comprehensive platform management and monitoring
- **Wallet System**: Balance management for investors and farmers

---

## Authentication & Authorization

### JWT Authentication Flow

The API uses **JWT (JSON Web Tokens)** for authentication. Tokens are issued upon successful login and must be included in all authenticated requests.

#### Authentication Header Format
```
Authorization: Bearer <your_jwt_token>
```

#### Token Storage
- Tokens are automatically stored in **HTTP-only cookies** (secure, not accessible via JavaScript)
- Cookie Name: `token`
- Expiration: 24 hours from issue time
- Secure Setting: False (development), should be True in production

#### User Roles
| Role | Description | Permissions |
|------|-------------|-------------|
| **Farmer** | Agricultural land owner seeking investment | Create/manage projects, view investments, manage contracts |
| **Investor** | Individual providing capital for projects | Browse projects, invest, manage wallet, track returns |
| **Expert** | Professional who validates and reviews projects | Review pending projects, approve/reject projects |
| **Admin** | Platform administrator | Full access to all features, user management, platform settings |

---

## API Response Format

All API responses follow a consistent format:

### Success Response (2xx Status)
```json
{
  "statusCode": 200,
  "message": "Operation successful",
  "data": {
    "id": 1,
    "name": "Example",
    // ... additional fields
  }
}
```

### Error Response (4xx/5xx Status)
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input or validation failure |
| 401 | Unauthorized - Authentication required or invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource does not exist |
| 500 | Internal Server Error - Server-side error |

---

## 1. Authentication Module

### Endpoint: Login

**Purpose:** Authenticate user and receive JWT token

**HTTP Method:** `POST`  
**Route:** `/api/Auth/login`  
**Authentication:** Not required  
**Authorization:** None

#### Request Headers
```
Content-Type: application/json
```

#### Request Body Schema
```json
{
  "email": "string (required, valid email format)",
  "password": "string (required, minimum 6 characters)"
}
```

#### Request Example
```bash
curl -X POST http://localhost:5000/api/Auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "farmer@example.com",
    "password": "password123"
  }'
```

#### Success Response (200)
```json
{
  "statusCode": 200,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Ahmed Farm",
    "email": "farmer@example.com",
    "role": "Farmer"
  },
  "role": "Farmer"
}
```

#### Error Response (400)
```json
{
  "statusCode": 400,
  "message": "Invalid email or password"
}
```

#### Status Codes
| Code | Meaning |
|------|---------|
| 200 | Login successful |
| 400 | Invalid credentials |
| 401 | Account not verified |

#### Frontend Usage
- **Pages/Components:** Login page, authentication guard
- **Store:** Save token in localStorage/sessionStorage or cookie
- **Headers:** Include token in all authenticated requests

#### Business Logic
1. Validates email and password against database
2. Checks if user email is confirmed
3. Generates JWT token valid for 24 hours
4. Sets HTTP-only cookie for session persistence
5. Returns user details and token

#### Edge Cases
- Account not yet verified (email confirmation pending)
- Multiple failed login attempts (consider rate limiting)
- Expired token (user must login again)
- Token revocation on logout

---

### Endpoint: Register as Farmer

**Purpose:** Create new farmer account

**HTTP Method:** `POST`  
**Route:** `/api/Auth/register/farmer`  
**Authentication:** Not required  
**Authorization:** None

#### Request Headers
```
Content-Type: application/json
```

#### Request Body Schema
```json
{
  "name": "string (required, max 100 characters)",
  "email": "string (required, valid email format, must be unique)",
  "password": "string (required, minimum 6 characters)",
  "confirmPassword": "string (required, must match password)",
  "phoneNumber": "string (required)",
  "landDetails": "string (required, description of land/farm)"
}
```

#### Request Example
```bash
curl -X POST http://localhost:5000/api/Auth/register/farmer \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ahmed Farm Owner",
    "email": "ahmed@farm.com",
    "password": "secure123",
    "confirmPassword": "secure123",
    "phoneNumber": "+201001234567",
    "landDetails": "5 acres of fertile land in Nile delta, suitable for wheat and corn"
  }'
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "Registration successful. Please check your email to confirm your account.",
  "userId": 1
}
```

#### Error Response (400)
```json
{
  "success": false,
  "message": "Email already exists"
}
```

#### Status Codes
| Code | Meaning |
|------|---------|
| 200 | Registration successful, verification email sent |
| 400 | Validation failed (duplicate email, password mismatch, etc.) |

#### Frontend Usage
- **Pages/Components:** Farmer registration form
- **Next Step:** Redirect to email verification page
- **Verification Link:** Sent via email, valid for specific period

#### Business Logic
1. Validates all input fields
2. Checks for duplicate email
3. Verifies password matches confirmation
4. Creates user with role "Farmer"
5. Generates email verification token
6. Sends confirmation email
7. Account remains inactive until email confirmed

#### Edge Cases
- Email already registered
- Password and confirm password mismatch
- Invalid email format
- Phone number validation (country-specific)

---

### Endpoint: Register as Investor

**Purpose:** Create new investor account

**HTTP Method:** `POST`  
**Route:** `/api/Auth/register/investor`  
**Authentication:** Not required  
**Authorization:** None

#### Request Headers
```
Content-Type: application/json
```

#### Request Body Schema
```json
{
  "name": "string (required, max 100 characters)",
  "email": "string (required, valid email format, must be unique)",
  "password": "string (required, minimum 6 characters)",
  "confirmPassword": "string (required, must match password)"
}
```

#### Request Example
```bash
curl -X POST http://localhost:5000/api/Auth/register/investor \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Investment Company Ltd",
    "email": "investor@company.com",
    "password": "secure123",
    "confirmPassword": "secure123"
  }'
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "Registration successful. Please check your email to confirm your account.",
  "userId": 2
}
```

#### Status Codes
| Code | Meaning |
|------|---------|
| 200 | Registration successful |
| 400 | Validation failed |

#### Frontend Usage
- **Pages/Components:** Investor registration form
- **Next Step:** Email verification required
- **KYC:** May require KYC documents for compliance

---

### Endpoint: Register as Expert

**Purpose:** Create new expert account for project verification

**HTTP Method:** `POST`  
**Route:** `/api/Auth/register/expert`  
**Authentication:** Not required  
**Authorization:** None (Admin verification required)

#### Request Headers
```
Content-Type: application/json
```

#### Request Body Schema
```json
{
  "name": "string (required, max 100 characters)",
  "email": "string (required, valid email format, must be unique)",
  "password": "string (required, minimum 6 characters)",
  "confirmPassword": "string (required, must match password)"
}
```

#### Request Example
```bash
curl -X POST http://localhost:5000/api/Auth/register/expert \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Agricultural Expert",
    "email": "expert@agri.com",
    "password": "secure123",
    "confirmPassword": "secure123"
  }'
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "Registration successful. Please check your email to confirm your account.",
  "userId": 3
}
```

#### Status Codes
| Code | Meaning |
|------|---------|
| 200 | Registration successful |
| 400 | Validation failed |

#### Business Logic
- Expert accounts may require admin approval
- Can be assigned to review specific projects
- Has authority to approve/reject projects

---

### Endpoint: Activate Email Account

**Purpose:** Verify email address and activate account

**HTTP Method:** `GET`  
**Route:** `/api/Auth/active/account`  
**Authentication:** Not required  
**Authorization:** None

#### Query Parameters
```
token: string (required) - Email verification token sent to user's email
email: string (required) - User's email address
```

#### Request Example
```bash
curl "http://localhost:5000/api/Auth/active/account?token=abc123xyz&email=user@example.com"
```

#### Success Response (200)
```
Done, Email Activated Successfully
```

#### Error Response (400)
```
Failed to activate email
```

#### Status Codes
| Code | Meaning |
|------|---------|
| 200 | Email verified and account activated |
| 400 | Invalid or expired token |

#### Frontend Usage
- **Pages/Components:** Email verification page, link from email
- **User Flow:** Click verification link → Account activated → Redirect to login

---

### Endpoint: Forget Password

**Purpose:** Send password reset email to user

**HTTP Method:** `GET`  
**Route:** `/api/Auth/forget-password`  
**Authentication:** Not required  
**Authorization:** None

#### Query Parameters
```
email: string (required) - User's registered email address
```

#### Request Example
```bash
curl "http://localhost:5000/api/Auth/forget-password?email=user@example.com"
```

#### Success Response (200)
```json
{
  "statusCode": 200,
  "message": "Email sent successfully"
}
```

#### Error Response (400)
```json
{
  "statusCode": 404,
  "message": "Failed to send email"
}
```

#### Status Codes
| Code | Meaning |
|------|---------|
| 200 | Reset email sent successfully |
| 400 | Email not found or failed to send |

#### Frontend Usage
- **Pages/Components:** Forgot password page
- **Next Step:** Redirect user to check email and use reset link

#### Business Logic
1. Looks up user by email address
2. Generates a unique reset token (GUID)
3. Stores token with 30-minute expiry on user record
4. Sends reset email with link containing the token
5. Returns false if user not found (no account enumeration detail exposed to caller)

#### Edge Cases
- Email not registered in system
- Token expires after 30 minutes; user must request again

---

### Endpoint: Reset Password

**Purpose:** Reset user password using token received via email

**HTTP Method:** `POST`  
**Route:** `/api/Auth/reset-password`  
**Authentication:** Not required  
**Authorization:** None

#### Request Headers
```
Content-Type: application/json
```

#### Request Body Schema
```json
{
  "email": "string (required) - User's email address",
  "token": "string (required) - Reset token received via email",
  "password": "string (required) - New password"
}
```

#### Request Example
```bash
curl -X POST http://localhost:5000/api/Auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "token": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "password": "newSecurePassword123"
  }'
```

#### Success Response (200)
```json
{
  "statusCode": 200,
  "message": "Password reset successfully"
}
```

#### Error Response (400)
```json
{
  "statusCode": 400,
  "message": "invalid token"
}
```

#### Status Codes
| Code | Meaning |
|------|---------|
| 200 | Password reset successfully |
| 400 | User not found, invalid token, or token expired |

#### Frontend Usage
- **Pages/Components:** Reset password page (accessed via email link)
- **Next Step:** Redirect to login after successful reset

#### Business Logic
1. Looks up user by email
2. Validates the provided token matches stored reset token
3. Checks token has not expired (30-minute window)
4. Hashes new password using BCrypt
5. Clears reset token and expiry from user record
6. Saves updated password

#### Edge Cases
- Token expired (must request a new forget-password email)
- Invalid or mismatched token
- User not found

---

### Endpoint: Resend Activation Email

**Purpose:** Resend account activation/verification email to user

**HTTP Method:** `GET`  
**Route:** `/api/Auth/resend-activation`  
**Authentication:** Not required  
**Authorization:** None

#### Query Parameters
```
email: string (required) - User's registered email address
```

#### Request Example
```bash
curl "http://localhost:5000/api/Auth/resend-activation?email=user@example.com"
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "Activation email sent successfully"
}
```

#### Error Response (400)
```json
{
  "success": false,
  "message": "User not found"
}
```

#### Status Codes
| Code | Meaning |
|------|---------|
| 200 | Activation email resent successfully |
| 400 | User not found or account already activated |

#### Frontend Usage
- **Pages/Components:** Email verification page, resend button
- **Use Case:** User did not receive or the original verification link expired

#### Business Logic
1. Looks up user by email
2. Returns error if user not found
3. Returns error if account is already activated
4. Generates a new verification token (GUID) with 1-hour expiry
5. Saves new token and sends activation email

#### Edge Cases
- Account already verified
- User not found in system

---

### Endpoint: Resend Reset Password Email

**Purpose:** Resend password reset email with a new token

**HTTP Method:** `GET`  
**Route:** `/api/Auth/resend-reset-password`  
**Authentication:** Not required  
**Authorization:** None

#### Query Parameters
```
email: string (required) - User's registered email address
```

#### Request Example
```bash
curl "http://localhost:5000/api/Auth/resend-reset-password?email=user@example.com"
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "Reset password email sent successfully"
}
```

#### Error Response (400)
```json
{
  "success": false,
  "message": "User not found"
}
```

#### Status Codes
| Code | Meaning |
|------|---------|
| 200 | Reset password email resent successfully |
| 400 | User not found |

#### Frontend Usage
- **Pages/Components:** Forgot password page, resend button
- **Use Case:** Previous reset token expired or email was not received

#### Business Logic
1. Looks up user by email
2. Returns error if user not found
3. Generates a new reset token (GUID) with 30-minute expiry
4. Saves new token and sends reset password email

#### Edge Cases
- User not found in system
- New token replaces old one; previous reset links become invalid

---

### Endpoint: Logout

**Purpose:** Invalidate JWT token and clear session

**HTTP Method:** `POST`  
**Route:** `/api/Auth/logout`  
**Authentication:** Not required  
**Authorization:** None

#### Request Headers
```
Content-Type: application/json
Authorization: Bearer <token> (optional)
```

#### Request Example
```bash
curl -X POST http://localhost:5000/api/Auth/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### Success Response (200)
```json
{
  "statusCode": 200,
  "message": "Logged out successfully"
}
```

#### Frontend Usage
- **Pages/Components:** All authenticated pages, logout button
- **Action:** Clear stored token, redirect to login
- **Cleanup:** Remove user data from store/context

---

### Endpoint: Get Current User

**Purpose:** Retrieve authenticated user's profile information

**HTTP Method:** `GET`  
**Route:** `/api/Auth/me`  
**Authentication:** Required (Bearer token)  
**Authorization:** All authenticated users

#### Request Headers
```
Authorization: Bearer <token> (required)
```

#### Request Example
```bash
curl -X GET http://localhost:5000/api/Auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### Success Response (200)
```json
{
  "id": 1,
  "name": "Ahmed Farm",
  "email": "ahmed@farm.com",
  "role": "Farmer",
  "emailConfirmed": true
}
```

#### Error Response (401)
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

#### Status Codes
| Code | Meaning |
|------|---------|
| 200 | User profile retrieved |
| 401 | Token missing or invalid |
| 404 | User not found |

#### Frontend Usage
- **Pages/Components:** App initialization, user menu
- **Purpose:** Verify user is logged in and get current info
- **Timing:** Call on app load to restore session

---

### Endpoint: Delete User by Email

**Purpose:** Remove user account from system

**HTTP Method:** `DELETE`  
**Route:** `/api/Auth/delete-by-email`  
**Authentication:** Not required (development endpoint)  
**Authorization:** None

#### Query Parameters
```
email: string (required) - Email of user to delete
```

#### Request Example
```bash
curl -X DELETE "http://localhost:5000/api/Auth/delete-by-email?email=user@example.com"
```

#### Success Response (200)
```
User deleted successfully
```

#### Error Response (404)
```
User not found
```

#### ⚠️ Note
This endpoint appears to be for development/testing. In production, implement proper account deletion with confirmation and data retention policies.

---

## 2. Account Module

All endpoints require authentication (Bearer token).

### Endpoint: Get Current User Profile

**Purpose:** Retrieve detailed authenticated user profile

**HTTP Method:** `GET`  
**Route:** `/api/Account/me`  
**Authentication:** Required  
**Authorization:** All authenticated users

#### Request Headers
```
Authorization: Bearer <token> (required)
```

#### Request Example
```bash
curl -X GET http://localhost:5000/api/Account/me \
  -H "Authorization: Bearer <token>"
```

#### Success Response (200)
```json
{
  "id": 1,
  "name": "Ahmed Farm",
  "email": "ahmed@farm.com",
  "role": "Farmer",
  "emailConfirmed": true,
  "status": "active",
  "kycStatus": "verified",
  "phone": "+201001234567",
  "location": "Cairo, Egypt",
  "landDetails": "5 acres farmland",
  "stats": {
    "projectsCreated": 3,
    "totalFunding": 50000,
    "avgRating": 4.5
  }
}
```

#### Error Response (401)
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

---

### Endpoint: Update Profile

**Purpose:** Modify user profile information

**HTTP Method:** `PUT`  
**Route:** `/api/Account/profile`  
**Authentication:** Required  
**Authorization:** All authenticated users

#### Request Body Schema
```json
{
  "name": "string (optional)",
  "fullName": "string (optional)",
  "email": "string (optional, valid email format)",
  "phone": "string (optional)",
  "phoneNumber": "string (optional)",
  "location": "string (optional)",
  "landDetails": "string (optional, for farmers)",
  "farmInfo": "string (optional, for farmers)",
  "specialization": "string (optional, for experts)"
}
```

#### Request Example
```bash
curl -X PUT http://localhost:5000/api/Account/profile \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+201001234567",
    "location": "Cairo, Egypt",
    "landDetails": "8 acres of fertile land"
  }'
```

#### Success Response (200)
```json
{
  "id": 1,
  "name": "Ahmed Farm",
  "email": "ahmed@farm.com",
  "phone": "+201001234567",
  "location": "Cairo, Egypt",
  "message": "Profile updated successfully"
}
```

#### Error Response (400)
```json
{
  "statusCode": 400,
  "message": "Cannot update profile"
}
```

---

### Endpoint: Change Password

**Purpose:** Update user password

**HTTP Method:** `PUT`  
**Route:** `/api/Account/change-password`  
**Authentication:** Required  
**Authorization:** All authenticated users

#### Request Body Schema
```json
{
  "currentPassword": "string (required)",
  "newPassword": "string (required, minimum 6 characters)",
  "confirmPassword": "string (required, must match newPassword)"
}
```

#### Request Example
```bash
curl -X PUT http://localhost:5000/api/Account/change-password \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "oldPassword123",
    "newPassword": "newPassword123",
    "confirmPassword": "newPassword123"
  }'
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

#### Error Response (400)
```json
{
  "success": false,
  "message": "Current password is incorrect"
}
```

---

### Endpoint: Get Account Settings

**Purpose:** Retrieve user notification and security preferences

**HTTP Method:** `GET`  
**Route:** `/api/Account/settings`  
**Authentication:** Required  
**Authorization:** All authenticated users

#### Request Example
```bash
curl -X GET http://localhost:5000/api/Account/settings \
  -H "Authorization: Bearer <token>"
```

#### Success Response (200)
```json
{
  "emailNotifications": true,
  "smsNotifications": true,
  "investmentAlerts": true,
  "projectUpdates": true,
  "returnAlerts": true,
  "newProjectAlerts": true,
  "newReviewAlerts": true,
  "urgentReviewAlerts": true,
  "systemAlerts": true,
  "marketingEmails": false,
  "twoFactorAuth": false,
  "loginAlerts": true
}
```

---

### Endpoint: Update Account Settings

**Purpose:** Modify notification and security preferences

**HTTP Method:** `PUT`  
**Route:** `/api/Account/settings`  
**Authentication:** Required  
**Authorization:** All authenticated users

#### Request Body Schema
```json
{
  "emailNotifications": "boolean (optional, default: true)",
  "smsNotifications": "boolean (optional, default: true)",
  "investmentAlerts": "boolean (optional, default: true)",
  "projectUpdates": "boolean (optional, default: true)",
  "returnAlerts": "boolean (optional, default: true)",
  "newProjectAlerts": "boolean (optional, default: true)",
  "newReviewAlerts": "boolean (optional, default: true)",
  "urgentReviewAlerts": "boolean (optional, default: true)",
  "systemAlerts": "boolean (optional, default: true)",
  "marketingEmails": "boolean (optional, default: false)",
  "twoFactorAuth": "boolean (optional, default: false)",
  "loginAlerts": "boolean (optional, default: true)"
}
```

#### Request Example
```bash
curl -X PUT http://localhost:5000/api/Account/settings \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "emailNotifications": true,
    "investmentAlerts": false,
    "marketingEmails": false
  }'
```

#### Success Response (200)
```json
{
  "emailNotifications": true,
  "investmentAlerts": false,
  "marketingEmails": false,
  "message": "Settings updated successfully"
}
```

---

## 3. Projects Module

### Endpoint: Get All Projects

**Purpose:** Retrieve all published and public projects

**HTTP Method:** `GET`  
**Route:** `/api/Project`  
**Authentication:** Not required  
**Authorization:** None (public endpoint)

#### Request Example
```bash
curl -X GET http://localhost:5000/api/Project
```

#### Success Response (200)
```json
[
  {
    "id": 1,
    "name": "Wheat Farm Project 2024",
    "title": "Wheat Cultivation",
    "shortDescription": "Large-scale wheat farming project",
    "fullDescription": "Detailed description of the wheat project...",
    "cropType": "Wheat",
    "location": "Nile Delta, Egypt",
    "governorate": "Kafr El-Sheikh",
    "district": "Baltim",
    "landSize": "50 acres",
    "soilType": "Loamy",
    "waterSource": "Nile River",
    "ownershipType": "Owned",
    "cropSeason": "Winter 2024-2025",
    "cost": 150000,
    "fundingAmount": 150000,
    "targetAmount": 150000,
    "fundingRaised": 75000,
    "fundingProgress": 50,
    "investorsCount": 5,
    "minInvestment": 5000,
    "expectedProfit": 45000,
    "expectedRoi": "30%",
    "duration": 6,
    "farmerId": 1,
    "farmerName": "Ahmed Farm Owner",
    "farmerShare": 30,
    "status": "Published"
  }
]
```

#### Frontend Usage
- **Pages/Components:** Project listing page, project discovery
- **Features:** Filter, search, sort by funding progress

---

### Endpoint: Get Project by ID

**Purpose:** Retrieve detailed information about specific project

**HTTP Method:** `GET`  
**Route:** `/api/Project/{id}`  
**Authentication:** Not required  
**Authorization:** None (public endpoint)

#### Path Parameters
```
id: integer (required) - Project ID
```

#### Request Example
```bash
curl -X GET http://localhost:5000/api/Project/1
```

#### Success Response (200)
```json
{
  "id": 1,
  "name": "Wheat Farm Project 2024",
  "title": "Wheat Cultivation",
  "shortDescription": "Large-scale wheat farming project",
  "fullDescription": "Detailed description of the wheat project...",
  "cropType": "Wheat",
  "location": "Nile Delta, Egypt",
  "cost": 150000,
  "fundingRaised": 75000,
  "fundingProgress": 50,
  "investorsCount": 5,
  "expectedProfit": 45000,
  "expectedRoi": "30%",
  "duration": 6,
  "farmerName": "Ahmed Farm Owner",
  "status": "Published"
}
```

#### Error Response (404)
```json
{
  "statusCode": 404,
  "message": "Project not found"
}
```

---

### Endpoint: Get Published Projects

**Purpose:** Retrieve only published and active projects for investment

**HTTP Method:** `GET`  
**Route:** `/api/Project/published`  
**Authentication:** Not required  
**Authorization:** None (public endpoint)

#### Request Example
```bash
curl -X GET http://localhost:5000/api/Project/published
```

#### Frontend Usage
- **Pages/Components:** Investment opportunities page
- **Filter:** Shows only projects ready for investment

---

### Endpoint: Get Projects by Status

**Purpose:** Retrieve projects filtered by their current status

**HTTP Method:** `GET`  
**Route:** `/api/Project/status/{status}`  
**Authentication:** Required  
**Authorization:** Farmer, Expert, Admin roles

#### Path Parameters
```
status: string (required) - Project status: "Pending", "Approved", "Rejected", "Published"
```

#### Request Example
```bash
curl -X GET http://localhost:5000/api/Project/status/Approved \
  -H "Authorization: Bearer <token>"
```

#### Success Response (200)
```json
[
  {
    "id": 1,
    "name": "Wheat Farm Project 2024",
    "status": "Approved",
    // ... other fields
  },
  {
    "id": 2,
    "name": "Corn Farm Project",
    "status": "Approved",
    // ... other fields
  }
]
```

---

### Endpoint: Create Project

**Purpose:** Create new agricultural project (Farmer only)

**HTTP Method:** `POST`  
**Route:** `/api/Project`  
**Authentication:** Required  
**Authorization:** Farmer role only

#### Request Headers
```
Authorization: Bearer <token> (required)
Content-Type: application/json
```

#### Request Body Schema
```json
{
  "name": "string (optional, max 150 characters)",
  "title": "string (optional)",
  "projectTitle": "string (optional)",
  "shortDescription": "string (optional)",
  "fullDescription": "string (optional)",
  "description": "string (optional)",
  "cropType": "string (required) - e.g., 'Wheat', 'Corn', 'Rice'",
  "landName": "string (optional)",
  "governorate": "string (optional) - e.g., 'Cairo', 'Giza'",
  "district": "string (optional)",
  "location": "string (optional)",
  "landSize": "string (required) - e.g., '50 acres'",
  "soilType": "string (optional) - e.g., 'Loamy', 'Sandy'",
  "waterSource": "string (optional) - e.g., 'Nile River'",
  "ownershipType": "string (optional) - 'Owned' or 'Leased'",
  "cropSeason": "string (optional) - e.g., 'Winter 2024-2025'",
  "cost": "decimal (required) - Total project cost in currency",
  "fundingAmount": "decimal (optional)",
  "targetAmount": "decimal (optional) - Amount to raise",
  "minInvestment": "decimal (optional) - Minimum investment amount",
  "expectedProfit": "decimal (required) - Expected profit amount",
  "expectedRoi": "string (optional) - e.g., '30%'",
  "duration": "integer (required) - Project duration in months",
  "farmerShare": "integer (optional) - Farmer's profit share percentage"
}
```

#### Request Example
```bash
curl -X POST http://localhost:5000/api/Project \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Wheat Cultivation 2024",
    "shortDescription": "Large-scale wheat farming",
    "fullDescription": "Detailed project description with all specifics...",
    "cropType": "Wheat",
    "governorate": "Kafr El-Sheikh",
    "landSize": "50 acres",
    "soilType": "Loamy",
    "waterSource": "Nile River",
    "cost": 150000,
    "targetAmount": 150000,
    "minInvestment": 5000,
    "expectedProfit": 45000,
    "expectedRoi": "30%",
    "duration": 6,
    "farmerShare": 30
  }'
```

#### Success Response (200)
```json
{
  "statusCode": 200,
  "message": "Project created successfully",
  "data": {
    "id": 1,
    "title": "Wheat Cultivation 2024",
    "status": "Pending",
    "farmerId": 1,
    "createdDate": "2024-01-15T10:30:00Z"
  }
}
```

#### Error Response (400)
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "cropType",
      "message": "Crop type is required"
    }
  ]
}
```

#### Status Codes
| Code | Meaning |
|------|---------|
| 200 | Project created, awaiting expert review |
| 400 | Validation failed |
| 401 | Not authenticated |
| 403 | Not a farmer |

#### Frontend Usage
- **Pages/Components:** Create Project form (farmer only)
- **Workflow:** Fill form → Submit → Pending review status

#### Business Logic
1. Extract farmer ID from JWT token
2. Validate all required fields
3. Create project with "Pending" status
4. Notify experts about new submission
5. Return project with confirmation

#### Project Status Flow
```
Pending → Approved/Rejected → Published → Completed
```

---

### Endpoint: Get My Projects

**Purpose:** Retrieve all projects created by authenticated farmer

**HTTP Method:** `GET`  
**Route:** `/api/Project/my-projects`  
**Authentication:** Required  
**Authorization:** Farmer role only

#### Request Example
```bash
curl -X GET http://localhost:5000/api/Project/my-projects \
  -H "Authorization: Bearer <token>"
```

#### Success Response (200)
```json
[
  {
    "id": 1,
    "title": "Wheat Cultivation 2024",
    "status": "Published",
    "fundingRaised": 75000,
    "targetAmount": 150000,
    "fundingProgress": 50,
    "investorsCount": 5,
    "duration": 6,
    "expectedProfit": 45000
  },
  {
    "id": 2,
    "title": "Corn Farm Project",
    "status": "Pending",
    "fundingRaised": 0,
    "targetAmount": 100000,
    "fundingProgress": 0,
    "investorsCount": 0,
    "duration": 5,
    "expectedProfit": 30000
  }
]
```

#### Frontend Usage
- **Pages/Components:** Farmer dashboard, My Projects page
- **Features:** View status, funding progress, investor count

---

### Endpoint: Update Project

**Purpose:** Modify project details before expert approval

**HTTP Method:** `PUT`  
**Route:** `/api/Project/{id}`  
**Authentication:** Required  
**Authorization:** Farmer (only own projects)

#### Path Parameters
```
id: integer (required) - Project ID
```

#### Request Body Schema
Same as Create Project endpoint (all fields optional)

#### Request Example
```bash
curl -X PUT http://localhost:5000/api/Project/1 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Updated project description...",
    "targetAmount": 160000
  }'
```

#### Success Response (200)
```json
{
  "id": 1,
  "title": "Wheat Cultivation 2024",
  "status": "Pending",
  "message": "Project updated successfully"
}
```

#### Error Response (404)
```json
{
  "statusCode": 404,
  "message": "Project not found"
}
```

#### Restrictions
- Cannot update if project already approved/rejected
- Cannot update if project is published

---

### Endpoint: Delete Project

**Purpose:** Remove project (only before approval)

**HTTP Method:** `DELETE`  
**Route:** `/api/Project/{id}`  
**Authentication:** Required  
**Authorization:** Farmer (only own projects)

#### Path Parameters
```
id: integer (required) - Project ID
```

#### Request Example
```bash
curl -X DELETE http://localhost:5000/api/Project/1 \
  -H "Authorization: Bearer <token>"
```

#### Success Response (200)
```
Project deleted successfully
```

#### Error Response (400)
```json
{
  "statusCode": 400,
  "message": "Cannot delete this project"
}
```

#### Restrictions
- Cannot delete if project has received investments
- Cannot delete if already approved

---

### Endpoint: Get Pending Projects

**Purpose:** Retrieve projects awaiting expert review

**HTTP Method:** `GET`  
**Route:** `/api/Project/pending`  
**Authentication:** Required  
**Authorization:** Expert, Admin roles only

#### Request Example
```bash
curl -X GET http://localhost:5000/api/Project/pending \
  -H "Authorization: Bearer <token>"
```

#### Frontend Usage
- **Pages/Components:** Expert review dashboard
- **Feature:** Shows projects needing verification

---

### Endpoint: Get Approved Projects

**Purpose:** Retrieve expert-approved projects

**HTTP Method:** `GET`  
**Route:** `/api/Project/approved`  
**Authentication:** Required  
**Authorization:** Expert, Admin roles only

#### Request Example
```bash
curl -X GET http://localhost:5000/api/Project/approved \
  -H "Authorization: Bearer <token>"
```

---

### Endpoint: Get Rejected Projects

**Purpose:** Retrieve rejected projects

**HTTP Method:** `GET`  
**Route:** `/api/Project/rejected`  
**Authentication:** Required  
**Authorization:** Expert, Admin roles only

#### Request Example
```bash
curl -X GET http://localhost:5000/api/Project/rejected \
  -H "Authorization: Bearer <token>"
```

---

### Endpoint: Approve Project

**Purpose:** Expert or Admin approves project for publication

**HTTP Method:** `PUT`  
**Route:** `/api/Project/approve/{id}`  
**Authentication:** Required  
**Authorization:** Expert, Admin roles only

#### Path Parameters
```
id: integer (required) - Project ID
```

#### Request Example
```bash
curl -X PUT http://localhost:5000/api/Project/approve/1 \
  -H "Authorization: Bearer <token>"
```

#### Success Response (200)
```
Project approved successfully
```

#### Error Response (400)
```json
{
  "statusCode": 400,
  "message": "Cannot approve this project"
}
```

#### Business Logic
1. Validates project is in pending status
2. Changes status to "Approved"
3. Notifies farmer of approval
4. Project becomes ready for publication

---

### Endpoint: Reject Project

**Purpose:** Expert or Admin rejects project with reason

**HTTP Method:** `PUT`  
**Route:** `/api/Project/reject/{id}`  
**Authentication:** Required  
**Authorization:** Expert, Admin roles only

#### Path Parameters
```
id: integer (required) - Project ID
```

#### Request Body Schema
```json
{
  "reason": "string (required) - Reason for rejection"
}
```

#### Request Example
```bash
curl -X PUT http://localhost:5000/api/Project/reject/1 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Land documentation does not meet platform standards"
  }'
```

#### Success Response (200)
```
Project rejected successfully
```

#### Business Logic
1. Changes project status to "Rejected"
2. Stores rejection reason
3. Notifies farmer with feedback
4. Farmer can resubmit after addressing issues

---

### Endpoint: Publish Project

**Purpose:** Admin publishes approved project for public investment

**HTTP Method:** `PUT`  
**Route:** `/api/Project/publish/{id}`  
**Authentication:** Required  
**Authorization:** Admin role only

#### Path Parameters
```
id: integer (required) - Project ID
```

#### Request Example
```bash
curl -X PUT http://localhost:5000/api/Project/publish/1 \
  -H "Authorization: Bearer <token>"
```

#### Success Response (200)
```
Project published successfully
```

#### Business Logic
1. Requires project to be approved first
2. Changes status to "Published"
3. Makes project visible to all investors
4. Enables investment functionality
5. Notifies farmer of publication

---

## 4. Investments Module

### Endpoint: Create Investment

**Purpose:** Investor invests money in a project

**HTTP Method:** `POST`  
**Route:** `/api/Investment`  
**Authentication:** Required  
**Authorization:** Investor role only

#### Request Headers
```
Authorization: Bearer <token> (required)
Content-Type: application/json
```

#### Request Body Schema
```json
{
  "projectId": "integer (required) - Project ID to invest in",
  "amount": "decimal (required, minimum > 0) - Investment amount"
}
```

#### Request Example
```bash
curl -X POST http://localhost:5000/api/Investment \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": 1,
    "amount": 10000
  }'
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "Investment successful",
  "data": {
    "investmentId": 5,
    "projectId": 1,
    "amount": 10000,
    "date": "2024-01-15T10:30:00Z",
    "expectedReturn": 3000,
    "status": "Active"
  }
}
```

#### Error Response (400)
```json
{
  "success": false,
  "message": "Insufficient wallet balance"
}
```

#### Status Codes
| Code | Meaning |
|------|---------|
| 200 | Investment created successfully |
| 400 | Insufficient funds or validation failed |
| 401 | Not authenticated |
| 403 | Not an investor |

#### Frontend Usage
- **Pages/Components:** Investment page, confirm investment modal
- **Validation:** Check wallet balance, project status

#### Business Logic
1. Validates investor has sufficient balance
2. Validates project is published and accepting investments
3. Creates investment record
4. Deducts amount from investor wallet
5. Updates project funding progress
6. Generates contract automatically
7. Sends confirmation to both parties

---

### Endpoint: Get All Investments

**Purpose:** Retrieve all investments (Admin/Investor dashboard)

**HTTP Method:** `GET`  
**Route:** `/api/Investment`  
**Authentication:** Required  
**Authorization:** Admin, Investor roles only

#### Request Example
```bash
curl -X GET http://localhost:5000/api/Investment \
  -H "Authorization: Bearer <token>"
```

#### Success Response (200)
```json
[
  {
    "id": 1,
    "projectId": 1,
    "projectName": "Wheat Cultivation 2024",
    "investorId": 2,
    "investorName": "John Investor",
    "amount": 10000,
    "date": "2024-01-15T10:30:00Z",
    "expectedReturn": 3000,
    "actualReturn": 0,
    "status": "Active",
    "roi": "30%"
  }
]
```

---

### Endpoint: Get Investment by ID

**Purpose:** Retrieve specific investment details

**HTTP Method:** `GET`  
**Route:** `/api/Investment/{id}`  
**Authentication:** Required  
**Authorization:** All authenticated users

#### Path Parameters
```
id: integer (required) - Investment ID
```

#### Request Example
```bash
curl -X GET http://localhost:5000/api/Investment/1 \
  -H "Authorization: Bearer <token>"
```

#### Success Response (200)
```json
{
  "id": 1,
  "projectId": 1,
  "projectName": "Wheat Cultivation 2024",
  "investorId": 2,
  "amount": 10000,
  "date": "2024-01-15T10:30:00Z",
  "expectedReturn": 3000,
  "contractId": 1,
  "status": "Active"
}
```

---

### Endpoint: Get Investments by Investor

**Purpose:** Retrieve all investments for specific investor

**HTTP Method:** `GET`  
**Route:** `/api/Investment/by-investor/{investorId}`  
**Authentication:** Required  
**Authorization:** Admin, Investor roles

#### Path Parameters
```
investorId: integer (required) - Investor user ID
```

#### Request Example
```bash
curl -X GET http://localhost:5000/api/Investment/by-investor/2 \
  -H "Authorization: Bearer <token>"
```

---

### Endpoint: Get My Investments

**Purpose:** Retrieve authenticated investor's investments

**HTTP Method:** `GET`  
**Route:** `/api/Investment/my-investments`  
**Authentication:** Required  
**Authorization:** Investor role only

#### Request Example
```bash
curl -X GET http://localhost:5000/api/Investment/my-investments \
  -H "Authorization: Bearer <token>"
```

#### Success Response (200)
```json
[
  {
    "id": 1,
    "projectName": "Wheat Cultivation 2024",
    "amount": 10000,
    "date": "2024-01-15",
    "expectedReturn": 3000,
    "status": "Active",
    "progressPercentage": 50
  },
  {
    "id": 2,
    "projectName": "Corn Farm Project",
    "amount": 5000,
    "date": "2024-02-01",
    "expectedReturn": 1500,
    "status": "Active",
    "progressPercentage": 25
  }
]
```

#### Frontend Usage
- **Pages/Components:** Investor dashboard, My Investments page
- **Features:** Portfolio view, return tracking

---

### Endpoint: Get Investment History

**Purpose:** Retrieve investor's investment history with profits

**HTTP Method:** `GET`  
**Route:** `/api/Investment/history`  
**Authentication:** Required  
**Authorization:** Investor role only

#### Request Example
```bash
curl -X GET http://localhost:5000/api/Investment/history \
  -H "Authorization: Bearer <token>"
```

#### Success Response (200)
```json
{
  "totalInvested": 150000,
  "totalReturned": 45000,
  "totalProfit": 18000,
  "activeInvestments": 3,
  "completedInvestments": 2,
  "history": [
    {
      "projectName": "Wheat Cultivation 2024",
      "amount": 50000,
      "profit": 15000,
      "roi": "30%",
      "status": "Completed",
      "completionDate": "2024-07-15"
    },
    {
      "projectName": "Corn Farm Project",
      "amount": 30000,
      "profit": 3000,
      "roi": "10%",
      "status": "Active",
      "completionDate": null
    }
  ]
}
```

---

### Endpoint: Get Project Investors

**Purpose:** Retrieve all investors and investments for a project

**HTTP Method:** `GET`  
**Route:** `/api/Investment/by-project/{projectId}`  
**Authentication:** Required  
**Authorization:** Farmer, Expert, Admin roles

#### Path Parameters
```
projectId: integer (required) - Project ID
```

#### Request Example
```bash
curl -X GET http://localhost:5000/api/Investment/by-project/1 \
  -H "Authorization: Bearer <token>"
```

#### Success Response (200)
```json
{
  "projectName": "Wheat Cultivation 2024",
  "totalFundingRaised": 75000,
  "targetAmount": 150000,
  "fundingProgress": 50,
  "investorCount": 5,
  "investors": [
    {
      "id": 1,
      "name": "John Investor",
      "amount": 20000,
      "date": "2024-01-15",
      "share": "26.7%",
      "status": "Active"
    },
    {
      "id": 2,
      "name": "Sarah Investment Corp",
      "amount": 15000,
      "date": "2024-01-20",
      "share": "20%",
      "status": "Active"
    }
  ]
}
```

#### Frontend Usage
- **Pages/Components:** Farmer project details page
- **Purpose:** View who invested and how much

---

## 5. Investor Module

All endpoints require authentication (Bearer token) and Investor role authorization.

### Endpoint: Get All Investors

**Purpose:** Retrieve list of all investors (Admin only)

**HTTP Method:** `GET`  
**Route:** `/api/Investor`  
**Authentication:** Required  
**Authorization:** Admin role only

#### Request Example
```bash
curl -X GET http://localhost:5000/api/Investor \
  -H "Authorization: Bearer <token>"
```

#### Success Response (200)
```json
[
  {
    "id": 2,
    "name": "John Investor",
    "email": "john@investor.com",
    "wallet": {
      "balance": 50000,
      "totalInvested": 150000,
      "totalReturns": 18000
    },
    "status": "active",
    "joinDate": "2024-01-01"
  },
  {
    "id": 3,
    "name": "Sarah Investment Corp",
    "email": "sarah@investment.com",
    "wallet": {
      "balance": 75000,
      "totalInvested": 200000,
      "totalReturns": 35000
    },
    "status": "active",
    "joinDate": "2024-01-05"
  }
]
```

---

### Endpoint: Get Investor by ID

**Purpose:** Retrieve specific investor profile

**HTTP Method:** `GET`  
**Route:** `/api/Investor/{id}`  
**Authentication:** Required  
**Authorization:** Admin, Investor (own profile only)

#### Path Parameters
```
id: integer (required) - Investor user ID
```

#### Request Example
```bash
curl -X GET http://localhost:5000/api/Investor/2 \
  -H "Authorization: Bearer <token>"
```

#### Success Response (200)
```json
{
  "id": 2,
  "name": "John Investor",
  "email": "john@investor.com",
  "role": "Investor",
  "status": "active",
  "emailConfirmed": true,
  "kycStatus": "verified",
  "wallet": {
    "balance": 50000,
    "totalInvested": 150000,
    "totalReturns": 18000
  }
}
```

---

### Endpoint: Get Investor Dashboard

**Purpose:** Retrieve investor's personal dashboard with overview

**HTTP Method:** `GET`  
**Route:** `/api/Investor/dashboard`  
**Authentication:** Required  
**Authorization:** Investor role only

#### Request Example
```bash
curl -X GET http://localhost:5000/api/Investor/dashboard \
  -H "Authorization: Bearer <token>"
```

#### Success Response (200)
```json
{
  "walletBalance": 50000,
  "totalInvested": 150000,
  "totalReturns": 18000,
  "activeInvestments": 3,
  "completedInvestments": 2,
  "avgRoi": "12%",
  "recentInvestments": [
    {
      "id": 1,
      "projectName": "Wheat Cultivation 2024",
      "amount": 10000,
      "date": "2024-01-15",
      "expectedReturn": 3000,
      "status": "Active"
    }
  ],
  "topProjects": [
    {
      "id": 1,
      "name": "Wheat Cultivation 2024",
      "roi": "30%",
      "fundingProgress": 50
    }
  ],
  "alerts": [
    {
      "type": "project_update",
      "message": "Wheat project harvest completed successfully",
      "date": "2024-07-10"
    }
  ]
}
```

#### Frontend Usage
- **Pages/Components:** Investor dashboard/home page
- **Features:** Portfolio summary, recent activity, top performers

---

### Endpoint: Get Wallet

**Purpose:** Retrieve wallet balance and transaction history

**HTTP Method:** `GET`  
**Route:** `/api/Investor/wallet`  
**Authentication:** Required  
**Authorization:** Investor role only

#### Request Example
```bash
curl -X GET http://localhost:5000/api/Investor/wallet \
  -H "Authorization: Bearer <token>"
```

#### Success Response (200)
```json
{
  "balance": 50000,
  "totalInvested": 150000,
  "totalReturns": 18000,
  "totalRaised": 0,
  "transactions": [
    {
      "id": 1,
      "type": "Deposit",
      "description": "Bank Transfer",
      "amount": 10000,
      "date": "2024-01-10",
      "status": "Completed",
      "projectName": null
    },
    {
      "id": 2,
      "type": "Investment",
      "description": "Invested in Wheat Cultivation 2024",
      "amount": -5000,
      "date": "2024-01-15",
      "status": "Completed",
      "projectName": "Wheat Cultivation 2024"
    },
    {
      "id": 3,
      "type": "Return",
      "description": "Profit Distribution - Corn Farm Project",
      "amount": 1500,
      "date": "2024-06-20",
      "status": "Completed",
      "projectName": "Corn Farm Project"
    }
  ]
}
```

#### Frontend Usage
- **Pages/Components:** Wallet page, transaction history
- **Features:** Balance display, deposit/withdraw options, transaction log

---

### Endpoint: Deposit to Wallet

**Purpose:** Add funds to investor wallet

**HTTP Method:** `POST`  
**Route:** `/api/Investor/wallet/deposit`  
**Authentication:** Required  
**Authorization:** Investor role only

#### Request Headers
```
Authorization: Bearer <token> (required)
Content-Type: application/json
```

#### Request Body Schema
```json
{
  "amount": "decimal (required, minimum > 0) - Amount to deposit",
  "note": "string (optional) - Additional note"
}
```

#### Request Example
```bash
curl -X POST http://localhost:5000/api/Investor/wallet/deposit \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 25000,
    "note": "Monthly investment funds"
  }'
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "Deposit successful",
  "newBalance": 75000,
  "transactionId": 45
}
```

#### Error Response (400)
```json
{
  "success": false,
  "message": "Amount must be greater than 0"
}
```

#### Frontend Usage
- **Pages/Components:** Deposit form, wallet page
- **Feature:** Integration with payment gateway for bank transfers

#### Business Logic
1. Validates deposit amount
2. Creates transaction record
3. Updates wallet balance
4. Sends receipt to investor
5. Can be linked to payment gateway

---

### Endpoint: Withdraw from Wallet

**Purpose:** Withdraw funds from investor wallet

**HTTP Method:** `POST`  
**Route:** `/api/Investor/wallet/withdraw`  
**Authentication:** Required  
**Authorization:** Investor role only

#### Request Headers
```
Authorization: Bearer <token> (required)
Content-Type: application/json
```

#### Request Body Schema
```json
{
  "amount": "decimal (required, minimum > 0) - Amount to withdraw",
  "note": "string (optional) - Additional note"
}
```

#### Request Example
```bash
curl -X POST http://localhost:5000/api/Investor/wallet/withdraw \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5000,
    "note": "Withdraw some profits"
  }'
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "Withdrawal successful",
  "newBalance": 45000,
  "transactionId": 46
}
```

#### Error Response (400)
```json
{
  "success": false,
  "message": "Insufficient balance"
}
```

#### Business Logic
1. Validates withdrawal amount doesn't exceed balance
2. Creates transaction record
3. Updates wallet balance
4. Initiates bank transfer
5. Sends confirmation to investor

#### Edge Cases
- Insufficient balance
- Minimum withdrawal amount
- Processing delays
- Failed bank transfers

---

## 6. Farmer Module

All endpoints require authentication and Farmer role authorization.

### Endpoint: Get Farmer Dashboard

**Purpose:** Retrieve farmer's personal dashboard

**HTTP Method:** `GET`  
**Route:** `/api/Farmer/dashboard`  
**Authentication:** Required  
**Authorization:** Farmer role only

#### Request Example
```bash
curl -X GET http://localhost:5000/api/Farmer/dashboard \
  -H "Authorization: Bearer <token>"
```

#### Success Response (200)
```json
{
  "totalProjects": 3,
  "publishedProjects": 2,
  "pendingProjects": 1,
  "totalFundingRaised": 225000,
  "totalInvestors": 12,
  "activeProjects": [
    {
      "id": 1,
      "name": "Wheat Cultivation 2024",
      "status": "Published",
      "fundingRaised": 150000,
      "targetAmount": 150000,
      "fundingProgress": 100,
      "investorsCount": 8,
      "expectedProfit": 45000
    },
    {
      "id": 2,
      "name": "Corn Farm Project",
      "status": "Published",
      "fundingRaised": 75000,
      "targetAmount": 100000,
      "fundingProgress": 75,
      "investorsCount": 4,
      "expectedProfit": 22500
    }
  ],
  "recentActivity": [
    {
      "type": "new_investment",
      "message": "New investor joined Wheat project",
      "date": "2024-07-20",
      "amount": 5000
    },
    {
      "type": "project_approved",
      "message": "Corn Farm Project approved by expert",
      "date": "2024-07-18"
    }
  ]
}
```

#### Frontend Usage
- **Pages/Components:** Farmer dashboard/home page
- **Features:** Project overview, funding status, investor activity

---

### Endpoint: Get Farmer Wallet

**Purpose:** Retrieve farmer's wallet and earnings

**HTTP Method:** `GET`  
**Route:** `/api/Farmer/wallet`  
**Authentication:** Required  
**Authorization:** Farmer role only

#### Request Example
```bash
curl -X GET http://localhost:5000/api/Farmer/wallet \
  -H "Authorization: Bearer <token>"
```

#### Success Response (200)
```json
{
  "balance": 65000,
  "totalRaised": 225000,
  "totalReturns": 18000,
  "pendingReturns": 5000,
  "transactions": [
    {
      "id": 1,
      "type": "Funding",
      "description": "Investment from John Investor - Wheat Project",
      "amount": 20000,
      "date": "2024-01-15",
      "status": "Completed",
      "projectName": "Wheat Cultivation 2024"
    },
    {
      "id": 2,
      "type": "Profit",
      "description": "Profit distribution - Wheat Project",
      "amount": 10000,
      "date": "2024-07-20",
      "status": "Completed",
      "projectName": "Wheat Cultivation 2024"
    }
  ]
}
```

#### Frontend Usage
- **Pages/Components:** Farmer earnings page, wallet
- **Features:** Funding received, profit distribution tracking

---

### Endpoint: Get Farmer Contracts

**Purpose:** Retrieve all contracts for farmer's projects

**HTTP Method:** `GET`  
**Route:** `/api/Farmer/contracts`  
**Authentication:** Required  
**Authorization:** Farmer role only

#### Request Example
```bash
curl -X GET http://localhost:5000/api/Farmer/contracts \
  -H "Authorization: Bearer <token>"
```

#### Success Response (200)
```json
[
  {
    "id": 1,
    "investmentId": 1,
    "projectId": 1,
    "projectName": "Wheat Cultivation 2024",
    "investorName": "John Investor",
    "investmentAmount": 20000,
    "farmerShare": 30,
    "investorShare": 70,
    "expectedProfit": 6000,
    "farmerProfit": 1800,
    "investorProfit": 4200,
    "status": "Active",
    "startDate": "2024-01-15",
    "endDate": "2024-07-15",
    "daysRemaining": 45
  },
  {
    "id": 2,
    "investmentId": 2,
    "projectId": 1,
    "projectName": "Wheat Cultivation 2024",
    "investorName": "Sarah Investment Corp",
    "investmentAmount": 15000,
    "farmerShare": 30,
    "investorShare": 70,
    "expectedProfit": 4500,
    "farmerProfit": 1350,
    "investorProfit": 3150,
    "status": "Active",
    "startDate": "2024-01-20",
    "endDate": "2024-07-20",
    "daysRemaining": 40
  }
]
```

#### Frontend Usage
- **Pages/Components:** Farmer contracts page, project details
- **Features:** Contract details, profit breakdown, status tracking

---

## 7. Expert Module

All endpoints require authentication and Expert role authorization.

### Endpoint: Get Expert Dashboard

**Purpose:** Retrieve expert's review dashboard

**HTTP Method:** `GET`  
**Route:** `/api/Expert/dashboard`  
**Authentication:** Required  
**Authorization:** Expert role only

#### Request Example
```bash
curl -X GET http://localhost:5000/api/Expert/dashboard \
  -H "Authorization: Bearer <token>"
```

#### Success Response (200)
```json
{
  "pendingReviews": 5,
  "completedReviews": 28,
  "approvalRate": "85%",
  "averageReviewTime": 3,
  "recentReviews": [
    {
      "id": 1,
      "projectName": "Wheat Cultivation 2024",
      "farmerName": "Ahmed Farm",
      "submissionDate": "2024-07-15",
      "status": "Verified",
      "daysOld": 2
    },
    {
      "id": 2,
      "projectName": "Corn Farm Project",
      "farmerName": "Farida Agriculture",
      "submissionDate": "2024-07-18",
      "status": "Pending",
      "daysOld": 0
    }
  ]
}
```

#### Frontend Usage
- **Pages/Components:** Expert dashboard
- **Features:** Workload overview, review metrics

---

### Endpoint: Get Pending Projects for Review

**Purpose:** Retrieve projects awaiting expert verification

**HTTP Method:** `GET`  
**Route:** `/api/Expert/pending-projects`  
**Authentication:** Required  
**Authorization:** Expert role only

#### Request Example
```bash
curl -X GET http://localhost:5000/api/Expert/pending-projects \
  -H "Authorization: Bearer <token>"
```

#### Success Response (200)
```json
[
  {
    "id": 1,
    "title": "Wheat Cultivation 2024",
    "farmerName": "Ahmed Farm",
    "farmerEmail": "ahmed@farm.com",
    "cropType": "Wheat",
    "landSize": "50 acres",
    "location": "Cairo, Egypt",
    "description": "Large-scale wheat farming with modern techniques",
    "targetFunding": 150000,
    "expectedProfit": 45000,
    "duration": 6,
    "submissionDate": "2024-07-15",
    "daysOld": 2,
    "riskLevel": "Low",
    "documentation": {
      "landDeed": "present",
      "soilReport": "present",
      "waterRights": "present"
    }
  },
  {
    "id": 2,
    "title": "Corn Farm Project",
    "farmerName": "Farida Agriculture",
    "farmerEmail": "farida@farm.com",
    "cropType": "Corn",
    "landSize": "30 acres",
    "location": "Giza, Egypt",
    "description": "Organic corn production",
    "targetFunding": 100000,
    "expectedProfit": 30000,
    "duration": 5,
    "submissionDate": "2024-07-18",
    "daysOld": 0,
    "riskLevel": "Medium",
    "documentation": {
      "landDeed": "present",
      "soilReport": "missing",
      "waterRights": "present"
    }
  }
]
```

#### Frontend Usage
- **Pages/Components:** Expert pending projects list
- **Features:** Detailed review information, documentation checklist

---

### Endpoint: Get Verified Projects

**Purpose:** Retrieve projects approved by expert

**HTTP Method:** `GET`  
**Route:** `/api/Expert/verified-projects`  
**Authentication:** Required  
**Authorization:** Expert role only

#### Request Example
```bash
curl -X GET http://localhost:5000/api/Expert/verified-projects \
  -H "Authorization: Bearer <token>"
```

#### Success Response (200)
```json
[
  {
    "id": 1,
    "title": "Wheat Cultivation 2024",
    "farmerName": "Ahmed Farm",
    "status": "Approved",
    "verificationDate": "2024-07-16",
    "verificationNotes": "All documentation complete and verified. Project meets platform standards.",
    "investorsCount": 8,
    "fundingRaised": 150000
  }
]
```

---

### Endpoint: Get Rejected Projects

**Purpose:** Retrieve projects rejected by expert

**HTTP Method:** `GET`  
**Route:** `/api/Expert/rejected-projects`  
**Authentication:** Required  
**Authorization:** Expert role only

#### Request Example
```bash
curl -X GET http://localhost:5000/api/Expert/rejected-projects \
  -H "Authorization: Bearer <token>"
```

#### Success Response (200)
```json
[
  {
    "id": 3,
    "title": "Rice Farm Project",
    "farmerName": "Mohamed Rizk",
    "status": "Rejected",
    "rejectionDate": "2024-07-14",
    "rejectionReason": "Incomplete soil analysis. Farmer needs to provide certified soil report from approved laboratory.",
    "resubmissionAllowed": true
  }
]
```

---

### Endpoint: Verify Project

**Purpose:** Expert approves a project for farming

**HTTP Method:** `PUT`  
**Route:** `/api/Expert/projects/{id}/verify`  
**Authentication:** Required  
**Authorization:** Expert role only

#### Path Parameters
```
id: integer (required) - Project ID
```

#### Request Headers
```
Authorization: Bearer <token> (required)
Content-Type: application/json
```

#### Request Body Schema
```json
{
  "notes": "string (optional) - Verification notes"
}
```

#### Request Example
```bash
curl -X PUT http://localhost:5000/api/Expert/projects/1/verify \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "notes": "All documentation verified. Project meets all platform standards and risk assessment criteria."
  }'
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "Project verified successfully",
  "projectId": 1,
  "newStatus": "Approved",
  "verificationDate": "2024-07-16"
}
```

#### Error Response (400)
```json
{
  "success": false,
  "message": "Project already verified"
}
```

#### Status Codes
| Code | Meaning |
|------|---------|
| 200 | Project verified |
| 400 | Project cannot be verified |
| 401 | Not authenticated |
| 403 | Not an expert |

#### Frontend Usage
- **Pages/Components:** Expert review form, verification modal
- **Action:** Click verify after reviewing all documentation

#### Business Logic
1. Validates project is in pending status
2. Creates verification record
3. Changes project status to "Approved"
4. Notifies farmer of approval
5. Project becomes eligible for admin publishing

---

### Endpoint: Reject Project

**Purpose:** Expert rejects project with feedback

**HTTP Method:** `PUT`  
**Route:** `/api/Expert/projects/{id}/reject`  
**Authentication:** Required  
**Authorization:** Expert role only

#### Path Parameters
```
id: integer (required) - Project ID
```

#### Request Headers
```
Authorization: Bearer <token> (required)
Content-Type: application/json
```

#### Request Body Schema
```json
{
  "reason": "string (required) - Reason for rejection"
}
```

#### Request Example
```bash
curl -X PUT http://localhost:5000/api/Expert/projects/2/reject \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Soil analysis report is incomplete. Please provide certified report from approved laboratory showing full nutrient composition and pH levels."
  }'
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "Project rejected successfully",
  "projectId": 2,
  "newStatus": "Rejected",
  "rejectionDate": "2024-07-18"
}
```

#### Business Logic
1. Stores rejection reason in feedback system
2. Changes project status to "Rejected"
3. Allows farmer to resubmit after addressing feedback
4. Sends detailed feedback to farmer
5. Tracks rejection history

---

## 8. Contracts Module

### Endpoint: Get All Contracts

**Purpose:** Retrieve all contracts for authenticated user

**HTTP Method:** `GET`  
**Route:** `/api/Contract`  
**Authentication:** Required  
**Authorization:** Farmer, Investor, Admin roles

#### Request Example
```bash
curl -X GET http://localhost:5000/api/Contract \
  -H "Authorization: Bearer <token>"
```

#### Success Response (200)
```json
[
  {
    "id": 1,
    "investmentId": 1,
    "projectId": 1,
    "projectName": "Wheat Cultivation 2024",
    "investorName": "John Investor",
    "farmerName": "Ahmed Farm",
    "investmentAmount": 20000,
    "farmerShare": 30,
    "investorShare": 70,
    "expectedProfit": 6000,
    "farmerProfit": 1800,
    "investorProfit": 4200,
    "actualProfit": 6200,
    "status": "Active",
    "startDate": "2024-01-15",
    "endDate": "2024-07-15",
    "terms": "6-month contract for wheat cultivation project"
  }
]
```

#### Frontend Usage
- **Pages/Components:** Contracts list, portfolio view
- **Filtering:** By status, project, counterparty

---

### Endpoint: Get My Contracts

**Purpose:** Retrieve contracts for authenticated user's role

**HTTP Method:** `GET`  
**Route:** `/api/Contract/my-contracts`  
**Authentication:** Required  
**Authorization:** Farmer, Investor, Admin roles

#### Request Example
```bash
curl -X GET http://localhost:5000/api/Contract/my-contracts \
  -H "Authorization: Bearer <token>"
```

#### Success Response (200)
```json
[
  {
    "id": 1,
    "projectName": "Wheat Cultivation 2024",
    "counterpartyName": "John Investor",
    "investmentAmount": 20000,
    "expectedReturn": 6000,
    "status": "Active",
    "startDate": "2024-01-15",
    "daysRemaining": 45
  },
  {
    "id": 2,
    "projectName": "Wheat Cultivation 2024",
    "counterpartyName": "Sarah Investment Corp",
    "investmentAmount": 15000,
    "expectedReturn": 4500,
    "status": "Active",
    "startDate": "2024-01-20",
    "daysRemaining": 40
  }
]
```

---

### Endpoint: Get Contracts by Project

**Purpose:** Retrieve all contracts for a specific project

**HTTP Method:** `GET`  
**Route:** `/api/Contract/by-project/{projectId}`  
**Authentication:** Required  
**Authorization:** Farmer, Admin roles

#### Path Parameters
```
projectId: integer (required) - Project ID
```

#### Request Example
```bash
curl -X GET http://localhost:5000/api/Contract/by-project/1 \
  -H "Authorization: Bearer <token>"
```

#### Success Response (200)
```json
[
  {
    "id": 1,
    "investorName": "John Investor",
    "investmentAmount": 20000,
    "investorShare": 70,
    "status": "Active",
    "expectedProfit": 6000,
    "investorProfit": 4200
  },
  {
    "id": 2,
    "investorName": "Sarah Investment Corp",
    "investmentAmount": 15000,
    "investorShare": 70,
    "status": "Active",
    "expectedProfit": 4500,
    "investorProfit": 3150
  }
]
```

---

### Endpoint: Get Contract by ID

**Purpose:** Retrieve detailed contract information

**HTTP Method:** `GET`  
**Route:** `/api/Contract/{id}`  
**Authentication:** Required  
**Authorization:** All authenticated users

#### Path Parameters
```
id: integer (required) - Contract ID
```

#### Request Example
```bash
curl -X GET http://localhost:5000/api/Contract/1 \
  -H "Authorization: Bearer <token>"
```

#### Success Response (200)
```json
{
  "id": 1,
  "investmentId": 1,
  "projectId": 1,
  "projectName": "Wheat Cultivation 2024",
  "investorName": "John Investor",
  "investorEmail": "john@investor.com",
  "farmerName": "Ahmed Farm",
  "farmerEmail": "ahmed@farm.com",
  "investmentAmount": 20000,
  "contractDate": "2024-01-15",
  "startDate": "2024-01-15",
  "endDate": "2024-07-15",
  "duration": 6,
  "farmerShare": 30,
  "investorShare": 70,
  "expectedProfit": 6000,
  "farmerProfit": 1800,
  "investorProfit": 4200,
  "actualProfit": null,
  "status": "Active",
  "terms": "6-month contract with profit sharing as per percentages",
  "conditions": [
    "Monthly reporting required",
    "Crop insurance mandatory",
    "Project completion by end date"
  ]
}
```

---

### Endpoint: Update Contract Status

**Purpose:** Farmer updates contract status (completion, payment)

**HTTP Method:** `PUT`  
**Route:** `/api/Contract/{id}/status`  
**Authentication:** Required  
**Authorization:** Farmer, Admin roles

#### Path Parameters
```
id: integer (required) - Contract ID
```

#### Request Headers
```
Authorization: Bearer <token> (required)
Content-Type: application/json
```

#### Request Body Schema
```json
"Completed" or "Completed-Paid" or other status values
```

#### Request Example
```bash
curl -X PUT http://localhost:5000/api/Contract/1/status \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '"Completed"'
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "Contract status updated to Completed",
  "newStatus": "Completed"
}
```

---

### Endpoint: Calculate Profit

**Purpose:** Calculate profit from investment

**HTTP Method:** `GET`  
**Route:** `/api/Contract/{investmentId}/profit`  
**Authentication:** Required  
**Authorization:** All authenticated users

#### Path Parameters
```
investmentId: integer (required) - Investment ID
```

#### Request Example
```bash
curl -X GET http://localhost:5000/api/Contract/1/profit \
  -H "Authorization: Bearer <token>"
```

#### Success Response (200)
```json
{
  "investmentId": 1,
  "investmentAmount": 20000,
  "expectedProfit": 6000,
  "actualProfit": 6200,
  "farmerShare": 1860,
  "investorShare": 4340,
  "profitMargin": "31%",
  "status": "Calculated"
}
```

---

### Endpoint: Distribute Profit

**Purpose:** Distribute profits to farmer and investors

**HTTP Method:** `POST`  
**Route:** `/api/Contract/{investmentId}/distribute`  
**Authentication:** Required  
**Authorization:** Farmer, Admin roles

#### Path Parameters
```
investmentId: integer (required) - Investment ID
```

#### Request Headers
```
Authorization: Bearer <token> (required)
Content-Type: application/json
```

#### Request Example
```bash
curl -X POST http://localhost:5000/api/Contract/1/distribute \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json"
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "Profit distributed successfully",
  "investmentId": 1,
  "farmerReceived": 1860,
  "investorReceived": 4340,
  "distributionDate": "2024-07-15",
  "status": "Distributed"
}
```

#### Error Response (400)
```json
{
  "success": false,
  "message": "Cannot distribute profit - project not completed"
}
```

#### Business Logic
1. Validates project is completed
2. Calculates actual profit based on yield
3. Distributes to farmer and investor based on percentages
4. Updates wallet balances
5. Creates profit transaction records
6. Sends confirmation emails

---

## 9. Reports Module

### Endpoint: Create Report

**Purpose:** Create project progress report

**HTTP Method:** `POST`  
**Route:** `/api/Report`  
**Authentication:** Required  
**Authorization:** Farmer, Admin roles

#### Request Headers
```
Authorization: Bearer <token> (required)
Content-Type: application/json
```

#### Request Body Schema
```json
{
  "content": "string (required, max 2000 characters) - Report content/description",
  "projectId": "integer (required) - Associated project ID",
  "date": "datetime (optional, defaults to current time)"
}
```

#### Request Example
```bash
curl -X POST http://localhost:5000/api/Report \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": 1,
    "content": "Wheat cultivation project at 50% completion. Seedling stage completed successfully. Expected final harvest in 3 weeks. Weather conditions optimal. All investors notified of progress."
  }'
```

#### Success Response (200)
```json
{
  "statusCode": 200,
  "message": "Report created successfully",
  "data": {
    "id": 15,
    "projectId": 1,
    "projectName": "Wheat Cultivation 2024",
    "content": "Wheat cultivation project at 50% completion...",
    "date": "2024-07-20T10:30:00Z",
    "author": "Ahmed Farm"
  }
}
```

#### Frontend Usage
- **Pages/Components:** Create Report form, progress updates
- **Users:** Farmer reports on project status
- **Audience:** Investors receive notifications

#### Business Logic
1. Validates project exists and user is owner
2. Creates report record with timestamp
3. Notifies all project investors
4. Stores in project history

---

### Endpoint: Get All Reports

**Purpose:** Retrieve all reports in system (Admin only)

**HTTP Method:** `GET`  
**Route:** `/api/Report`  
**Authentication:** Required  
**Authorization:** Admin role only

#### Request Example
```bash
curl -X GET http://localhost:5000/api/Report \
  -H "Authorization: Bearer <token>"
```

#### Success Response (200)
```json
[
  {
    "id": 1,
    "projectId": 1,
    "projectName": "Wheat Cultivation 2024",
    "author": "Ahmed Farm",
    "content": "Wheat project at 50% completion...",
    "date": "2024-07-20",
    "status": "Published"
  },
  {
    "id": 2,
    "projectId": 2,
    "projectName": "Corn Farm Project",
    "author": "Farida Agriculture",
    "content": "Corn seedlings planted successfully...",
    "date": "2024-07-19",
    "status": "Published"
  }
]
```

---

### Endpoint: Get Report by ID

**Purpose:** Retrieve specific report details

**HTTP Method:** `GET`  
**Route:** `/api/Report/{id}`  
**Authentication:** Required  
**Authorization:** All authenticated users

#### Path Parameters
```
id: integer (required) - Report ID
```

#### Request Example
```bash
curl -X GET http://localhost:5000/api/Report/1 \
  -H "Authorization: Bearer <token>"
```

#### Success Response (200)
```json
{
  "id": 1,
  "projectId": 1,
  "projectName": "Wheat Cultivation 2024",
  "farmerName": "Ahmed Farm",
  "content": "Wheat cultivation project at 50% completion. Seedling stage completed successfully. Expected final harvest in 3 weeks. Weather conditions optimal. All investors notified of progress.",
  "date": "2024-07-20T10:30:00Z",
  "status": "Published",
  "viewCount": 12,
  "lastUpdated": "2024-07-20T10:30:00Z"
}
```

#### Error Response (404)
```json
{
  "statusCode": 404,
  "message": "Report not found"
}
```

---

### Endpoint: Get Reports by Project

**Purpose:** Retrieve all reports for a specific project

**HTTP Method:** `GET`  
**Route:** `/api/Report/project/{projectId}`  
**Authentication:** Required (public viewing with restrictions)  
**Authorization:** All authenticated users

#### Path Parameters
```
projectId: integer (required) - Project ID
```

#### Request Example
```bash
curl -X GET http://localhost:5000/api/Report/project/1 \
  -H "Authorization: Bearer <token>"
```

#### Success Response (200)
```json
[
  {
    "id": 1,
    "projectName": "Wheat Cultivation 2024",
    "date": "2024-07-20",
    "content": "Wheat cultivation project at 50% completion. Seedling stage completed successfully. Expected final harvest in 3 weeks. Weather conditions optimal.",
    "author": "Ahmed Farm"
  },
  {
    "id": 2,
    "projectName": "Wheat Cultivation 2024",
    "date": "2024-07-10",
    "content": "Land preparation completed. Ready for seedling transplantation next week. Soil tests confirm optimal nutrient levels.",
    "author": "Ahmed Farm"
  },
  {
    "id": 3,
    "projectName": "Wheat Cultivation 2024",
    "date": "2024-06-30",
    "content": "Project kickoff. All investors briefed. Equipment and supplies ordered. Expected arrival within 5 days.",
    "author": "Ahmed Farm"
  }
]
```

#### Frontend Usage
- **Pages/Components:** Project details page, progress timeline
- **Feature:** Investors track project progress through reports

---

### Endpoint: Delete Report

**Purpose:** Remove report from system (Admin only)

**HTTP Method:** `DELETE`  
**Route:** `/api/Report/{id}`  
**Authentication:** Required  
**Authorization:** Admin role only

#### Path Parameters
```
id: integer (required) - Report ID
```

#### Request Example
```bash
curl -X DELETE http://localhost:5000/api/Report/1 \
  -H "Authorization: Bearer <token>"
```

#### Success Response (200)
```
Report deleted successfully
```

#### Error Response (404)
```json
{
  "statusCode": 404,
  "message": "Report not found"
}
```

---

## 10. Admin Module

All endpoints require authentication and Admin role authorization.

### Endpoint: Get Admin Dashboard

**Purpose:** Retrieve comprehensive platform statistics and metrics

**HTTP Method:** `GET`  
**Route:** `/api/Admin/dashboard`  
**Authentication:** Required  
**Authorization:** Admin role only

#### Request Example
```bash
curl -X GET http://localhost:5000/api/Admin/dashboard \
  -H "Authorization: Bearer <token>"
```

#### Success Response (200)
```json
{
  "totalUsers": 156,
  "activeUsers": 142,
  "userBreakdown": {
    "farmers": 45,
    "investors": 85,
    "experts": 12,
    "admins": 2
  },
  "totalProjects": 38,
  "publishedProjects": 28,
  "pendingProjects": 7,
  "rejectedProjects": 3,
  "totalFundingRaised": 5750000,
  "totalInvestments": 2850000,
  "totalReturnsDistributed": 450000,
  "averageRoi": "15.8%",
  "platformRevenue": 125000,
  "platformStatus": "Healthy",
  "recentActivity": {
    "newUsers": 12,
    "newProjects": 4,
    "newInvestments": 8,
    "completedProjects": 2
  },
  "alerts": [
    {
      "severity": "warning",
      "message": "3 projects pending review for more than 7 days"
    },
    {
      "severity": "info",
      "message": "System backup completed successfully"
    }
  ]
}
```

#### Frontend Usage
- **Pages/Components:** Admin dashboard/home page
- **Features:** Platform overview, quick metrics, system health

---

### Endpoint: Get Users

**Purpose:** Retrieve all users with optional filtering

**HTTP Method:** `GET`  
**Route:** `/api/Admin/users`  
**Authentication:** Required  
**Authorization:** Admin role only

#### Query Parameters
```
role: string (optional) - Filter by role: "Farmer", "Investor", "Expert", "Admin"
status: string (optional) - Filter by status: "active", "inactive", "suspended"
search: string (optional) - Search by name or email
```

#### Request Example
```bash
curl "http://localhost:5000/api/Admin/users?role=Farmer&status=active&search=ahmed" \
  -H "Authorization: Bearer <token>"
```

#### Success Response (200)
```json
[
  {
    "id": 1,
    "name": "Ahmed Farm Owner",
    "email": "ahmed@farm.com",
    "role": "Farmer",
    "status": "active",
    "emailConfirmed": true,
    "kycStatus": "verified",
    "joinDate": "2024-01-01",
    "phone": "+201001234567",
    "lastLogin": "2024-07-20T15:30:00Z"
  },
  {
    "id": 5,
    "name": "Farida Agriculture",
    "email": "farida@farm.com",
    "role": "Farmer",
    "status": "active",
    "emailConfirmed": true,
    "kycStatus": "pending",
    "joinDate": "2024-01-15",
    "phone": "+201119876543",
    "lastLogin": "2024-07-19T10:15:00Z"
  }
]
```

---

### Endpoint: Get User by ID

**Purpose:** Retrieve detailed user profile (Admin only)

**HTTP Method:** `GET`  
**Route:** `/api/Admin/users/{id}`  
**Authentication:** Required  
**Authorization:** Admin role only

#### Path Parameters
```
id: integer (required) - User ID
```

#### Request Example
```bash
curl -X GET http://localhost:5000/api/Admin/users/1 \
  -H "Authorization: Bearer <token>"
```

#### Success Response (200)
```json
{
  "id": 1,
  "name": "Ahmed Farm Owner",
  "email": "ahmed@farm.com",
  "role": "Farmer",
  "status": "active",
  "emailConfirmed": true,
  "kycStatus": "verified",
  "phone": "+201001234567",
  "location": "Cairo, Egypt",
  "landDetails": "5 acres of farmland",
  "joinDate": "2024-01-01",
  "lastLogin": "2024-07-20T15:30:00Z",
  "stats": {
    "projectsCreated": 3,
    "projectsPublished": 2,
    "totalFundingRaised": 225000,
    "investorsCount": 12
  }
}
```

---

### Endpoint: Create User

**Purpose:** Admin manually creates new user account

**HTTP Method:** `POST`  
**Route:** `/api/Admin/users`  
**Authentication:** Required  
**Authorization:** Admin role only

#### Request Body Schema
```json
{
  "name": "string (required)",
  "email": "string (required, unique)",
  "password": "string (required, minimum 6 characters)",
  "role": "string (required) - 'Farmer', 'Investor', 'Expert', 'Admin'",
  "phone": "string (optional)",
  "status": "string (optional) - 'active', 'inactive'"
}
```

#### Request Example
```bash
curl -X POST http://localhost:5000/api/Admin/users \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New User",
    "email": "newuser@example.com",
    "password": "secure123",
    "role": "Farmer",
    "phone": "+201001234567"
  }'
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "User created successfully",
  "userId": 157,
  "email": "newuser@example.com"
}
```

---

### Endpoint: Update User

**Purpose:** Admin modifies user profile

**HTTP Method:** `PUT`  
**Route:** `/api/Admin/users/{id}`  
**Authentication:** Required  
**Authorization:** Admin role only

#### Path Parameters
```
id: integer (required) - User ID
```

#### Request Body Schema
```json
{
  "name": "string (optional)",
  "email": "string (optional)",
  "phone": "string (optional)",
  "location": "string (optional)"
}
```

#### Request Example
```bash
curl -X PUT http://localhost:5000/api/Admin/users/1 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+201001234567",
    "location": "Cairo, Egypt"
  }'
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "User updated successfully"
}
```

---

### Endpoint: Update User Status

**Purpose:** Admin changes user account status

**HTTP Method:** `PUT`  
**Route:** `/api/Admin/users/{id}/status`  
**Authentication:** Required  
**Authorization:** Admin role only

#### Path Parameters
```
id: integer (required) - User ID
```

#### Request Body Schema
```json
{
  "status": "string (required) - 'active', 'inactive', 'suspended'"
}
```

#### Request Example
```bash
curl -X PUT http://localhost:5000/api/Admin/users/5/status \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "suspended"
  }'
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "User status updated to suspended"
}
```

#### Possible Statuses
| Status | Meaning |
|--------|---------|
| active | User can login and use platform |
| inactive | User account disabled |
| suspended | User account temporarily suspended (e.g., for KYC review) |

---

### Endpoint: Delete User

**Purpose:** Admin removes user account from platform

**HTTP Method:** `DELETE`  
**Route:** `/api/Admin/users/{id}`  
**Authentication:** Required  
**Authorization:** Admin role only

#### Path Parameters
```
id: integer (required) - User ID
```

#### Request Example
```bash
curl -X DELETE http://localhost:5000/api/Admin/users/5 \
  -H "Authorization: Bearer <token>"
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

#### ⚠️ Considerations
- Verify user has no active investments/contracts before deletion
- Consider archiving instead of hard deletion for audit trail
- Update related records appropriately

---

### Endpoint: Get Projects

**Purpose:** Retrieve all projects with admin filters

**HTTP Method:** `GET`  
**Route:** `/api/Admin/projects`  
**Authentication:** Required  
**Authorization:** Admin role only

#### Query Parameters
```
status: string (optional) - "Pending", "Approved", "Rejected", "Published", "Completed"
crop: string (optional) - Crop type filter
search: string (optional) - Search by name or farmer
```

#### Request Example
```bash
curl "http://localhost:5000/api/Admin/projects?status=Published&crop=Wheat" \
  -H "Authorization: Bearer <token>"
```

#### Success Response (200)
```json
[
  {
    "id": 1,
    "title": "Wheat Cultivation 2024",
    "farmerName": "Ahmed Farm Owner",
    "cropType": "Wheat",
    "status": "Published",
    "fundingRaised": 150000,
    "targetAmount": 150000,
    "investorsCount": 8,
    "publishDate": "2024-02-01",
    "expectedProfit": 45000,
    "completionDate": "2024-07-15"
  }
]
```

---

### Endpoint: Get Reports

**Purpose:** Retrieve all platform reports

**HTTP Method:** `GET`  
**Route:** `/api/Admin/reports`  
**Authentication:** Required  
**Authorization:** Admin role only

#### Request Example
```bash
curl -X GET http://localhost:5000/api/Admin/reports \
  -H "Authorization: Bearer <token>"
```

#### Success Response (200)
```json
[
  {
    "id": 1,
    "projectId": 1,
    "projectName": "Wheat Cultivation 2024",
    "farmerName": "Ahmed Farm",
    "date": "2024-07-20",
    "content": "Project progress report...",
    "views": 12
  }
]
```

---

### Endpoint: Get Platform Settings

**Purpose:** Retrieve system configuration

**HTTP Method:** `GET`  
**Route:** `/api/Admin/settings`  
**Authentication:** Required  
**Authorization:** Admin role only

#### Request Example
```bash
curl -X GET http://localhost:5000/api/Admin/settings \
  -H "Authorization: Bearer <token>"
```

#### Success Response (200)
```json
{
  "platformName": "Agricultural Investment Platform",
  "platformVersion": "1.0",
  "maintenanceMode": false,
  "maxFileUploadSize": 52428800,
  "sessionTimeout": 1440,
  "emailVerificationRequired": true,
  "kycRequired": true,
  "minimumInvestment": 1000,
  "commissionRate": 5,
  "supportEmail": "support@platform.com",
  "supportPhone": "+2001001234567"
}
```

---

### Endpoint: Update Platform Settings

**Purpose:** Modify system configuration

**HTTP Method:** `PUT`  
**Route:** `/api/Admin/settings`  
**Authentication:** Required  
**Authorization:** Admin role only

#### Request Body Schema
```json
{
  "platformName": "string (optional)",
  "maintenanceMode": "boolean (optional)",
  "sessionTimeout": "integer (optional, in minutes)",
  "emailVerificationRequired": "boolean (optional)",
  "kycRequired": "boolean (optional)",
  "minimumInvestment": "decimal (optional)",
  "commissionRate": "decimal (optional)",
  "supportEmail": "string (optional)",
  "supportPhone": "string (optional)"
}
```

#### Request Example
```bash
curl -X PUT http://localhost:5000/api/Admin/settings \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "maintenanceMode": false,
    "sessionTimeout": 1440,
    "minimumInvestment": 1000,
    "commissionRate": 5
  }'
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "Settings updated successfully"
}
```

---

## User Roles & Permissions

| Feature | Farmer | Investor | Expert | Admin |
|---------|--------|----------|--------|-------|
| **Authentication** |
| Register | ✓ | ✓ | ✓ | - |
| Login | ✓ | ✓ | ✓ | ✓ |
| **Account** |
| View Profile | ✓ | ✓ | ✓ | ✓ |
| Update Profile | ✓ | ✓ | ✓ | ✓ |
| Change Password | ✓ | ✓ | ✓ | ✓ |
| **Projects** |
| Create Project | ✓ | - | - | - |
| View All Projects | ✓ | ✓ | ✓ | ✓ |
| View Published | ✓ | ✓ | ✓ | ✓ |
| Update Own Project | ✓ | - | - | - |
| Delete Own Project | ✓ | - | - | - |
| View Pending | - | - | ✓ | ✓ |
| Approve Project | - | - | ✓ | ✓ |
| Reject Project | - | - | ✓ | ✓ |
| Publish Project | - | - | - | ✓ |
| **Investments** |
| Create Investment | - | ✓ | - | - |
| View My Investments | - | ✓ | - | - |
| View Investment History | - | ✓ | - | - |
| View Project Investors | ✓ | - | ✓ | ✓ |
| **Contracts** |
| View Contracts | ✓ | ✓ | - | ✓ |
| Update Status | ✓ | - | - | ✓ |
| Distribute Profit | ✓ | - | - | ✓ |
| **Wallet** |
| View Balance | ✓ | ✓ | - | - |
| Deposit | - | ✓ | - | - |
| Withdraw | - | ✓ | - | - |
| **Reports** |
| Create Report | ✓ | - | - | ✓ |
| View Reports | ✓ | ✓ | ✓ | ✓ |
| Delete Report | - | - | - | ✓ |
| **Admin Features** |
| User Management | - | - | - | ✓ |
| View Dashboard | - | - | - | ✓ |
| Manage Projects | - | - | - | ✓ |
| Platform Settings | - | - | - | ✓ |

---

## Error Handling

### Common Error Scenarios

#### 400 Bad Request
Occurs when request validation fails or business logic constraint is violated.

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    },
    {
      "field": "password",
      "message": "Password must be at least 6 characters"
    }
  ]
}
```

#### 401 Unauthorized
Occurs when token is missing, invalid, or expired.

```json
{
  "statusCode": 401,
  "message": "Unauthorized - Please login"
}
```

**Solutions:**
- Ensure Authorization header is included with Bearer token
- Check token hasn't expired (24 hours)
- Re-authenticate if token invalid

#### 403 Forbidden
Occurs when authenticated user lacks required permissions/role.

```json
{
  "statusCode": 403,
  "message": "You do not have permission to perform this action"
}
```

**Solutions:**
- Verify user has correct role for endpoint
- Check endpoint authorization requirements
- Contact admin for role assignment

#### 404 Not Found
Occurs when requested resource doesn't exist.

```json
{
  "statusCode": 404,
  "message": "Project not found"
}
```

**Solutions:**
- Verify resource ID is correct
- Check resource hasn't been deleted
- Verify user has access to resource

#### 500 Internal Server Error
Occurs when server encounters unexpected error.

```json
{
  "statusCode": 500,
  "message": "An unexpected error occurred"
}
```

**Solutions:**
- Check server logs
- Retry request
- Contact support if persists

---

## Integration Checklist for Frontend Developers

- [ ] Implement JWT token storage (localStorage or cookie)
- [ ] Add token to Authorization header for authenticated requests
- [ ] Handle token expiration and refresh/re-login flow
- [ ] Implement role-based access control (show/hide features by role)
- [ ] Display loading states during API calls
- [ ] Implement error handling with user-friendly messages
- [ ] Add form validation before submission
- [ ] Handle pagination for list endpoints (if applicable)
- [ ] Implement search/filter functionality
- [ ] Add success notifications after operations
- [ ] Implement logout functionality (clear token)
- [ ] Handle authentication on app initialization
- [ ] Test all endpoints in development
- [ ] Implement API rate limiting on frontend
- [ ] Add request timeout handling
- [ ] Implement retry logic for failed requests
- [ ] Add analytics/logging for tracking API usage

---

## Support & Documentation

**Base URL:** `http://localhost:5000/api`  
**API Version:** v1.0  
**Support Email:** support@agricultural-platform.com  
**Documentation:** Full API specs available via Swagger UI (if enabled)

For additional questions or clarifications about specific endpoints, please refer to the Swagger UI documentation or contact the development team.

---

**End of API Documentation**
