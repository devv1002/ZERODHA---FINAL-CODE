import React, {
  useEffect,
  useState,
  useContext,
} from "react";

import axios from "axios";

import GeneralContext from "./GeneralContext";

const Funds = () => {
  const generalContext = useContext(GeneralContext);

  const [funds, setFunds] = useState({
    balance: 100000,
    usedMargin: 0,
    availableMargin: 100000,
    openingBalance: 100000,
    payin: 0,
    payout: 0,
  });

  // =========================
  // FETCH FUNDS
  // =========================

  const fetchFunds = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3002/funds",{
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setFunds(res.data);

    } catch (error) {
      console.log(
        "Error fetching funds:",
        error
      );
    }
  };

  // =========================
  // REFRESH FUNDS
  // =========================

  useEffect(() => {
    fetchFunds();
  }, [generalContext.refreshKey]);

  // =========================
  // ADD FUNDS
  // =========================

  const handleAddFunds = async () => {
    const amount = prompt(
      "Enter amount to add:"
    );

    if (!amount || Number(amount) <= 0) {
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3002/addFunds",
        {
          amount: Number(amount),
        },{
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert(res.data.message);

      fetchFunds();
      generalContext.refreshData();

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Failed to add funds"
      );
    }
  };

  // =========================
  // WITHDRAW
  // =========================

  const handleWithdraw = async () => {
    const amount = prompt(
      "Enter amount to withdraw:"
    );

    if (!amount || Number(amount) <= 0) {
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3002/withdraw",
        {
          amount: Number(amount),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert(res.data.message);

      fetchFunds();
      generalContext.refreshData();

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Failed to withdraw funds"
      );
    }
  };

  return (
    <>
      {/* =========================
          FUND BUTTONS
          ========================= */}

      <div className="funds">

        <p>
          Instant, zero-cost fund transfers with UPI
        </p>

        <button
          className="btn btn-green"
          onClick={handleAddFunds}
        >
          Add funds
        </button>

        <button
          className="btn btn-blue"
          onClick={handleWithdraw}
        >
          Withdraw
        </button>

      </div>

      {/* =========================
          FUNDS DETAILS
          ========================= */}

      <div className="row">

        <div className="col">

          <span>
            <p>Equity</p>
          </span>

          <div className="table">

            {/* AVAILABLE MARGIN */}

            <div className="data">
              <p>Available margin</p>

              <p className="imp colored">
                ₹
                {Number(
                  funds.availableMargin
                ).toFixed(2)}
              </p>
            </div>

            {/* USED MARGIN */}

            <div className="data">
              <p>Used margin</p>

              <p className="imp">
                ₹
                {Number(
                  funds.usedMargin
                ).toFixed(2)}
              </p>
            </div>

            {/* AVAILABLE CASH */}

            <div className="data">
              <p>Available cash</p>

              <p className="imp">
                ₹
                {Number(
                  funds.balance
                ).toFixed(2)}
              </p>
            </div>

            <hr />

            {/* OPENING BALANCE */}

            <div className="data">
              <p>Opening Balance</p>
              <p>
                ₹{Number(funds.openingBalance).toFixed(2)}
              </p>
            </div>

            {/* PAYIN */}

            <div className="data">
              <p>Payin</p>
              <p>
                ₹{Number(funds.payin).toFixed(2)}
              </p>
            </div>


            {/* PAYOUT */}

            <div className="data">
              <p>Payout</p>
              <p>
                ₹{Number(funds.payout).toFixed(2)}
              </p>
            </div>

            {/* SPAN */}

            <div className="data">
              <p>SPAN</p>
              <p>₹0.00</p>
            </div>

            {/* DELIVERY MARGIN */}

            <div className="data">
              <p>Delivery margin</p>
              <p>₹0.00</p>
            </div>

            {/* EXPOSURE */}

            <div className="data">
              <p>Exposure</p>
              <p>₹0.00</p>
            </div>

            {/* OPTIONS PREMIUM */}

            <div className="data">
              <p>Options premium</p>
              <p>₹0.00</p>
            </div>

            <hr />

            {/* COLLATERAL */}

            <div className="data">
              <p>
                Collateral (Liquid funds)
              </p>

              <p>₹0.00</p>
            </div>

            <div className="data">
              <p>
                Collateral (Equity)
              </p>

              <p>₹0.00</p>
            </div>

            <div className="data">
              <p>Total Collateral</p>
              <p>₹0.00</p>
            </div>

          </div>
        </div>

        {/* =========================
            COMMODITY
            ========================= */}

        <div className="col">

          <div className="commodity">

            <p>
              You don't have a commodity account
            </p>

            <button className="btn btn-blue">
              Open Account
            </button>

          </div>

        </div>

      </div>
    </>
  );
};

export default Funds;