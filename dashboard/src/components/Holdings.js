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
      .get("http://localhost:3002/allHoldings", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log("Holdings data:", res.data);
        setAllHoldings(res.data);
      })
      .catch((err) => {
        console.log("Error fetching holdings:", err);
      });
  }, [generalContext.refreshKey]);

  useEffect(() => {
    const fetchStocks = () => {
      axios
        .get("http://localhost:3002/stocks", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          console.log("Live stocks:", res.data);
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

  const labels = allHoldings.map((stock) => stock.name);
  
  const data = {
    labels,
    datasets: [
      {
        label: "Stock Price",
        data: allHoldings.map((stock) =>
          getLivePrice(stock)
        ),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
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

              const isProfit =
                profitLoss >= 0;

              const profClass =
                isProfit ? "profit" : "loss";

              const dayClass =
                stock.day?.startsWith("-")
                  ? "loss"
                  : "profit";

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

                  <td className={profClass}>
                    {stock.net}
                  </td>

                  <td className={dayClass}>
                    {stock.day}
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