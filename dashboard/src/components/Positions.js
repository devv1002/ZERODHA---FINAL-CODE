import React, { useState, useEffect, useContext } from "react";

import axios from "axios";
import GeneralContext from "./GeneralContext";
import { watchlist } from "../data/data";

const Positions = () => {
  const [allPositions, setAllPositions] = useState([]);

  const generalContext = useContext(GeneralContext);

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

  const getLivePrice = (stock) => {
    const liveStock = watchlist.find(
      (item) => item.name === stock.name
    );
  
    return liveStock ? liveStock.price : stock.price;
  };

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

              const curValue = livePrice * stock.qty;

              const profitLoss =
                curValue -
                stock.avg * stock.qty;

              const isProfit =
                profitLoss >= 0;

              const profClass =
                isProfit ? "profit" : "loss";

              const dayClass =
                stock.isLoss ? "loss" : "profit";

              return (
                <tr key={stock._id || index}>

                  <td>{stock.product}</td>

                  <td>{stock.name}</td>

                  <td>{stock.qty}</td>

                  <td>
                    {Number(stock.avg).toFixed(2)}
                  </td>

                  <td>
                    {Number(livePrice).toFixed(2)}
                  </td>

                  <td className={profClass}>
                    {profitLoss >= 0 ? "+" : ""}
                    {profitLoss.toFixed(2)}
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
    </>
  );
};

export default Positions;