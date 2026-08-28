import React, { useState, useContext,useEffect } from "react";

import axios from "axios";

import GeneralContext from "./GeneralContext";

import { Tooltip, Grow } from "@mui/material";

import {
  BarChartOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp,
  MoreHoriz,
} from "@mui/icons-material";

import { DoughnutChart } from "./DoughnoutChart";

const WatchList = () => {

  const [watchlist, setWatchlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchStocks = () => {
      axios
        .get(`${process.env.REACT_APP_API_URL}/stocks`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          console.log("Stocks:", res.data);
          setWatchlist(res.data);
        })
        .catch((err) => {
          console.log("Error fetching stocks:", err);
        });
    };
  
    // Fetch immediately
    fetchStocks();
  
    // Refresh every 5 seconds
    const interval = setInterval(fetchStocks, 60000);
  
    // Cleanup when component is removed
    return () => clearInterval(interval);
  }, []);

  const filteredWatchlist = watchlist.filter((stock) =>
    stock.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const labels = watchlist.map((stock) => stock.name);
  const data = {
    labels,
    datasets: [
      {
        label: "Price",
        data: watchlist.map((stock) => stock.price),

        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
          "rgba(255, 159, 64, 0.5)",
        ],

        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],

        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="watchlist-container">

      {/* SEARCH */}
      <div className="search-container">
        <input
          type="text"
          name="search"
          id="search"
          className="search"
          placeholder="Search eg:infy, bse, nifty fut weekly, gold mcx"
          onChange={(e) => {
            console.log("TYPED:", e.target.value);
            setSearchTerm(e.target.value);
          }}
        />

        <span className="counts">
          {filteredWatchlist.length} / 50
        </span>
      </div>

      {/* WATCHLIST */}
      <ul className="list">
        {filteredWatchlist.map((stock, index) => {
          return (
            <WatchListItem
              stock={stock}
              key={index}
            />
          );
        })}
      </ul>

      {/* CHART */}
      <DoughnutChart data={data} />

    </div>
  );
};

export default WatchList;


// =====================================================
// WATCHLIST ITEM
// =====================================================

const WatchListItem = ({ stock }) => {
  const [showWatchlistActions, setShowWatchlistActions] =
    useState(false);

  const handleMouseEnter = () => {
    setShowWatchlistActions(true);
  };

  const handleMouseLeave = () => {
    setShowWatchlistActions(false);
  };

  return (
    <li
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >

      {/* STOCK INFORMATION */}
      <div className="item">

        <p className={stock.isDown ? "down" : "up"}>
          {stock.name}
        </p>

        <div className="item-info">

          <span className="percent">
            {stock.percent}
          </span>

          {stock.isDown ? (
            <KeyboardArrowDown className="down" />
          ) : (
            <KeyboardArrowUp className="up" />
          )}

          <span className="price">
            {stock.price}
          </span>

        </div>

      </div>

      {/* BUY / SELL ACTIONS */}
      {showWatchlistActions && (
        <WatchListActions
          uid={stock.name}
          price={stock.price}
        />
      )}

    </li>
  );
};


// =====================================================
// BUY / SELL ACTIONS
// =====================================================

const WatchListActions = ({ uid, price }) => {
  const generalContext = useContext(GeneralContext);

  // BUY
  const handleBuyClick = () => {
    console.log("BUY CLICKED:", uid, price);
    generalContext.openBuyWindow(uid, price);
  };

  // SELL
  const handleSellClick = () => {
    console.log("SELL CLICKED:", uid, price);
    generalContext.openSellWindow(uid, price);
  };

  return (
    <span className="actions">

      <span>

        {/* ================= BUY ================= */}
        <Tooltip
          title="Buy (B)"
          placement="top"
          arrow
          TransitionComponent={Grow}
        >
          <button
            className="buy"
            onClick={handleBuyClick}
          >
            Buy
          </button>
        </Tooltip>


        {/* ================= SELL ================= */}
        <Tooltip
          title="Sell (S)"
          placement="top"
          arrow
          TransitionComponent={Grow}
        >
          <button
            className="sell"
            onClick={handleSellClick}
          >
            Sell
          </button>
        </Tooltip>


        {/* ================= ANALYTICS ================= */}
        <Tooltip
          title="Analytics (A)"
          placement="top"
          arrow
          TransitionComponent={Grow}
        >
          <button className="action">
            <BarChartOutlined className="icon" />
          </button>
        </Tooltip>


        {/* ================= MORE ================= */}
        <Tooltip
          title="More"
          placement="top"
          arrow
          TransitionComponent={Grow}
        >
          <button className="action">
            <MoreHoriz className="icon" />
          </button>
        </Tooltip>

      </span>

    </span>
  );
};