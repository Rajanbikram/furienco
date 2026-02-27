import { useState, useEffect } from "react";
import API from "../../../utils/axios";

export default function Customers() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await API.get("/seller/customers");
      setCustomers(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getBadge = (payment) => {
    if (payment === "Paid") return "badge-paid";
    if (payment === "Pending") return "badge-pending";
    return "badge-overdue";
  };

  return (
    <div>
      <h1 className="page-title">Customers</h1>
      <div className="card card-no-padding">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Product Rented</th>
                <th>Date</th>
                <th>Payment</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div className="customer-cell">
                      <div className="customer-avatar">{c.name[0]}</div>
                      <span className="td-name">{c.name}</span>
                    </div>
                  </td>
                  <td>{c.product}</td>
                  <td className="td-muted">{c.date}</td>
                  <td><span className={`badge ${getBadge(c.payment)}`}>{c.payment}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}