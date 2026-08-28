require("dotenv").config();

let yahooFinance;


const jwt = require("jsonwebtoken");

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const bcrypt = require("bcrypt");

const { HoldingsModel } = require("./model/HoldingsModel");

const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");

const { UserModel } = require("./model/UserModel");

const { FundsModel } = require("./model/FundsModel");

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

const app = express();

app.use(cors());
app.use(bodyParser.json());

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Access denied. Please login first.",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        message: "Invalid or expired token",
      });
    }

    req.user = user;
    next();
  });
};

// app.get("/addHoldings", authenticateToken, async (req, res) => {
//   let tempHoldings = [
//     {
//       name: "BHARTIARTL",
//       qty: 2,
//       avg: 538.05,
//       price: 541.15,
//       net: "+0.58%",
//       day: "+2.99%",
//     },
//     {
//       name: "HDFCBANK",
//       qty: 2,
//       avg: 1383.4,
//       price: 1522.35,
//       net: "+10.04%",
//       day: "+0.11%",
//     },
//     {
//       name: "HINDUNILVR",
//       qty: 1,
//       avg: 2335.85,
//       price: 2417.4,
//       net: "+3.49%",
//       day: "+0.21%",
//     },
//     {
//       name: "INFY",
//       qty: 1,
//       avg: 1350.5,
//       price: 1555.45,
//       net: "+15.18%",
//       day: "-1.60%",
//       isLoss: true,
//     },
//     {
//       name: "ITC",
//       qty: 5,
//       avg: 202.0,
//       price: 207.9,
//       net: "+2.92%",
//       day: "+0.80%",
//     },
//     {
//       name: "KPITTECH",
//       qty: 5,
//       avg: 250.3,
//       price: 266.45,
//       net: "+6.45%",
//       day: "+3.54%",
//     },
//     {
//       name: "M&M",
//       qty: 2,
//       avg: 809.9,
//       price: 779.8,
//       net: "-3.72%",
//       day: "-0.01%",
//       isLoss: true,
//     },
//     {
//       name: "RELIANCE",
//       qty: 1,
//       avg: 2193.7,
//       price: 2112.4,
//       net: "-3.71%",
//       day: "+1.44%",
//     },
//     {
//       name: "SBIN",
//       qty: 4,
//       avg: 324.35,
//       price: 430.2,
//       net: "+32.63%",
//       day: "-0.34%",
//       isLoss: true,
//     },
//     {
//       name: "SGBMAY29",
//       qty: 2,
//       avg: 4727.0,
//       price: 4719.0,
//       net: "-0.17%",
//       day: "+0.15%",
//     },
//     {
//       name: "TATAPOWER",
//       qty: 5,
//       avg: 104.2,
//       price: 124.15,
//       net: "+19.15%",
//       day: "-0.24%",
//       isLoss: true,
//     },
//     {
//       name: "TCS",
//       qty: 1,
//       avg: 3041.7,
//       price: 3194.8,
//       net: "+5.03%",
//       day: "-0.25%",
//       isLoss: true,
//     },
//     {
//       name: "WIPRO",
//       qty: 4,
//       avg: 489.3,
//       price: 577.75,
//       net: "+18.08%",
//       day: "+0.32%",
//     },
//   ];

//   tempHoldings.forEach((item) => {
//     let newHolding = new HoldingsModel({
//       userId: req.user.id,
//       name: item.name,
//       qty: item.qty,
//       avg: item.avg,
//       price: item.price,
//       net: item.net,
//       day: item.day,
//     });

//     newHolding.save();
//   });
//   res.send("Done!");
// });

// app.get("/addPositions",authenticateToken, async (req, res) => {
//   let tempPositions = [
//     {
//       product: "CNC",
//       name: "EVEREADY",
//       qty: 2,
//       avg: 316.27,
//       price: 312.35,
//       net: "+0.58%",
//       day: "-1.24%",
//       isLoss: true,
//     },
//     {
//       product: "CNC",
//       name: "JUBLFOOD",
//       qty: 1,
//       avg: 3124.75,
//       price: 3082.65,
//       net: "+10.04%",
//       day: "-1.35%",
//       isLoss: true,
//     },
//   ];

//   tempPositions.forEach((item) => {
//     let newPosition = new PositionsModel({
//       userId: req.user.id,
//       product: item.product,
//       name: item.name,
//       qty: item.qty,
//       avg: item.avg,
//       price: item.price,
//       net: item.net,
//       day: item.day,
//       isLoss: item.isLoss,
//     });

