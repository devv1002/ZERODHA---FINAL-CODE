import React, { useEffect, useState, useContext } from "react";
import axios from "axios";

import GeneralContext from "./GeneralContext";

const Summary = () => {
  const generalContext = useContext(GeneralContext);

  const [dashboard, setDashboard] = useState({
    totalInvestment: 0,
    currentValue: 0,
    profitLoss: 0,
    holdingsCount: 0,
    ordersCount: 0,
    balance: 0,
  });

  const [funds, setFunds] = useState({
    balance: 0,
    usedMargin: 0,
    openingBalance: 0,
  });

  const [username, setUsername] = useState("User");

  // =========================
  // GET USERNAME FROM TOKEN
  // =========================

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      const payload = JSON.parse(
        atob(token.split(".")[1])
      );

      setUsername(payload.username || "User");

    } catch (error) {
      console.log("Invalid token");
    }
  }, []);

  // =========================
  // FETCH DASHBOARD DATA
  // =========================

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDashboard(res.data);

    } catch (error) {
      console.log(
        "Error fetching dashboard:",
        error.response?.data || error.message
      );
    }
  };

  // =========================
  // FETCH FUNDS
  // =========================

  const fetchFunds = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/funds`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFunds(res.data);

    } catch (error) {
      console.log(
        "Error fetching funds:",
        error.response?.data || error.message
      );
    }
  };

  // =========================
  // FETCH DATA
  // =========================

  useEffect(() => {
    fetchDashboard();
    fetchFunds();
  }, [generalContext.refreshKey]);

  // =========================
  // CALCULATIONS
  // =========================

  const profitLoss = Number(
    dashboard.profitLoss || 0
  );

  const investment = Number(
    dashboard.totalInvestment || 0
  );

  const currentValue = Number(
    dashboard.currentValue || 0
  );

  const profitLossPercentage =
    investment > 0
      ? (profitLoss / investment) * 100
      : 0;

  const profitClass =
    profitLoss >= 0
      ? "profit"
      : "loss";

  // =========================
  // UI
  // =========================

  return (
    <>
      {/* =========================
          USER
      ========================= */}

      <div className="username">
        <h6>
          Hi, {username}!
        </h6>

        <hr className="divider" />
      </div>

      {/* =========================
          EQUITY
      ========================= */}

      <div className="section">

        <span>
          <p>Equity</p>
        </span>

        <div className="data">

          <div className="first">

            <h3>
              ₹
              {Number(
                funds.balance
              ).toFixed(2)}
            </h3>

            <p>
              Margin available
            </p>

          </div>

          <hr />

          <div className="second">

            <p>
              Margins used{" "}
              <span>
                ₹
                {Number(
                  funds.usedMargin
                ).toFixed(2)}
              </span>
            </p>

            <p>
              Opening balance{" "}
              <span>
                ₹
                {Number(
                  funds.openingBalance
                ).toFixed(2)}
              </span>
            </p>

          </div>

        </div>

        <hr className="divider" />

      </div>

      {/* =========================
          HOLDINGS
      ========================= */}

      <div className="section">

        <span>
          <p>
            Holdings ({dashboard.holdingsCount})
          </p>
        </span>

        <div className="data">

          <div className="first">

            <h3 className={profitClass}>

              ₹
              {profitLoss >= 0
                ? "+"
                : ""}

              {profitLoss.toFixed(2)}

              <small>

                {" "}

                {profitLoss >= 0
                  ? "+"
                  : ""}

                {profitLossPercentage.toFixed(2)}
                %

              </small>

            </h3>

            <p>
              P&L
            </p>

          </div>

          <hr />

          <div className="second">

            <p>
              Current Value{" "}
              <span>
                ₹
                {currentValue.toFixed(2)}
              </span>
            </p>

            <p>
              Investment{" "}
              <span>
                ₹
                {investment.toFixed(2)}
              </span>
            </p>

          </div>

        </div>

        <hr className="divider" />

      </div>

      {/* =========================
          TRADING SUMMARY
      ========================= */}

      <div className="section">

        <span>
          <p>
            Trading overview
          </p>
        </span>

        <div className="data">

          <div className="second">

            <p>
              Total orders{" "}
              <span>
                {dashboard.ordersCount}
              </span>
            </p>

            <p>
              Holdings{" "}
              <span>
                {dashboard.holdingsCount}
              </span>
            </p>

            <p>
              Available funds{" "}
              <span>
                ₹
                {Number(
                  funds.balance
                ).toFixed(2)}
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