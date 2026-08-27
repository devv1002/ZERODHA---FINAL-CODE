import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import GeneralContext from "./GeneralContext";

const Positions = () => {
  const [allPositions, setAllPositions] = useState([]);
  const [stocks, setStocks] = useState([]);

  const generalContext = useContext(GeneralContext);

  // =========================
  // FETCH POSITIONS
  // =========================

  useEffect(() => {
    axios
      .get("http://localhost:3002/allPositions", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log("Positions data:", res.data);
        setAllPositions(res.data);
      })
      .catch((err) => {
        console.log("Error fetching positions:", err);
      });
  }, [generalContext.refreshKey]);

  // =========================
  // FETCH LIVE STOCK PRICES
  // =========================

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
          setStocks(res.data);
        })
        .catch((err) => {
          console.log("Error fetching stocks:", err);
        });
    };
  
    fetchStocks();
  
    const interval = setInterval(fetchStocks, 60000);
  
    return () => clearInterval(interval);
  }, []);
  
  // =========================
  // GET LIVE PRICE
  // =========================

  const getLivePrice = (stock) => {
    const liveStock = stocks.find(
      (item) => item.name === stock.name
    );

    return liveStock
      ? Number(liveStock.price)
      : Number(stock.price);
  };

  const getLiveStock = (stock) => {
    return stocks.find(
      (item) => item.name === stock.name
    );
  };

  // =========================
  // UI
  // =========================

  return (
    <>
      <h3 className="title">
        Positions ({allPositions.length})
      </h3>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg.</th>
              <th>LTP</th>
              <th>P&L</th>
              <th>Chg.</th>
            </tr>
          </thead>

          <tbody>
            {allPositions.map((stock, index) => {
              const livePrice = getLivePrice(stock);

              const curValue =
                livePrice * stock.qty;

              const investment =
                stock.avg * stock.qty;

              const profitLoss =
                curValue - investment;

              const liveStock = getLiveStock(stock);

              const dayChange =
                liveStock?.percent || stock.day || "0.00%";

              const isProfit =
                profitLoss >= 0;

              const profClass =
                isProfit ? "profit" : "loss";

              const dayClass =
                dayChange.startsWith("-")
                  ? "loss"
                  : "profit";

              
              return (
                <tr key={stock._id || index}>

                  <td>{stock.product}</td>

                  <td>{stock.name}</td>

                  <td>{stock.qty}</td>

                  <td>
                    {Number(stock.avg).toFixed(2)}
                  </td>

                  <td>
                    {livePrice.toFixed(2)}
                  </td>

                  <td className={profClass}>
                    {profitLoss >= 0 ? "+" : ""}
                    {profitLoss.toFixed(2)}
                  </td>

                  <td className={dayClass}>
                    {dayChange}
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Positions;