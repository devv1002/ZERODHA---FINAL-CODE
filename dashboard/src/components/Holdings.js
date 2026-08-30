import React, { useState, useEffect, useContext } from "react";
import axios from "axios";

import { VerticalGraph } from "./VerticalGraph";
import GeneralContext from "./GeneralContext";

const Holdings = () => {
  const [allHoldings, setAllHoldings] = useState([]);
  const [liveStocks, setLiveStocks] = useState([]);

  const generalContext = useContext(GeneralContext);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/allHoldings`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setAllHoldings(res.data);
      })
      .catch((err) => {
        console.log("Error fetching holdings:", err);
      });
  }, [generalContext.refreshKey]);

  useEffect(() => {
    const fetchStocks = () => {
      axios
        .get(`${process.env.REACT_APP_API_URL}/stocks`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          setLiveStocks(res.data);
        })
        .catch((err) => {
          console.log("Error fetching live stocks:", err);
        });
    };
  
    fetchStocks();
  
    const interval = setInterval(fetchStocks, 60000);
  
    return () => clearInterval(interval);
  }, []);
  // =========================
  // GRAPH DATA
  // =========================

  const getLivePrice = (stock) => {
    const liveStock = liveStocks.find(
      (item) => item.name === stock.name
    );
  
    return liveStock ? Number(liveStock.price) : Number(stock.price);
  };

  const getLiveStock = (stock) => {
    return liveStocks.find(
      (item) => item.name === stock.name
    );
  };

  const labels = allHoldings.map((stock) => stock.name);
  
  const data = {
    labels,
    datasets: [
      {
        label: "Portfolio Allocation",
        data: allHoldings.map(
          (stock) =>
            getLivePrice(stock) * stock.qty
        ),
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
          "rgba(255, 159, 64, 0.5)",
        ],
      },
    ],
  };

  // =========================
  // SUMMARY CALCULATIONS
  // =========================

  const totalInvestment = allHoldings.reduce(
    (total, stock) => {
      return total + stock.avg * stock.qty;
    },
    0
  );

  const currentValue = allHoldings.reduce(
    (total, stock) => {
      return total + getLivePrice(stock) * stock.qty;
    },
    0
  );

  const totalProfitLoss =
    currentValue - totalInvestment;

  const profitLossPercentage =
    totalInvestment > 0
      ? (totalProfitLoss / totalInvestment) * 100
      : 0;

  const summaryClass =
    totalProfitLoss >= 0 ? "profit" : "loss";

  // =========================
  // RETURN UI
  // =========================

  return (
    <>
      <h3 className="title">
        Holdings ({allHoldings.length})
      </h3>

      {/* =========================
          HOLDINGS TABLE
          ========================= */}

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg. cost</th>
              <th>LTP</th>
              <th>Cur. val</th>
              <th>P&L</th>
              <th>Net chg.</th>
              <th>Day chg.</th>
            </tr>
          </thead>

          <tbody>
            {allHoldings.map((stock, index) => {

              const livePrice = getLivePrice(stock);

              const curValue =
                livePrice * stock.qty;

              const profitLoss =
                curValue -
                stock.avg * stock.qty;

              const liveStock = getLiveStock(stock);

                // Actual return on this holding
              const netChangePercentage =
                stock.avg > 0
                  ? ((livePrice - stock.avg) / stock.avg) * 100
                  : 0;
              
              const netChange =
                `${netChangePercentage >= 0 ? "+" : ""}${netChangePercentage.toFixed(2)}%`;
              
              // Today's market movement
              const dayChange =
                liveStock?.percent || stock.day || "0.00%";


              const isProfit =
                profitLoss >= 0;

              const profClass =
                isProfit ? "profit" : "loss";


              return (
                <tr
                  key={stock._id || index}
                >
                  <td>{stock.name}</td>

                  <td>{stock.qty}</td>

                  <td>
                    {stock.avg.toFixed(2)}
                  </td>

                  <td>
                    {livePrice.toFixed(2)}
                  </td>

                  <td>
                    {curValue.toFixed(2)}
                  </td>

                  <td className={profClass}>
                    {profitLoss >= 0 ? "+": ""}
                    {profitLoss.toFixed(2)}
                  </td>

                  <td
                    className={
                      netChange.startsWith("-")
                        ? "loss"
                        : "profit"
                    }
                  >
                    {netChange}
                  </td>

                  <td
                    className={
                      dayChange.startsWith("-")
                        ? "loss"
                        : "profit"
                    }
                  >
                    {dayChange}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* =========================
          SUMMARY
          ========================= */}

      <div className="row">

        {/* TOTAL INVESTMENT */}

        <div className="col">
          <h5>
            ₹{totalInvestment.toFixed(2)}
          </h5>

          <p>Total investment</p>
        </div>

        {/* CURRENT VALUE */}

        <div className="col">
          <h5>
            ₹{currentValue.toFixed(2)}
          </h5>

          <p>Current value</p>
        </div>

        {/* TOTAL P&L */}

        <div className="col">
          <h5 className={summaryClass}>
            ₹{totalProfitLoss >= 0 ? "+" : ""}
            {totalProfitLoss.toFixed(2)}
            {" "}
            (
            {totalProfitLoss >= 0 ? "+" : ""}
            {profitLossPercentage.toFixed(2)}
            %)
          </h5>

          <p>P&L</p>
        </div>

      </div>

      {/* =========================
          GRAPH
          ========================= */}

      <VerticalGraph data={data} />
    </>
  );
};

export default Holdings;