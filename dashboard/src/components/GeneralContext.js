import React, { useState } from "react";

import BuyActionWindow from "./BuyActionWindow";
import SellActionWindow from "./SellActionWindow";

const GeneralContext = React.createContext({
  openBuyWindow: (uid, price) => {},
  closeBuyWindow: () => {},

  openSellWindow: (uid, price) => {},
  closeSellWindow: () => {},

  refreshData: () => {},
  refreshKey: 0,
});

export const GeneralContextProvider = (props) => {
  // BUY WINDOW
  const [isBuyWindowOpen, setIsBuyWindowOpen] = useState(false);
  const [selectedStockUID, setSelectedStockUID] = useState("");
  const [selectedStockPrice, setSelectedStockPrice] = useState(0);

  // SELL WINDOW
  const [isSellWindowOpen, setIsSellWindowOpen] = useState(false);
  const [selectedSellStockUID, setSelectedSellStockUID] = useState("");
  const [selectedSellStockPrice, setSelectedSellStockPrice] = useState(0);

  // REFRESH DATA
  const [refreshKey, setRefreshKey] = useState(0);

  // =========================
  // BUY WINDOW FUNCTIONS
  // =========================

  const handleOpenBuyWindow = (uid, price) => {
    setIsBuyWindowOpen(true);
    setSelectedStockUID(uid);
    setSelectedStockPrice(price);
  };

  const handleCloseBuyWindow = () => {
    setIsBuyWindowOpen(false);
    setSelectedStockUID("");
    setSelectedStockPrice(0);
  };

  // =========================
  // SELL WINDOW FUNCTIONS
  // =========================

  const handleOpenSellWindow = (uid, price) => {
    setIsSellWindowOpen(true);
    setSelectedSellStockUID(uid);
    setSelectedSellStockPrice(price);
  };

  const handleCloseSellWindow = () => {
    setIsSellWindowOpen(false);
    setSelectedSellStockUID("");
    setSelectedSellStockPrice(0);
  };

  // =========================
  // REFRESH FUNCTION
  // =========================

  const handleRefreshData = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <GeneralContext.Provider
      value={{
        // BUY
        openBuyWindow: handleOpenBuyWindow,
        closeBuyWindow: handleCloseBuyWindow,

        // SELL
        openSellWindow: handleOpenSellWindow,
        closeSellWindow: handleCloseSellWindow,

        // REFRESH
        refreshData: handleRefreshData,
        refreshKey: refreshKey,
      }}
    >
      {props.children}

      {/* BUY WINDOW */}
      {isBuyWindowOpen && (
        <BuyActionWindow
          uid={selectedStockUID}
          price={selectedStockPrice}
        />
      )}

      {/* SELL WINDOW */}
      {isSellWindowOpen && (
        <SellActionWindow
          uid={selectedSellStockUID}
          price={selectedSellStockPrice}
        />
      )}
    </GeneralContext.Provider>
  );
};

export default GeneralContext;