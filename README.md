# Zerodha Stock Trading Platform

A full-stack stock trading dashboard inspired by Zerodha, built to simulate stock trading with user authentication, live market prices, order management, holdings, positions, and funds management.

## 🚀 Features

- User Signup and Login
- JWT-based Authentication
- Secure Password Hashing with bcrypt
- Live Stock Market Prices
- Stock Watchlist
- Buy and Sell Stocks
- Order History
- Holdings Management
- Positions Tracking
- Real-time Profit & Loss Calculation
- Funds Management
- Add Funds
- Withdraw Funds
- User-specific Trading Data
- MongoDB Database Integration
- Automatic Dashboard Updates
- Logout Functionality

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router
- Axios
- JavaScript
- HTML
- CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Axios

### APIs
- Yahoo Finance API for live stock prices

## 📂 Project Structure

```text
ZERODHA
│
├── backend
│   ├── model
│   ├── schemas
│   ├── index.js
│   ├── package.json
│   └── .env
│
├── dashboard
│   ├── src
│   │   └── components
│   └── package.json
│
├── frontend
│
├── .gitignore
└── README.md