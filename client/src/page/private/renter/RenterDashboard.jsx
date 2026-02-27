import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../../../utils/axios";
import "../../../css/renter.css";

const timelineStages = ["Ordered", "Approved", "Dispatched", "Active Rental", "Completed"];

export default function RenterDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const getPageFromPath = () => {
    const path = location.pathname.replace("/renter-dashboard", "").replace("/", "");
    return path || "dashboard";
  };

  const [activePage, setActivePage] = useState(getPageFromPath());
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchDropdownShow, setSearchDropdownShow] = useState(false);
  const [products, setProducts] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [history, setHistory] = useState([]);
  const [cart, setCart] = useState([]);
  const [browseSearch, setBrowseSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterLocation, setFilterLocation] = useState("All");
  const [filterPrice, setFilterPrice] = useState(15000);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  const [deliveryInfo, setDeliveryInfo] = useState({ name: "", address: "", phone: "" });
  const [toast, setToast] = useState({ show: false, title: "", desc: "" });
  const [profile, setProfile] = useState({
    name: "Renter User",
    email: "renter@example.com",
    phone: "9841234567",
    address: "Kathmandu, Nepal",
    city: "Kathmandu",
  });

  const profileRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => { setActivePage(getPageFromPath()); }, [location.pathname]);
  useEffect(() => { fetchProducts(); fetchRentals(); fetchHistory(); }, []);

  const fetchProducts = async () => {
    try { const res = await API.get("/renter/products"); setProducts(res.data.data); }
    catch (err) { console.error(err); }
  };
  const fetchRentals = async () => {
    try { const res = await API.get("/renter/rentals"); setRentals(res.data.data); }
    catch (err) { console.error(err); }
  };
  const fetchHistory = async () => {
    try { const res = await API.get("/renter/history"); setHistory(res.data.data); }
    catch (err) { console.error(err); }
  };

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchDropdownShow(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const getPrice = (product) => parseInt(product.price) || 0;
  const getTotal = () => cart.reduce((sum, item) => sum + getPrice(item.product), 0);

  const showToast = (title, desc) => {
    setToast({ show: true, title, desc });
    setTimeout(() => setToast({ show: false, title: "", desc: "" }), 3000);
  };

  const addToCart = (product) => {
    if (cart.find((c) => c.product.id === product.id)) return;
    setCart((prev) => [...prev, { product }]);
    showToast("Added to Cart", product.name + " has been added.");
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((c) => c.product.id !== productId));
  };

  const handleCheckout = () => {
    setDeliveryInfo({ name: "", address: "", phone: "" });
    setModalStep(1);
    setModalOpen(true);
  };

  const confirmOrder = async () => {
    try {
      const items = cart.map((item) => ({
        productName: item.product.name,
        tenure: item.product.tenure || "Monthly",
        amount: getPrice(item.product),
      }));
      console.log("Sending order:", { items, deliveryInfo });
      const res = await API.post("/renter/order", { items, deliveryInfo });
      console.log("Order response:", res.data);
      setCart([]);
      setModalStep(4);
      await fetchRentals();
    } catch (err) {
      console.error("Order error:", err.response?.data || err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const categoryOptions = ["All", ...new Set(products.map((p) => p.category).filter(Boolean))];
  const locationOptions = ["All", ...new Set(products.map((p) => p.location).filter(Boolean))];
  const searchMatches = products.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5);
  const filteredProducts = products.filter((p) => {
    if (filterCategory !== "All" && p.category !== filterCategory) return false;
    if (filterLocation !== "All" && p.location !== filterLocation) return false;
    if (browseSearch && !p.name.toLowerCase().includes(browseSearch.toLowerCase())) return false;
    if (getPrice(p) > filterPrice) return false;
    return true;
  });

  const Icon = ({ id, size = 20 }) => (
    <svg width={size} height={size}><use href={`#icon-${id}`} /></svg>
  );

  const ProductImage = ({ product }) => {
    const [imgError, setImgError] = useState(false);
    const hasImage = product.imageUrl && !imgError;
    return (
      <div className="pc-img">
        {hasImage
          ? <img src={`http://localhost:5000${product.imageUrl}`} alt={product.name} onError={() => setImgError(true)} />
          : <Icon id="package" size={48} />}
      </div>
    );
  };

  const renderTimeline = (stage) => (
    <div className="timeline">
      {timelineStages.map((s, i) => (
        <div className="timeline-step" key={i}>
          <div className="tl-col">
            <div className={`tl-dot ${i <= stage ? "done" : "pending"}`}>
              {i < stage ? <Icon id="check" size={12} /> : i + 1}
            </div>
            <span className="tl-label">{s}</span>
          </div>
          {i < timelineStages.length - 1 && (
            <div className={`tl-line ${i < stage ? "done" : "pending"}`}></div>
          )}
        </div>
      ))}
    </div>
  );

  // ── Modal style helpers ──
  const dotStyle = (n) => ({
    width: 36, height: 36, borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 15, fontWeight: 700, flexShrink: 0, transition: "all 0.3s",
    background: n <= modalStep ? "#2563eb" : "#e5e7eb",
    color: n <= modalStep ? "#fff" : "#9ca3af",
    boxShadow: n === modalStep ? "0 4px 12px rgba(37,99,235,0.4)" : "none",
  });
  const lineStyle = (n) => ({
    flex: 1, height: 1, margin: "18px 4px 0",
    background: n < modalStep ? "#2563eb" : "#d1d5db",
    transition: "background 0.3s",
  });
  const labelStyle = (n) => ({
    fontSize: 11, fontWeight: 500, marginTop: 10,
    textAlign: "center", lineHeight: 1.4,
    color: n <= modalStep ? "#2563eb" : "#9ca3af",
  });
  const stepLabels = ["Confirm\nProducts", "Delivery\nInfo", "Payment\nSummary", "Confirmation"];

  const renderPage = () => {
    if (activePage === "dashboard") return (
      <>
        <h1 className="page-title">Dashboard</h1>
        <div className="summary-grid">
          <div className="card summary-card">
            <div className="sc-inner">
              <div className="sc-icon" style={{ color: "var(--primary)" }}><Icon id="package" /></div>
              <div><p className="sc-label">Active Rentals</p><p className="sc-value">{rentals.length}</p></div>
            </div>
          </div>
          <div className="card summary-card">
            <div className="sc-inner">
              <div className="sc-icon" style={{ color: "var(--warning)" }}><Icon id="cart" /></div>
              <div><p className="sc-label">Items in Cart</p><p className="sc-value">{cart.length}</p></div>
            </div>
          </div>
          <div className="card summary-card">
            <div className="sc-inner">
              <div className="sc-icon" style={{ color: "var(--success)" }}><Icon id="dollar" /></div>
              <div>
                <p className="sc-label">Total Spending</p>
                <p className="sc-value">Rs. {history.reduce((s, h) => s + h.amount, 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="card recent-rentals">
          <h2>Recent Active Rentals</h2>
          {rentals.length === 0
            ? <p style={{ color: "#000", fontSize: 14 }}>No active rentals yet.</p>
            : rentals.slice(0, 3).map((r) => (
              <div className="rental-row" key={r.id}>
                <div>
                  <p className="rr-name">{r.productName}</p>
                  <p className="rr-date">{r.startDate} → {r.endDate}</p>
                </div>
                <span className={`badge ${r.status === "Active" ? "badge-success" : "badge-warning"}`}>{r.status}</span>
              </div>
            ))
          }
        </div>
      </>
    );

    if (activePage === "browse") return (
      <>
        <h1 className="page-title">Browse Products</h1>
        <div className="card filters">
          <div className="filters-row">
            <div className="filter-group">
              <label>Search</label>
              <input type="text" placeholder="Search products..." value={browseSearch} onChange={(e) => setBrowseSearch(e.target.value)} />
            </div>
            <div className="filter-group" style={{ flex: 0, minWidth: 140 }}>
              <label>Category</label>
              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                {categoryOptions.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="filter-group" style={{ flex: 0, minWidth: 140 }}>
              <label>Location</label>
              <select value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)}>
                {locationOptions.map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div className="filter-group">
              <label>Max Price: Rs. {filterPrice.toLocaleString()}</label>
              <input type="range" min="500" max="15000" step="500" value={filterPrice} onChange={(e) => setFilterPrice(Number(e.target.value))} />
            </div>
          </div>
        </div>
        {filteredProducts.length === 0
          ? <div className="no-results">No products match your filters.</div>
          : <div className="products-grid">
            {filteredProducts.map((p) => {
              const inCart = cart.some((c) => c.product.id === p.id);
              return (
                <div className="card product-card" key={p.id}>
                  <ProductImage product={p} />
                  <div className="pc-body">
                    <div className="pc-name">{p.name}</div>
                    <div className="pc-meta">
                      <Icon id="tag" size={12} />{p.category}
                      <Icon id="map-pin" size={12} style={{ marginLeft: 8 }} />{p.location}
                    </div>
                    <div className="pc-pricing">
                      <span className="pc-tenure">{p.tenure || "Monthly"}</span>
                      <span className="pc-price">Rs. {getPrice(p).toLocaleString()}</span>
                    </div>
                    <button className="btn-primary" disabled={inCart} onClick={() => addToCart(p)}>
                      <Icon id="cart" size={16} />
                      {inCart ? "In Cart" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        }
      </>
    );

    if (activePage === "cart") return (
      <>
        <h1 className="page-title">Cart</h1>
        {cart.length === 0
          ? <div className="card cart-empty"><Icon id="cart" size={48} /><p>Your cart is empty. Browse products to add items.</p></div>
          : <div className="cart-layout">
            <div>
              {cart.map((item) => (
                <div className="card cart-item" key={item.product.id}>
                  <div>
                    <p className="ci-name">{item.product.name}</p>
                    <p className="ci-meta">{item.product.tenure || "Monthly"} · {item.product.location}</p>
                  </div>
                  <div className="ci-right">
                    <p className="ci-price">Rs. {getPrice(item.product).toLocaleString()}</p>
                    <button className="ci-remove" onClick={() => removeFromCart(item.product.id)}>
                      <Icon id="trash" size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="card cart-summary">
              <h2>Order Summary</h2>
              {cart.map((item) => (
                <div className="cs-line" key={item.product.id}>
                  <span className="cs-label">{item.product.name}</span>
                  <span>Rs. {getPrice(item.product).toLocaleString()}</span>
                </div>
              ))}
              <div className="cs-total">
                <span>Total</span>
                <span className="cs-val">Rs. {getTotal().toLocaleString()}</span>
              </div>
              <button className="btn-primary" onClick={handleCheckout}>
                Proceed to Checkout
              </button>
            </div>
          </div>
        }
      </>
    );

    if (activePage === "my-rentals") return (
      <>
        <h1 className="page-title">My Active Rentals</h1>
        {rentals.length === 0
          ? <div className="card" style={{ padding: 32, textAlign: "center", color: "#000" }}>No active rentals yet.</div>
          : rentals.map((r) => (
            <div className="card rental-card" key={r.id}>
              <div className="rc-header">
                <div>
                  <p className="rc-name">{r.productName}</p>
                  <p className="rc-date">{r.startDate} → {r.endDate}</p>
                </div>
                <div className="rc-actions">
                  <span className={`badge ${r.status === "Active" ? "badge-success" : "badge-warning"}`}>{r.status}</span>
                  <button className="btn-outline"><Icon id="refresh" size={14} /> Renew</button>
                </div>
              </div>
              {renderTimeline(r.orderStage)}
            </div>
          ))
        }
      </>
    );

    if (activePage === "history") return (
      <>
        <h1 className="page-title">Rental History</h1>
        <div className="card" style={{ overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table className="history-table">
              <thead>
                <tr><th>Product</th><th>Duration</th><th>Amount</th><th>Status</th><th>Date</th></tr>
              </thead>
              <tbody>
                {history.length === 0
                  ? <tr><td colSpan="5" style={{ textAlign: "center", padding: 24, color: "#000" }}>No history yet.</td></tr>
                  : history.map((h) => (
                    <tr key={h.id}>
                      <td className="td-name">{h.productName}</td>
                      <td className="td-muted">{h.duration}</td>
                      <td>Rs. {h.amount.toLocaleString()}</td>
                      <td><span className="badge badge-success">{h.status}</span></td>
                      <td className="td-muted">{h.date}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      </>
    );

    if (activePage === "settings") return (
      <div className="profile-page">
        <h1 className="page-title">Profile Settings</h1>
        <div className="card">
          <div className="profile-avatar-section">
            <div className="profile-avatar-big">
              {profile.name.charAt(0)}
              <button className="cam-btn"><Icon id="camera" size={14} /></button>
            </div>
            <div className="pa-info">
              <p className="pa-name">{profile.name}</p>
              <p className="pa-email">{profile.email}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="form-section">
            <h3>Personal Information</h3>
            {[
              { label: "Full Name", key: "name", type: "text", icon: "user" },
              { label: "Email", key: "email", type: "email", icon: "mail" },
              { label: "Phone Number", key: "phone", type: "text", icon: "phone" },
              { label: "Address", key: "address", type: "text", icon: "map-pin" },
            ].map(({ label, key, type, icon }) => (
              <div className="form-group" key={key}>
                <label>{label}</label>
                <div className="input-wrap">
                  <Icon id={icon} size={16} />
                  <input type={type} value={profile[key]} onChange={(e) => setProfile({ ...profile, [key]: e.target.value })} />
                </div>
              </div>
            ))}
            <div className="form-group">
              <label>City</label>
              <input value={profile.city} onChange={(e) => setProfile({ ...profile, city: e.target.value })} />
            </div>
            <button className="btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 8 }}
              onClick={() => showToast("Profile Updated", "Your profile has been saved successfully.")}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* SVG Sprite */}
      <svg style={{ display: "none" }} xmlns="http://www.w3.org/2000/svg">
        <symbol id="icon-dashboard" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></symbol>
        <symbol id="icon-grid" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><rect x="16" y="2" width="6" height="6" rx="1"/><rect x="2" y="9" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/><rect x="16" y="9" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="16" width="6" height="6" rx="1"/><rect x="16" y="16" width="6" height="6" rx="1"/></symbol>
        <symbol id="icon-package" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16.5 9.4-9-5.19"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" x2="12" y1="22" y2="12"/></symbol>
        <symbol id="icon-cart" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></symbol>
        <symbol id="icon-history" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></symbol>
        <symbol id="icon-user-cog" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/><circle cx="18" cy="18" r="3"/></symbol>
        <symbol id="icon-logout" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></symbol>
        <symbol id="icon-search" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></symbol>
        <symbol id="icon-bell" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></symbol>
        <symbol id="icon-chevron-down" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></symbol>
        <symbol id="icon-menu" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></symbol>
        <symbol id="icon-x" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></symbol>
        <symbol id="icon-dollar" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></symbol>
        <symbol id="icon-trash" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></symbol>
        <symbol id="icon-refresh" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></symbol>
        <symbol id="icon-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></symbol>
        <symbol id="icon-tag" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/></symbol>
        <symbol id="icon-map-pin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></symbol>
        <symbol id="icon-user" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></symbol>
        <symbol id="icon-mail" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></symbol>
        <symbol id="icon-phone" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></symbol>
        <symbol id="icon-camera" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></symbol>
      </svg>

      <div className="app">
        {/* SIDEBAR */}
        <aside className={`sidebar ${sidebarOpen ? "" : "collapsed"}`}>
          <div className="sidebar-header"><span className="logo">RentalHub</span></div>
          <nav className="sidebar-nav">
            {[
              { key: "dashboard", icon: "dashboard", label: "Dashboard", path: "/renter-dashboard" },
              { key: "browse", icon: "grid", label: "Browse Products", path: "/renter-dashboard/browse" },
              { key: "my-rentals", icon: "package", label: "My Rentals", path: "/renter-dashboard/my-rentals" },
              { key: "cart", icon: "cart", label: "Cart", path: "/renter-dashboard/cart" },
              { key: "history", icon: "history", label: "Rental History", path: "/renter-dashboard/history" },
              { key: "settings", icon: "user-cog", label: "Profile Settings", path: "/renter-dashboard/settings" },
            ].map((item) => (
              <a key={item.key} href="#" className={activePage === item.key ? "active" : ""}
                onClick={(e) => { e.preventDefault(); navigate(item.path); }}>
                <Icon id={item.icon} size={16} />
                <span>{item.label}</span>
                {item.key === "cart" && cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
              </a>
            ))}
          </nav>
          <div className="sidebar-footer">
            <button onClick={handleLogout}><Icon id="logout" size={20} /><span>Logout</span></button>
          </div>
        </aside>

        {/* MAIN */}
        <div className="main">
          <header className="navbar">
            <button className="menu-btn" onClick={() => setSidebarOpen((s) => !s)}>
              <Icon id={sidebarOpen ? "x" : "menu"} size={20} />
            </button>
            <div className="search-wrap" ref={searchRef}>
              <svg className="search-icon"><use href="#icon-search" /></svg>
              <input type="text" placeholder="Search products..." value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setSearchDropdownShow(true); }}
                onFocus={() => setSearchDropdownShow(true)} />
              {searchDropdownShow && searchQuery && searchMatches.length > 0 && (
                <div className="search-dropdown show">
                  {searchMatches.map((p) => (
                    <button key={p.id} onClick={() => { setSearchQuery(p.name); setSearchDropdownShow(false); navigate("/renter-dashboard/browse"); }}>
                      <strong>{p.name}</strong><span className="sub">{p.category} · {p.location}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="navbar-right">
              <button className="notif-btn"><Icon id="bell" size={20} /><span className="notif-dot"></span></button>
              <div className="profile-wrap" ref={profileRef}>
                <button className="profile-btn" onClick={() => setProfileOpen((o) => !o)}>
                  <div className="profile-avatar">{profile.name.charAt(0)}</div>
                  <span className="name-text">Renter</span>
                  <Icon id="chevron-down" size={16} />
                </button>
                <div className={`profile-dropdown ${profileOpen ? "show" : ""}`}>
                  <a href="#" onClick={(e) => { e.preventDefault(); navigate("/renter-dashboard/my-rentals"); setProfileOpen(false); }}>My Rentals</a>
                  <a href="#" onClick={(e) => { e.preventDefault(); navigate("/renter-dashboard/settings"); setProfileOpen(false); }}>Settings</a>
                  <button className="logout" onClick={handleLogout}>Logout</button>
                </div>
              </div>
            </div>
          </header>
          <div className="content">{renderPage()}</div>
        </div>
      </div>

      {/* ══ CHECKOUT MODAL — inline JSX, NOT a sub-component ══ */}
      {modalOpen && createPortal(
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)", padding: 16,
          }}
        >
          <div style={{
            background: "#fff", borderRadius: 24,
            boxShadow: "0 25px 60px rgba(0,0,0,0.2)",
            width: "100%", maxWidth: 520, overflow: "hidden",
            maxHeight: "90vh", display: "flex", flexDirection: "column",
          }}>

            {/* Header */}
            <div style={{
              padding: "20px 28px", borderBottom: "1px solid #f0f0f0",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111" }}>Checkout</h2>
              <button onClick={() => setModalOpen(false)}
                style={{ fontSize: 28, lineHeight: 1, color: "#9ca3af", background: "none", border: "none", cursor: "pointer" }}>
                ×
              </button>
            </div>

            {/* Progress Steps */}
            <div style={{ padding: "28px 32px 16px" }}>
              <div style={{ display: "flex", alignItems: "flex-start" }}>
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} style={{ display: "flex", alignItems: "flex-start", flex: n < 4 ? 1 : 0 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div style={dotStyle(n)}>
                        {n < modalStep
                          ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                          : n}
                      </div>
                      <p style={labelStyle(n)}>
                        {stepLabels[n - 1].split("\n").map((line, i) => (
                          <span key={i}>{line}{i === 0 && stepLabels[n - 1].includes("\n") && <br />}</span>
                        ))}
                      </p>
                    </div>
                    {n < 4 && <div style={lineStyle(n)} />}
                  </div>
                ))}
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: "8px 32px 28px", flex: 1, overflowY: "auto", minHeight: 220 }}>

              {/* Step 1 */}
              {modalStep === 1 && (
                <div>
                  {cart.map((item) => (
                    <div key={item.product.id} style={{
                      background: "#f9fafb", borderRadius: 16, padding: "18px 20px",
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      border: "1px solid #e5e7eb", marginBottom: 10,
                    }}>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: 17, color: "#111" }}>{item.product.name}</p>
                        <p style={{ color: "#6b7280", marginTop: 4, fontSize: 14 }}>{item.product.tenure || "Monthly"}</p>
                      </div>
                      <p style={{ fontSize: 20, fontWeight: 700, color: "#111" }}>
                        Rs. {getPrice(item.product).toLocaleString()}
                      </p>
                    </div>
                  ))}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16, paddingTop: 16, borderTop: "1px solid #e5e7eb" }}>
                    <span style={{ fontWeight: 700, fontSize: 17, color: "#111" }}>Total</span>
                    <span style={{ fontWeight: 700, fontSize: 22, color: "#2563eb" }}>Rs. {getTotal().toLocaleString()}</span>
                  </div>
                </div>
              )}

              {/* Step 2 */}
              {modalStep === 2 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  {[
                    { label: "Full Name", key: "name", type: "text" },
                    { label: "Delivery Address", key: "address", type: "text" },
                    { label: "Phone Number", key: "phone", type: "tel" },
                  ].map(({ label, key, type }) => (
                    <div key={key}>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#4b5563", marginBottom: 8 }}>{label}</label>
                      <input
                        type={type}
                        value={deliveryInfo[key]}
                        onChange={(e) => setDeliveryInfo((prev) => ({ ...prev, [key]: e.target.value }))}
                        style={{
                          width: "100%", padding: "14px 18px", border: "1px solid #d1d5db",
                          borderRadius: 14, fontSize: 15, outline: "none", color: "#111", boxSizing: "border-box",
                        }}
                        onFocus={(e) => e.target.style.borderColor = "#2563eb"}
                        onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Step 3 */}
              {modalStep === 3 && (
                <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: "20px 22px" }}>
                  {cart.map((item) => (
                    <div key={item.product.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                      <span style={{ color: "#374151", fontWeight: 500 }}>{item.product.name} ({item.product.tenure || "Monthly"})</span>
                      <span style={{ fontWeight: 600 }}>Rs. {getPrice(item.product).toLocaleString()}</span>
                    </div>
                  ))}
                  <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 16, marginTop: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                      <span style={{ color: "#6b7280" }}>Delivery To</span>
                      <span style={{ fontWeight: 500 }}>{deliveryInfo.name}</span>
                    </div>
                    <p style={{ color: "#6b7280", fontSize: 13, textAlign: "right" }}>{deliveryInfo.address}</p>
                    <p style={{ color: "#6b7280", fontSize: 13, textAlign: "right" }}>{deliveryInfo.phone}</p>
                  </div>
                  <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 16, marginTop: 16, display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 17 }}>
                    <span>Total</span>
                    <span style={{ color: "#2563eb" }}>Rs. {getTotal().toLocaleString()}</span>
                  </div>
                </div>
              )}

              {/* Step 4 */}
              {modalStep === 4 && (
                <div style={{ textAlign: "center", padding: "32px 0" }}>
                  <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                    <svg width="42" height="42" fill="none" viewBox="0 0 24 24" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3 style={{ fontSize: 22, fontWeight: 700, color: "#15803d" }}>Booking Confirmed!</h3>
                  <p style={{ color: "#6b7280", marginTop: 10, fontSize: 14, lineHeight: 1.6 }}>
                    Your rental order has been placed successfully.<br />Thank you for choosing RentalHub.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{ padding: "16px 32px", borderTop: "1px solid #f0f0f0", background: "#f9fafb", display: "flex", alignItems: "center" }}>
              {modalStep > 1 && modalStep < 4
                ? <button onClick={() => setModalStep((s) => s - 1)}
                    style={{ padding: "12px 24px", borderRadius: 14, fontSize: 14, fontWeight: 500, color: "#4b5563", background: "none", border: "none", cursor: "pointer" }}
                    onMouseOver={(e) => e.currentTarget.style.background = "#e5e7eb"}
                    onMouseOut={(e) => e.currentTarget.style.background = "none"}
                  >← Back</button>
                : <div />
              }

              {modalStep < 3 && (
                <button onClick={() => setModalStep((s) => s + 1)}
                  style={{ marginLeft: "auto", background: "#2563eb", color: "#fff", padding: "14px 36px", borderRadius: 14, fontSize: 16, fontWeight: 700, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 14px rgba(37,99,235,0.35)" }}
                  onMouseOver={(e) => e.currentTarget.style.opacity = "0.88"}
                  onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
                >
                  Next <span style={{ fontSize: 22, lineHeight: 1 }}>›</span>
                </button>
              )}

              {modalStep === 3 && (
                <button onClick={confirmOrder}
                  style={{ marginLeft: "auto", background: "#2563eb", color: "#fff", padding: "14px 32px", borderRadius: 14, fontSize: 16, fontWeight: 700, border: "none", cursor: "pointer", boxShadow: "0 4px 14px rgba(37,99,235,0.35)" }}
                  onMouseOver={(e) => e.currentTarget.style.opacity = "0.88"}
                  onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
                >
                  ✓ Confirm &amp; Pay
                </button>
              )}

              {modalStep === 4 && (
                <button onClick={() => { setModalOpen(false); navigate("/renter-dashboard/my-rentals"); }}
                  style={{ marginLeft: "auto", background: "#16a34a", color: "#fff", padding: "14px 36px", borderRadius: 14, fontSize: 16, fontWeight: 700, border: "none", cursor: "pointer", boxShadow: "0 4px 14px rgba(22,163,74,0.35)" }}
                  onMouseOver={(e) => e.currentTarget.style.opacity = "0.88"}
                  onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
                >
                  Done
                </button>
              )}
            </div>

          </div>
        </div>,
        document.body
      )}

      {/* TOAST */}
      {createPortal(
        <div className={`toast ${toast.show ? "show" : ""}`}>
          <div className="toast-title">{toast.title}</div>
          <div className="toast-desc">{toast.desc}</div>
        </div>,
        document.body
      )}
    </>
  );
}