//     newPosition.save();
//   });

//   res.send("Done!");
// });

app.get("/allHoldings", authenticateToken, async (req, res) => {
  try {
    const allHoldings = await HoldingsModel.find({
      userId: req.user.id,
    });

    res.json(allHoldings);

  } catch (err) {
    console.log("Holdings error:", err);

    res.status(500).json({
      message: "Error fetching holdings",
    });
  }
});

app.get("/allPositions", authenticateToken, async (req, res) => {
  try {
    const allPositions = await PositionsModel.find({
      userId: req.user.id,
    });

    res.json(allPositions);

  } catch (err) {
    console.log("Positions error:", err);

    res.status(500).json({
      message: "Error fetching positions",
    });
  }
});

app.post("/newOrder",authenticateToken, async (req, res) => {
  try {
    const { name, qty, price, mode } = req.body;

    const quantity = Number(qty);
    const stockPrice = Number(price);

    if (!name || quantity <= 0 || stockPrice <= 0 || !mode) {
      return res.status(400).json({
        message: "Invalid order details",
      });
    }

    let funds = await FundsModel.findOne({
      userId: req.user.id,
    });

    if (!funds) {
      funds = new FundsModel({
        userId: req.user.id,
        balance: 100000,
        usedMargin: 0,
        openingBalance: 100000,
        payin: 0,
        payout: 0,
      });
    
      await funds.save();
    }

    const orderValue = quantity * stockPrice;

    // ================= BUY =================

    if (mode === "BUY") {

      if (orderValue > funds.balance) {
        return res.status(400).json({
          message: `Insufficient funds. Available balance: ₹${funds.balance.toFixed(2)}`,
        });
      }

      const existingHolding =
      await HoldingsModel.findOne({
        userId: req.user.id,
        name,
      });

      if (existingHolding) {

        const oldQty = existingHolding.qty;
        const oldAvg = existingHolding.avg;

        const newQty = oldQty + quantity;

        const newAvg =
          (oldQty * oldAvg + quantity * stockPrice) /
          newQty;

        existingHolding.qty = newQty;
        existingHolding.avg = newAvg;
        existingHolding.price = stockPrice;

        await existingHolding.save();

      } else {

        const newHolding = new HoldingsModel({
          userId: req.user.id,
          name,
          qty: quantity,
          avg: stockPrice,
          price: stockPrice,
          net: "0.00%",
          day: "0.00%",
        });

        await newHolding.save();
      }

      // Deduct money
      funds.balance -= orderValue;
      funds.usedMargin = (funds.usedMargin || 0) + orderValue;

      await funds.save();

      // ================= UPDATE POSITION =================

      const existingPosition =
        await PositionsModel.findOne({
          userId: req.user.id,
          name,
        });
      if (existingPosition) {

      const oldQty = existingPosition.qty;
      const oldAvg = existingPosition.avg;

      const newQty = oldQty + quantity;

      const newAvg =
        (oldQty * oldAvg + quantity * stockPrice) /
        newQty;

      existingPosition.qty = newQty;
      existingPosition.avg = newAvg;
      existingPosition.price = stockPrice;

      await existingPosition.save();

      } else {

        const newPosition = new PositionsModel({
          userId: req.user.id,
          product: "CNC",
          name,
          qty: quantity,
          avg: stockPrice,
          price: stockPrice,
          net: "0.00%",
          day: "0.00%",
          isLoss: false,
        });

      await newPosition.save();
      }
    }

    

    // ================= SELL =================

    else if (mode === "SELL") {

      const existingHolding = await HoldingsModel.findOne({
        userId: req.user.id,
        name,
      });

      if (!existingHolding) {
        return res.status(400).json({
          message: `You don't own any shares of ${name}`,
        });
      }

      if (quantity > existingHolding.qty) {
        return res.status(400).json({
          message: `You only own ${existingHolding.qty} shares of ${name}`,
        });
      }

      const costOfSoldShares = existingHolding.avg * quantity;

      const remainingQty =
        existingHolding.qty - quantity;

      if (remainingQty === 0) {

        await HoldingsModel.deleteOne({
          userId: req.user.id,
          name,
        });

      } else {

        existingHolding.qty = remainingQty;
        existingHolding.price = stockPrice;

        await existingHolding.save();
      }

      // ================= UPDATE POSITION =================

      const existingPosition =
        await PositionsModel.findOne({
          userId: req.user.id,
          name,
        });

      if (existingPosition) {

      const remainingPositionQty =
        existingPosition.qty - quantity;

      if (remainingPositionQty <= 0) {

        await PositionsModel.deleteOne({
          userId: req.user.id,
          name,
        });
      } else {

        existingPosition.qty = remainingPositionQty;
        existingPosition.price = stockPrice;

        await existingPosition.save();
      }
      }

      // Add sale proceeds to cash
      funds.balance += orderValue;

      // Remove original investment from used margin
      funds.usedMargin -= costOfSoldShares;

      if (funds.usedMargin < 0) {
        funds.usedMargin = 0;
      }

      await funds.save();
    }

    else {
      return res.status(400).json({
        message: "Invalid order mode",
      });
    }

    // ================= SAVE ORDER =================

    const newOrder = new OrdersModel({
      userId: req.user.id,
      name,
      qty: quantity,
      price: stockPrice,
      mode,
      date: new Date(),
    });

    await newOrder.save();

    res.json({
      message: "Order saved successfully!",
      order: newOrder,
      funds: {
        balance: funds.balance,
      },
    });

  } catch (err) {

    console.log("Order error:", err);

    res.status(500).json({
      message: "Error saving order",
      error: err.message,
    });
  }
});

