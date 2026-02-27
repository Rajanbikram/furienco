import { useState, useEffect } from "react";
import API from "../../../utils/axios";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    fetchOrders();
  }, [dateFilter]);

  const fetchOrders = async () => {
    try {
      const url = dateFilter ? `/seller/orders?date=${dateFilter}` : "/seller/orders";
      const res = await API.get(url);
      setOrders(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getBadge = (status) => {
    if (status === "Active") return "badge-active";
    if (status === "Completed") return "badge-completed";
    return "badge-pending";
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Orders</h1>
        <input
          type="date"
          className="form-input form-input-auto"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
      </div>
      <div className="card card-no-padding">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Customer</th>
                <th>Period</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td className="td-name">{o.product}</td>
                  <td>{o.customer}</td>
                  <td className="td-muted">{o.period}</td>
                  <td className="td-name">{o.amount}</td>
                  <td><span className={`badge ${getBadge(o.status)}`}>{o.status}</span></td>
                  <td className="td-muted">{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}