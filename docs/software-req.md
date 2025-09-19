<h1 align="center">Investoria</h1>

### Software Requirements Specification (SRS)  
**Version 1.0**  
**Date: 19/09/2025**  
**Author: Zlámal Jakub**

---

## Table of Contents
1. Introduction  
2. Overall Description  
3. Functional Requirements  
4. Non-Functional Requirements  
5. External Interfaces  
6. Assumptions & Dependencies  

---

## 1. Introduction
- **Purpose:** This document describes the software requirements for Investoria, an educational platform that enables users to learn investing through simulations with real-time as well as historical market data.  
- **Scope:** The application will allow users to practice trading, track performance, and collaborate in groups. It is not a full investment service but rather an educational look-alike platform.
  
    For details on the business goals, stakeholders, and high-level scope, see the [Business Requirements Document](./business-spec.md).  

---

## 2. Overall Description
- **Product Perspective:**  
  Investoria will be a cross-platform desktop application available for Windows, macOS, and major Linux distributions and will:   
  - provide a graphical user interface for users.  
  - Establish a connection to a backend service responsible for processing requests and handling business logic.  
  - The backend is going to be paired with a database to store user accounts, trades, and group data.  
  - External APIs are going be to used to deliver real-time and historical market data.  
- **User Characteristics:** Students, beginner investors, and individuals interested in finance. Users are expected to have basic computer literacy.  
- **Constraints:**  
  - The system depends on third-party APIs to provide real-time and historical market data. If those services are unavailable, related features will be limited.  

---

## 3. Functional Requirements

### 3.1 User Registration & Authentication
**Will:**
- allow users to register using an email, username, and password  
- store passwords securely using hashing  
- include email, username, and display name in user accounts, all stored in the database  
- allow users to log in and log out of their accounts
- use token-based authentication to manage user sessions securely


### 3.2 Historical & Real-Time Data Simulation
**Will:**
- allow users to select an asset and simulate trades on historical data  
- enable users to “go back in time” to practice on chosen assets  
- track the performance of each simulated trade (e.g., profit/loss, success rate)  
- allow users to review their past trades and outcomes for learning purposes  
- provide simplified real-time market data with a short delay

### 3.3 Group Collaboration
**Will:**
- allow users to create groups and join existing groups  
- track collective performance of all group members  
- enable users to share strategies, insights, and feedback within their groups  
- provide a chat feature for group communication  

### 3.4 Performance Tracking
**Will:**
- provide individual and group statistics, including success rates and portfolio performance  
- allow users to view summaries of their own and their group’s historical performance over time  


---

## 4. Non-Functional Requirements

- **Performance:** The system should handle a reasonable number of concurrent users typical for a demo. Performance scaling can be adjusted when deployed on cloud.  
- **Reliability & Availability:** The system depends on external APIs for market data. Availability should be above 99%.  
- **Security:** User passwords must be encrypted; user data must only be accessible to authenticated users.  
- **Usability:** The interface should be simple and intuitive for beginners. 
- **Scalability:** The architecture should allow future feature extensions and support an increased number of users if scaled on a cloud platform.  


---

## 5. External Interfaces
- **User Interface:** Electron desktop application GUI.  
- **Software Interfaces:** Express routes, PostgreSQL database management system, external APIs for market data.
- **Communication Interfaces:** HTTPS requests to APIs and backend, WebSocket for real-time updates and group chat, JSON for sending/receiving data.

---

## 6. Assumptions & Dependencies
- Users have reliable internet access.  
- The application depends on third-party APIs for financial data. If unavailable, certain features may be limited.  
- The system will use the following libraries/frameworks to support development:  
  - **Express.js** for backend routes and API handling  
  - **Electron** for desktop application framework  
  - **PostgreSQL** as the database system  
  - **Plotly.js** for displaying charts and visualizing portfolio performance  
  - Other standard Node.js libraries as needed for data processing and communication  
