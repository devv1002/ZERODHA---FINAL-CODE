import React, { useState, useContext } from "react";
import axios from "axios";

import GeneralContext from "./GeneralContext";
import "./BuyActionWindow.css";

const SellActionWindow = ({ uid, price }) => {
  const generalContext = useContext(GeneralContext);

  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(price || 0);

  const handleSellClick = async () => {
    const quantity = Number(stockQuantity);
    const orderPrice = Number(stockPrice);

    if (!quantity || quantity <= 0) {
      alert("Please enter a valid quantity.");
      return;
    }

    if (!orderPrice || orderPrice <= 0) {
      alert("Please enter a valid price.");
      return;
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/newOrder`,
        {
          name: uid,
          qty: quantity,
          price: orderPrice,
          mode: "SELL",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Sell order placed successfully!");

      generalContext.closeSellWindow();
      generalContext.refreshData();

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Failed to place sell order!"
      );
    }
  };

  const handleCancelClick = () => {
    generalContext.closeSellWindow();
  };

  const marginRequired =
    Number(stockQuantity) * Number(stockPrice);

  return (
    <div
      className="container"
      id="buy-window"
      draggable="true"
    >

      <div className="regular-order">

        <div className="inputs">

          <fieldset>
            <legend>Qty.</legend>

            <input
              type="number"
              min="1"
              value={stockQuantity}
              onChange={(e) =>
                setStockQuantity(e.target.value)
              }
            />
          </fieldset>

          <fieldset>
            <legend>Price</legend>

            <input
              type="number"
              min="0"
              step="0.05"
              value={stockPrice}
              onChange={(e) =>
                setStockPrice(e.target.value)
              }
            />
          </fieldset>

        </div>
      </div>

      <div className="buttons">

        <span>
          Margin required ₹
          {marginRequired.toFixed(2)}
        </span>

        <div>

          <button
            className="btn btn-blue"
            onClick={handleSellClick}
          >
            Sell
          </button>

          <button
            className="btn btn-grey"
            onClick={handleCancelClick}
          >
            Cancel
          </button>

        </div>

      </div>

    </div>
  );
};

export default SellActionWindow;