app.get("/allOrders", authenticateToken, async (req, res) => {
  try {
    const orders = await OrdersModel.find({
      userId: req.user.id,
    }).sort({
      createdAt: -1,
    });

    res.json(orders);

  } catch (err) {
    console.log("Orders error:", err);

    res.status(500).json({
      message: "Error fetching orders",
      error: err.message,
    });
  }
});

// app.post("/signup", async (req, res) => {
//   try {
//     const { username, email, password } = req.body;

//     const newUser = new UserModel({
//       username: username,
//       email: email,
//       password: password,
//     });

//     await newUser.save();

//     res.json({
//       message: "User registered successfully!",
//       user: newUser,
//     });
//   } catch (err) {
//     res.status(500).json({
//       message: "Error registering user",
//       error: err.message,
//     });
//   }
// });

app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.json({
      message: "User registered successfully!",
      user: {
        username: newUser.username,
        email: newUser.email,
      },
    });

  } catch (err) {
    console.log("Signup error:", err);

    res.status(500).json({
      message: "Error registering user",
      error: err.message,
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isPasswordCorrect =
      await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    
    res.json({
      message: "Login successful!",
      token,
      user: {
        username: user.username,
        email: user.email,
      },
    });

  } catch (err) {
    console.log("Login error:", err);

    res.status(500).json({
      message: "Error logging in",
      error: err.message,
    });
  }
});

app.get("/funds",authenticateToken, async (req, res) => {
  try {
    let funds = await FundsModel.findOne({
      userId: req.user.id,
    });

    if (!funds) {
      funds = new FundsModel({
        userId: req.user.id,
        balance: 100000,
        usedMargin: 0,
        openingBalance: 100000,
        payin: 0,
        payout: 0,
      });
    
      await funds.save();
    }


  const availableMargin = funds.balance;

res.json({
  balance: funds.balance,
  usedMargin: funds.usedMargin || 0,
  availableMargin: availableMargin,
  openingBalance: funds.openingBalance,
  payin: funds.payin,
  payout: funds.payout,
});

  } catch (err) {
    console.log("Funds error:", err);

    res.status(500).json({
      message: "Error fetching funds",
      error: err.message,
    });
  }
});

app.post("/addFunds",authenticateToken, async (req, res) => {
  try {
    const amount = Number(req.body.amount);

    if (!amount || amount <= 0) {
      return res.status(400).json({
        message: "Enter a valid amount",
      });
    }

    let funds = await FundsModel.findOne({
      userId: req.user.id,
    });

    if (!funds) {
      funds = new FundsModel({
        userId: req.user.id,
        balance: 100000,
        usedMargin: 0,
        openingBalance: 100000,
        payin: 0,
        payout: 0,
      });
    }

    funds.balance += amount;
    funds.payin += amount;

    await funds.save();

    res.json({
      message: "Funds added successfully",
      balance: funds.balance,
      payin: funds.payin,
    });

  } catch (err) {
    console.log("Add funds error:", err);

    res.status(500).json({
      message: "Error adding funds",
    });
  }
});

