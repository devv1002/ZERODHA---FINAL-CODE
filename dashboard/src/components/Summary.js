import React, { useEffect, useState, useContext } from "react";
import axios from "axios";

import GeneralContext from "./GeneralContext";
import { watchlist } from "../data/data";

const Summary = () => {
  const [funds, setFunds] = useState({
    balance: 0,
    usedMargin: 0,
    openingBalance: 0,
  });

  const [holdings, setHoldings] = useState([]);

  const generalContext = useContext(GeneralContext);

  const token = localStorage.getItem("token");

  let username = "User";

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      username = payload.username;
    } catch (error) {
      console.log("Invalid token");
    }
  }
  // =========================
  // FETCH FUNDS
  // =========================

  useEffect(() => {
    axios
      .get("http://localhost:3002/funds", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setFunds(res.data);
      })
      .catch((err) => {
        console.log("Error fetching funds:", err);
      });
  }, [generalContext.refreshKey]);

  // =========================
  // FETCH HOLDINGS
  // =========================

  useEffect(() => {
    axios
      .get("http://localhost:3002/allHoldings", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setHoldings(res.data);
      })
      .catch((err) => {
        console.log("Error fetching holdings:", err);
      });
  }, [generalContext.refreshKey]);


  const getLivePrice = (stock) => {
    const liveStock = watchlist.find(
      (item) => item.name === stock.name
    );
  
    return liveStock ? liveStock.price : stock.price;
  };


  // =========================
  // HOLDINGS CALCULATIONS
  // =========================

  const investment = holdings.reduce(
    (total, stock) => {
      return total + stock.avg * stock.qty;
    },
    0
  );

  const currentValue = holdings.reduce(
  (total, stock) => {
    return total + getLivePrice(stock) * stock.qty;
  },
  0
);

  const profitLoss = currentValue - investment;

  const profitLossPercentage =
    investment > 0
      ? (profitLoss / investment) * 100
      : 0;

  const equity = funds.balance + currentValue;

  const profitClass =
    profitLoss >= 0 ? "profit" : "loss";

  // =========================
  // UI
  // =========================

  return (
    <>
      <div className="username">
        <h6>Hi, {username}!</h6>
        <hr className="divider" />
      </div>

      {/* EQUITY */}

      <div className="section">

        <span>
          <p>Equity</p>
        </span>

        <div className="data">

          <div className="first">

          <h3>
            ₹{Number(funds.balance).toFixed(2)}
          </h3>

            <p>Margin available</p>

          </div>

          <hr />

          <div className="second">

            <p>
              Margins used{" "}
              <span>
                ₹{Number(funds.usedMargin).toFixed(2)}
              </span>
            </p>

            <p>
              Opening balance{" "}
              <span>
                ₹{Number(funds.openingBalance).toFixed(2)}
              </span>
            </p>

          </div>

        </div>

        <hr className="divider" />

      </div>

      {/* HOLDINGS */}

      <div className="section">

        <span>
          <p>
            Holdings ({holdings.length})
          </p>
        </span>

        <div className="data">

          <div className="first">

            <h3 className={profitClass}>

              ₹
              {profitLoss >= 0 ? "+" : ""}
              {profitLoss.toFixed(2)}

              <small>
                {" "}
                {profitLoss >= 0 ? "+" : ""}
                {profitLossPercentage.toFixed(2)}%
              </small>

            </h3>

            <p>P&L</p>

          </div>

          <hr />

          <div className="second">

            <p>
              Current Value{" "}
              <span>
                ₹{currentValue.toFixed(2)}
              </span>
            </p>

            <p>
              Investment{" "}
              <span>
                ₹{investment.toFixed(2)}
              </span>
            </p>

          </div>

        </div>

        <hr className="divider" />

      </div>
    </>
  );
};

export default Summary;