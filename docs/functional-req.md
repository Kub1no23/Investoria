<h1 align="center">Investoria</h1>

### Functional Requirements Document (FRD)  
**Version 1.0**  
**Date: 27/10/2025**  
**Author: Zlámal Jakub**

---

## Table of Contents  
1. Introduction  
2. System Overview  
3. Functional Requirements Specification  

---

## 1. Introduction  
This document defines the **functional requirements** for the Investoria application.  
It specifies how the system behaves from a functional perspective — what the user can do, what data is required, and how each feature operates.  

The document extends the [Software Requirements Specification (SRS)](./SRS.md) and provides detailed descriptions necessary for development and testing. 

---

## 2. System Overview  
Investoria is a **cross-platform desktop educational trading simulator** built with **Electron** and **React**. It enables users to practice trading using historical market data, simulate investment strategies, and analyze results.  

The backend is powered by **Node.js + Express**, and it communicates with a **PostgreSQL** database through **Prisma ORM**.  
Prisma provides an abstraction layer for database operations and includes built-in support for user authentication workflows, eliminating the need to “reinvent the wheel.”  
This ensures a more secure, consistent, and efficient development process.  

The initial **pilot version** of the application will be developed in **English**, as it provides better accessibility for a **wider audience**.
Additionally, many technical and financial terms are more naturally expressed in English — translating them would often result in a mix of Czech and English terminology, which could reduce clarity and consistency in the user interface.

### Core Technologies
| Layer | Technology | Purpose |
|-------|-------------|----------|
| Frontend | Electron + React | Cross-platform desktop UI |
| Backend | Node.js + Express | Handles API routes, caching, and business logic |
| Authentication | Better Auth | Secure user authentication, session handling, and token management |
| Database | PostgreSQL (via Prisma ORM) | Persistent storage for users, trades, groups, and statistics |
| Market Data | Polygon.io | Historical financial data source |
| Charting | TradingView Lightweight Charts, ApexCharts | Visualization of trades and performance |

The application requires an **active internet connection** to fetch market data and authenticate users.  
If the client is offline, the system will not start and will display an error message prompting the user to reconnect.

---

## 3. Functional Requirements Specification  

### 3.1 User Authentication (Login & Registration)
If the user is connected to the internet, the app will prompt them to either log in or register.
Below is a table showing the required input fields for each process:  

#### Login and Registration Form Input

| Field | Registration | Login | Description |
|--------|:------:|:-------------:|-------------|
| **Username** | ✅ | ❌ | Unique identifier for the user |
| **Email** | ✅ | ✅ | Used for verification and recovery |
| **Password** | ✅ | ✅ | Must be at least 8 characters, stored hashed |
| **Full Name** | ✅ | ❌ | Displayed in user profile |

After a successful login or registration, the system generates a **JWT (JSON Web Token)** managed through the Better Auth library.  
This token contains encrypted information about the user’s identity and session validity.

The token is **stored client-side** — either temporarily during the session or persistently if the user chooses the “Remember me” option.  
When stored persistently, the application automatically authenticates the user on the next startup without requiring manual login again.

Since JWT authentication is **stateless**, the backend does not store any session information; instead, it validates the token on each request using a secure secret key.  
This approach improves performance and scalability while maintaining strong security and flexibility across different environments.

#### Functional Behaviors
- Passwords are securely hashed using the authentication provider (Better Auth) before being stored in the database
- Email and username uniqueness is enforced at the database level
- Invalid credentials return an error message without exposing sensitive information
- Upon successful authentication, a JWT token is generated and stored locally (session or persistent based on user preference). 
- Users can manually log out, which clears the token from local storage
- The backend validates all requests using the provided JWT signature but does not maintain server-side session state

### Authentication Flow

| Register | Login |
|----------|-------|
| User enters registration info: username, email, password, full name | User enters login info: username/email and password |
| Frontend sends HTTP POST request to backend with user data | Frontend sends HTTP GET request to backend with credentials |
| Backend orders database to create a user | Backend tries to retrieve user from database and verify password hash |
| Backend generates JWT token or returns error message | Backend generates JWT token or returns error message |
| Token or error is sent back to frontend | Token or error is sent back to frontend |
| If user selects "Remember Me," token is stored on client for future automatic login | If user selects "Remember Me," token is stored on client for future automatic login |



---

