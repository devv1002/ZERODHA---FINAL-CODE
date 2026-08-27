# Installation Guide

This guide explains how to clone, configure, install, and run the
Zerodha Stock Trading Platform locally.

## 1. Prerequisites

Install the following before starting:

-   Node.js
-   npm
-   Git
-   MongoDB Atlas account
-   VS Code (recommended)

Check the installations:

``` bash
node -v
npm -v
git --version
```

## 2. Clone the Repository

Open Terminal and run:

``` bash
git clone https://github.com/devv1002/ZERODHA---FINAL-CODE.git
cd ZERODHA---FINAL-CODE
```

## 3. Backend Setup

Move into the backend folder:

``` bash
cd backend
```

Install backend dependencies:

``` bash
npm install
```

## 4. Configure Environment Variables

Inside the `backend` folder, create a file named `.env`.

Add:

``` env
MONGO_URL=your_mongodb_connection_string
TWELVE_DATA_API_KEY=your_api_key
JWT_SECRET=your_secret_key
PORT=3002
```

Replace the placeholder values with your own credentials.

**Important:** Never upload `.env` or any API keys/passwords to GitHub.

## 5. Start the Backend

From the `backend` directory:

``` bash
node index.js
```

You should see messages similar to:

``` text
DB connected!
App started on port 3002
```

Backend:

``` text
http://localhost:3002
```

Keep this terminal running.

## 6. Dashboard Setup

Open a **new terminal window**.

From the project directory:

``` bash
cd ZERODHA---FINAL-CODE/dashboard
```

Install dependencies:

``` bash
npm install
```

Start the React dashboard:

``` bash
npm start
```

Dashboard:

``` text
http://localhost:3001
```

Open this address in your browser.

## 7. Run the Complete Application

Two terminals should be running.

### Terminal 1 --- Backend

``` bash
cd ZERODHA---FINAL-CODE/backend
node index.js
```

### Terminal 2 --- Dashboard

``` bash
cd ZERODHA---FINAL-CODE/dashboard
npm start
```

Then open:

``` text
http://localhost:3001
```

## 8. Application Usage

1.  Create an account using **Signup**.
2.  Login using your email and password.
3.  Open the Dashboard.
4.  View the stock watchlist.
5.  Select a stock.
6.  Place a **BUY** or **SELL** order.
7.  View orders in **Orders**.
8.  View owned stocks in **Holdings**.
9.  View positions in **Positions**.
10. View balance and fund information in **Funds**.

## 9. Database

The application uses MongoDB to store:

-   User accounts
-   Orders
-   Holdings
-   Positions
-   Funds

Configure the MongoDB connection in:

``` text
backend/.env
```

## 10. Live Stock Data

The application retrieves stock market data for the watchlist.

Required API credentials should be configured in:

``` text
backend/.env
```

Do not expose API keys publicly.

## 11. Troubleshooting

### Backend dependencies missing

``` bash
cd backend
npm install
node index.js
```

### Dashboard dependencies missing

``` bash
cd dashboard
npm install
npm start
```

### MongoDB connection error

Check:

-   `MONGO_URL` in `backend/.env`
-   MongoDB Atlas availability
-   MongoDB Atlas Network Access/IP settings
-   Database username and password

### Port 3002 already in use

Stop the existing backend process and start the backend again.

### Dashboard does not open

Make sure the React development server is running and check that port
`3001` is available.

## 12. Security

Never commit or share:

-   MongoDB connection strings
-   API keys
-   JWT secrets
-   Database passwords
-   Other private credentials

Keep sensitive configuration inside:

``` text
backend/.env
```

## 13. Project URLs

GitHub Repository:

https://github.com/devv1002/ZERODHA---FINAL-CODE

Local Dashboard:

http://localhost:3001

Local Backend:

http://localhost:3002

## 14. Project Structure

``` text
ZERODHA---FINAL-CODE/
│
├── backend/
│   ├── model/
│   ├── .env
│   ├── index.js
│   └── package.json
│
├── dashboard/
│   ├── public/
│   ├── src/
│   └── package.json
│
├── frontend/
│
├── .gitignore
└── INSTALLATION.md
```

`node_modules` and `.env` are local files and should not be committed to
GitHub.