app.post("/withdraw",authenticateToken, async (req, res) => {
  try {
    const amount = Number(req.body.amount);

    if (!amount || amount <= 0) {
      return res.status(400).json({
        message: "Enter a valid amount",
      });
    }

    let funds = await FundsModel.findOne({
      userId: req.user.id,
    });

    if (!funds) {
      return res.status(400).json({
        message: "Funds account not found",
      });
    }

    if (amount > funds.balance) {
      return res.status(400).json({
        message: `Insufficient balance. Available: ₹${funds.balance.toFixed(2)}`,
      });
    }

    funds.balance -= amount;
    funds.payout += amount;

    await funds.save();

    res.json({
      message: "Withdrawal successful",
      balance: funds.balance,
      payout: funds.payout,
    });

  } catch (err) {
    console.log("Withdraw error:", err);

    res.status(500).json({
      message: "Error withdrawing funds",
    });
  }
});



// =========================
// STOCKS / WATCHLIST
// =========================

let stocksCache = [];
let stocksCacheTime = 0;

const STOCK_CACHE_TIME = 60 * 1000; // 1 minute

app.get("/stocks", authenticateToken, async (req, res) => {
  try {
    const now = Date.now();

    // Return cached stocks if cache is still valid
    if (
      stocksCache.length > 0 &&
      now - stocksCacheTime < STOCK_CACHE_TIME
    ) {
      return res.json(stocksCache);
    }

    const stockSymbols = [
      { name: "INFY", yahoo: "INFY.NS" },
      { name: "TCS", yahoo: "TCS.NS" },
      { name: "WIPRO", yahoo: "WIPRO.NS" },
      { name: "RELIANCE", yahoo: "RELIANCE.NS" },
      { name: "HDFCBANK", yahoo: "HDFCBANK.NS" },
      { name: "SBIN", yahoo: "SBIN.NS" },
      { name: "ITC", yahoo: "ITC.NS" },
      { name: "BHARTIARTL", yahoo: "BHARTIARTL.NS" },
    ];

    // Initialize Yahoo Finance once
    if (!yahooFinance) {
      const YahooFinance = (await import("yahoo-finance2")).default;
      yahooFinance = new YahooFinance();
    }

    // ONE request for all stocks
    const quotes = await yahooFinance.quote(
      stockSymbols.map((stock) => stock.yahoo)
    );

    console.log("Yahoo quotes received:", quotes.length);

    // Convert Yahoo response into our frontend format
    const stocks = stockSymbols
      .map((stock) => {
        const quote = quotes.find(
          (q) => q.symbol === stock.yahoo
        );

        if (!quote) {
          return null;
        }

        const price = Number(quote.regularMarketPrice);
        const percentChange = Number(
          quote.regularMarketChangePercent
        );

        if (!Number.isFinite(price)) {
          return null;
        }

        return {
          name: stock.name,
          price: Number(price.toFixed(2)),
          percent: `${
            percentChange >= 0 ? "+" : ""
          }${percentChange.toFixed(2)}%`,
          isDown: percentChange < 0,
          previousClose: Number(
            quote.regularMarketPreviousClose?.toFixed(2)
          ),
        };
      })
      .filter((stock) => stock !== null);

    stocksCache = stocks;
    stocksCacheTime = Date.now();

    console.log("Stocks fetched successfully:", stocks);

    res.json(stocks);

  } catch (err) {
    console.log("Stocks error:", err);

    res.status(500).json({
      message: "Error fetching stocks",
      error: err.message,
    });
  }
});

app.get("/dashboard", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const holdings = await HoldingsModel.find({
      userId,
    });

    const funds = await FundsModel.findOne({
      userId,
    });

    const orders = await OrdersModel.find({
      userId,
    });

    const totalInvestment = holdings.reduce(
      (total, stock) => {
        return (
          total +
          Number(stock.avg) *
          Number(stock.qty)
        );
      },
      0
    );

    const currentValue = holdings.reduce(
      (total, stock) => {
        return (
          total +
          Number(stock.price) *
          Number(stock.qty)
        );
      },
      0
    );

    const profitLoss =
      currentValue - totalInvestment;

    res.json({
      totalInvestment,
      currentValue,
      profitLoss,

      holdingsCount: holdings.length,

      ordersCount: orders.length,

      balance: funds
        ? funds.balance
        : 0,
    });

  } catch (err) {

    console.log(
      "Dashboard error:",
      err
    );

    res.status(500).json({
      message:
        "Error fetching dashboard data",

      error: err.message,
    });
  }
});

mongoose
  .connect(uri)
  .then(() => {
    console.log("DB connected!");

    app.listen(PORT, () => {
      console.log(`App started on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err.message);
  });
