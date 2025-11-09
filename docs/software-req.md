<h1 align="center">Investoria</h1>

### Software Requirements Specification (SRS)  
**Version 1.1**  
**Date: 02/10/2025**  
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
- **Purpose:** This document describes the software requirements for Investoria, an educational platform that enables users to learn investing through simulations with historical market data.  
- **Scope:** The application will allow users to practice trading, track performance, and collaborate in groups. It is not a full investment service but rather an educational look-alike platform.  

    For details on the business goals, stakeholders, and high-level scope, see the [Business Requirements Document](./business-spec.md).  

---

## 2. Overall Description
- **Product Perspective:**  
  Investoria will be a cross-platform desktop application available for Windows, macOS, and major Linux distributions. It will:   
  - provide a graphical user interface for users.  
  - establish a connection to a backend service responsible for processing requests and handling business logic.  
  - pair the backend with a PostgreSQL database to store user accounts, trades, and group data.  
  - rely on **Polygon.io** APIs to deliver historical market data. Polygon provides ~99.99% availability but enforces strict request-per-minute limits, so the backend will implement **caching** for efficient use of API calls.  
  - in the first version, only **backtesting** with historical data will be supported. Real-time simulation may be considered later if the API plan is upgraded.  

- **User Characteristics:** Students, beginner investors, and individuals interested in finance. Users are expected to have basic computer literacy.  

- **Constraints:**  
  - The system depends on Polygon.io APIs to provide market data. If those services are unavailable, related features will be limited.  
  - API request limits may restrict the amount of data fetched at once; caching strategies will be used to mitigate this.  

---

## 3. Functional Requirements

### 3.1 User Registration & Authentication
**Will:**
- allow users to register using an email, username, and password  
- store passwords securely using hashing  
- include email, username, and display name in user accounts, all stored in the database  
- allow users to log in and log out of their accounts  
- use token-based authentication to manage user sessions securely  

### 3.2 Historical Data Backtesting
**Will:**
- allow users to select an asset and simulate trades on historical data provided by Polygon.io  
- enable users to “go back in time” to practice on chosen assets  
- track the performance of each simulated trade (e.g., profit/loss, success rate)  
- allow users to review their past trades and outcomes for learning purposes  
- visualize candlestick data using **TradingView Lightweight Charts**  

### 3.3 Group Collaboration
**Will:**
- allow users to create groups and join existing groups  
- track collective performance of all group members  
- enable users to share strategies, insights, and feedback within their groups  
- provide a chat feature for group communication  

### 3.4 Performance Tracking
**Will:**
- provide individual and group statistics, including success rates and portfolio performance  
- visualize statistics and progress over time using **ApexCharts**  

---

## 4. Non-Functional Requirements
- **Performance:** The system should handle a reasonable number of concurrent users typical for a demo. Caching will be used to reduce API load.  
- **Reliability & Availability:** Polygon.io provides ~99.99% uptime; the system’s availability will depend on this external service.  
- **Security:** User passwords must be hashed, user data must only be accessible to authenticated users.  
- **Usability:** The interface should be simple and intuitive for beginners.  
- **Scalability:** The architecture should allow future feature extensions and support an increased number of users if scaled on a cloud platform.  

---

## 5. External Interfaces
- **User Interface:** Electron desktop application GUI with charting via **TradingView Lightweight Charts** and statistics visualization via **ApexCharts**.  
- **Software Interfaces:** Express routes, PostgreSQL database management system, Polygon.io APIs for historical market data.  
- **Communication Interfaces:** HTTPS requests to APIs and backend, WebSocket for group chat, JSON for sending/receiving data.  

---

## 6. Assumptions & Dependencies
- Users have reliable internet access.  
- The application depends on **Polygon.io** APIs for historical market data. Rate limits will be handled via caching.  
- The system will use the following libraries/frameworks to support development:  
  - **Express.js** for backend routes and API handling  
  - **Electron** for desktop application framework  
  - **PostgreSQL** as the database system  
  - **TradingView Lightweight Charts** for candlestick chart visualization  
  - **ApexCharts** for statistical charts and progress tracking  
  - Other standard Node.js libraries as needed for data processing and communication  
- In future versions, if time and resources allow, an upgrade to a higher Polygon.io plan could enable delayed real-time data and WebSocket streaming.  

---

