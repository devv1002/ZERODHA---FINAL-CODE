# Zerodha Stock Trading Platform

A full-stack stock trading platform inspired by Zerodha, built to simulate stock market trading with user authentication, live market prices, watchlist management, order management, holdings, positions, and funds management.

## 🚀 Live Demo

- **Trading Dashboard:** https://zerodha-dashboard-spuu.onrender.com
- **Backend API:** https://zerodha-backend-8cg4.onrender.com

> The application is deployed on Render. Free-tier services may take a few seconds to wake up after inactivity.

## ✨ Features

### 🔐 Authentication

- User signup and login
- JWT-based authentication
- Secure password hashing using bcrypt
- Protected API routes
- User-specific trading data
- Logout functionality

### 📈 Market Data

- Live stock market prices
- Stock watchlist
- Market price updates using Yahoo Finance
- Support for multiple Indian stocks

### 💹 Trading

- Buy stocks
- Sell stocks
- Order validation
- Order history
- User-specific orders
- Automatic holdings and positions updates

### 💰 Portfolio Management

- Holdings tracking
- Positions tracking
- Average purchase price calculation
- Current market value
- Profit & Loss calculation
- Daily market movement
- Portfolio summary

### 💵 Funds Management

- Available balance tracking
- Add funds
- Withdraw funds
- Automatic balance updates
- User-specific funds

### 🖥️ Dashboard

- Zerodha-inspired interface
- Watchlist
- Dashboard summary
- Orders
- Holdings
- Positions
- Funds
- Buy/Sell action windows
- Responsive UI

## ��️ Tech Stack

### Frontend

- React.js
- React Router
- Axios
- JavaScript
- HTML5
- CSS3

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt

### Market Data

- Yahoo Finance

### Deployment

- Render
- MongoDB Atlas

## 🏗️ Application Architecture

```text
                    ┌─────────────────────┐
                    │      React UI       │
                    │     Dashboard       │
                    └──────────┬──────────┘
                               │
                               │ Axios / REST API
                               ▼
                    ┌─────────────────────┐
                    │   Node.js +         │
                    │   Express Backend   │
                    └───────┬─────┬───────┘
                            │       │
                 ┌──────────┘       └─────────────┐
                 ▼                                ▼
        ┌─────────────────┐             ┌─────────────────┐
        │   MongoDB Atlas │             │   Yahoo Finance │
        │   User & Trade  │             │   Market Data   │
        │      Data       │             └─────────────────┘
        └─────────────────┘
