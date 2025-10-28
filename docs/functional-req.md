<h1 align="center">Investoria</h1>

### Functional Requirements Document (FRD)  
**Version 1.0**  
**Date: 28/10/2025**  
**Author: Zlámal Jakub**

---

## Table of Contents  
1. Introduction  
2. System Overview  
3. Functional Requirements Specification  
4. Technical details

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


### 3.2 Historical Data Backtesting

Users lands on the homepage and sees a list of available stocks for backtesting. Upon selecting a stock, a candlestick chart is loaded using **TradingView Lightweight Charts**. The user is then prompted to choose a historical time period they wish to backtest. Once the desired range is confirmed, the system loads the corresponding stock data from the cache or directly from the **Polygon.io** API (if not cached).  

Historical stock data is fetched, as previously mentioned, from **Polygon.io** API and cached locally. Due to free plan limitations (end-of-day data, 5 API calls per minute), data is updated in batch every few minutes after new end-of-day data becomes available. The cached JSON is stored in **PostgreSQL** using a JSONB column for fast queries and filtering by symbol and timestamp.

Inside the backtesting mode, the **Execute Window** opens to place simulated trades (buy/sell stops or limits). This window allows them to set trade parameters such as entry price, quantity, stop-loss, and take-profit levels.  
All backtesting trade execution logic runs on the **frontend**, ensuring fast feedback and responsiveness.  

When a trade is closed, either manually by the user or automatically via stop-loss/take-profit logic, the result is sent via an **HTTP POST request** to the backend. The backend processes the data and writes it into the database under the user’s specific backtesting account. This way, only finalized trades are stored, minimizing unnecessary traffic and ensuring clean record-keeping.

#### Backtesting Account Flow

| Step | Description |
|------|-------------|
| 1 | User enters backtesting mode after selecting a historical date range for the specific symbol. |
| 2 | In the execute window the user places a simulated trade (long/short). |
| 3 | Frontend handles trade logic (execution, SL/TP checks, manual close). |
| 4 | Once a trade is closed, the result (entry price, exit price, profit/loss) is sent via HTTP POST request to the BE. |
| 5 | Backend validates and writes the trade record into the user’s backtesting account in the PostgreSQL database. |

### 3.3 Performance Tracking  

The **Performance Tracking** module is responsible for analyzing and visualizing user performance based on data stored in the database. Each user will have the option to select which account they want to display statistics for. Once the account is chosen, the frontend will send an HTTP request to the backend, which retrieves the relevant trading data from the database and sends it back as a JSON response.  

On the client side, this data will be processed and displayed through various charts and performance metrics using **ApexCharts**. These charts will allow users to visualize their trading results, including overall profitability, success rate, total number of trades, and other important performance indicators.  

The data visualization will be interactive — allowing the user to view time-based comparisons, identify trends, and evaluate the consistency of their performance over time. This system is designed to remain flexible, meaning it can easily be extended in future versions to handle **real-time performance tracking**.

#### Performance Tracking Flow  

| Step | Description |
|------|--------------|
| 1 | User selects which account’s statistics they wish to view. |
| 2 | Frontend sends an HTTP GET request to the backend containing the selected account ID. |
| 3 | Backend queries the database for the relevant performance data. |
| 4 | Data is formatted into a JSON response and sent back to the frontend. |
| 5 | Frontend processes and visualizes the data using **ApexCharts** components. |
| 6 | User views interactive charts and metrics summarizing their performance. |

### 3.4 Group Collaboration

Investoria allows users to create and join groups, enabling collaborative learning and strategy sharing.  
Each user can choose which of their **accounts** they want to share within a group. Members can then view each other’s performance, open and closed trades, and overall group statistics.  

The purpose of groups is to support **collaborative learning** — users can compare results, discuss trading strategies, and learn from the performance of others in a simulated, risk-free environment.  

When a user opens a group, the system fetches data from all group members’ shared accounts, compiles it, and displays both **individual results** and **collective group performance**.  
Additionally, users can communicate with each other in real time using a built-in **chat feature** based on WebSockets.  

Messages will be stored persistently in the PostgreSQL database within a dedicated table for group chats.  
This ensures message history remains available even after users disconnect, while keeping all application data centralized in one system.

#### Group Collaboration Flow

| Step | Description |
|------|-------------|
| 1 | User navigates to the Groups section and either creates a new group or joins an existing one using a `group_id`. |
| 2 | User selects which backtesting account to share with the group. |
| 3 | Backend fetches performance and trade data from all shared group accounts. |
| 4 | Frontend aggregates and visualizes both individual and group statistics. |
| 5 | Real-time group chat is established via WebSocket connection. |
| 6 | If chat persistence is enabled, messages are stored in a centralized `group_messages` table within PostgreSQL, indexed by `group_id` for efficient retrieval. |

### 3.5 Account Settings Management  

The **Account Settings Management** module allows users to update personal information and configure their account preferences. This includes changing basic fields such as **username, full name, and email**, as well as potential future extensions like **theme selection, two-factor authentication (2FA)**, or other customizable settings.  

The workflow for updating account settings follows a clear process to ensure data integrity and user feedback:  

#### Account Settings Update Flow  

| Step | Description |
|------|-------------|
| 1 | User selects a setting they wish to change (e.g., email or full name). |
| 2 | User inputs or selects the new value for the given setting. |
| 3 | Frontend submits the change to the backend via an HTTP POST request. |
| 4 | Backend performs necessary validation (e.g., checks if the new email or username is unique, verifies 2FA codes if applicable). |
| 5 | If validation passes, backend updates the database or other services accordingly. |
| 6 | Backend sends a response back to the frontend indicating success or failure, with relevant feedback. |
| 7 | Frontend displays confirmation or error messages to the user based on the backend response. |

---

## 4. Technical details

### 4.1 Database Diagram

The database schema for Investoria is visualized in [ERD Diagram](docs/assets/ERD.svg). It includes the following main tables:  

- **users** – stores user account information.  
- **groups** – defines collaborative groups.  
- **messages** – holds group chat messages.  
- **group_members** – maps users to groups.  
- **accounts** – contains user trading accounts and their balances.  
- **trades** – records executed trades and related details.  

This structure supports user management, trading simulations, and group collaboration features.

---
