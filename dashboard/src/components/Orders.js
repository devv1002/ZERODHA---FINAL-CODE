import React, {
  useState,
  useEffect,
  useContext,
} from "react";

import axios from "axios";
import { Link } from "react-router-dom";

import GeneralContext from "./GeneralContext";

const Orders = () => {
  const [allOrders, setAllOrders] = useState([]);

  const generalContext = useContext(GeneralContext);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/allOrders`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        // Newest orders first
        const sortedOrders = [...res.data].sort(
          (a, b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt)
        );

        setAllOrders(sortedOrders);

      } catch (error) {
        console.log(
          "Error fetching orders:",
          error
        );
      }
    };

    fetchOrders();
  }, [generalContext.refreshKey]);

  return (
    <div className="orders">

      {allOrders.length === 0 ? (

        <div className="no-orders">

          <p>
            You haven't placed any orders today
          </p>

          <Link to="/" className="btn">
            Get started
          </Link>

        </div>

      ) : (

        <>
          <h3 className="title">
            Orders ({allOrders.length})
          </h3>

          <div className="order-table">

            <table>

              <thead>
                <tr>
                  <th>Instrument</th>
                  <th>Qty.</th>
                  <th>Price</th>
                  <th>Mode</th>
                  <th>Date & Time</th>
                </tr>
              </thead>

              <tbody>

                {allOrders.map((order) => (

                  <tr key={order._id}>

                    <td>
                      {order.name}
                    </td>

                    <td>
                      {order.qty}
                    </td>

                    <td>
                      ₹{Number(order.price).toFixed(2)}
                    </td>

                    <td
                      className={
                        order.mode === "BUY"
                          ? "profit"
                          : "loss"
                      }
                    >
                      {order.mode}
                    </td>

                    <td>
                      {new Date(order.createdAt).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>
        </>
      )}

    </div>
  );
};

export default Orders;