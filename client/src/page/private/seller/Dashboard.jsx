import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AddListing from "./AddListing";
import MyListings from "./MyListings";
import Orders from "./Orders";
import Customers from "./Customers";
import Profile from "./Profile";
import API from "../../../utils/axios";

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const getPageFromPath = () => {
    const path = location.pathname.replace("/dashboard", "").replace("/", "");
    return path || "dashboard";
  };

  const [activePage, setActivePage] = useState(getPageFromPath());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [stats, setStats] = useState({ listings: 0, active: 0, orders: 0, revenue: "Rs. 0" });

  useEffect(() => {
    setActivePage(getPageFromPath());
  }, [location.pathname]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [listRes, orderRes] = await Promise.all([
        API.get("/seller/listings"),
        API.get("/seller/orders"),
      ]);
      const listings = listRes.data.data;
      const orders = orderRes.data.data;
      const active = listings.filter((l) => l.status === "Active").length;
      setStats({
        listings: listings.length,
        active,
        orders: orders.length,
        revenue: "Rs. " + orders.length * 3500,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navItems = [
    {
      key: "dashboard",
      label: "Dashboard",
      path: "/dashboard",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
        </svg>
      ),
    },
    {
      key: "add-listing",
      label: "Add Listing",
      path: "/dashboard/add-listing",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      ),
    },
    {
      key: "my-listings",
      label: "My Listings",
      path: "/dashboard/my-listings",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
      ),
    },
    {
      key: "orders",
      label: "Orders",
      path: "/dashboard/orders",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
      ),
    },
    {
      key: "customers",
      label: "Customers",
      path: "/dashboard/customers",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      key: "profile",
      label: "Profile",
      path: "/dashboard/profile",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
  ];

  const renderPage = () => {
    switch (activePage) {
      case "add-listing": return <AddListing />;
      case "my-listings": return <MyListings />;
      case "orders":      return <Orders />;
      case "customers":   return <Customers />;
      case "profile":     return <Profile />;
      default: return (
        <div>
          <h1 className="page-title">Dashboard</h1>
          <div className="summary-grid">
            <div className="summary-card">
              <div className="summary-card-header">
                <div className="summary-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" />
                    <line x1="8" y1="18" x2="21" y2="18" />
                  </svg>
                </div>
                <span className="summary-label">Total Listings</span>
              </div>
              <div className="summary-value">{stats.listings}</div>
            </div>
            <div className="summary-card">
              <div className="summary-card-header">
                <div className="summary-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <span className="summary-label">Active Listings</span>
              </div>
              <div className="summary-value">{stats.active}</div>
            </div>
            <div className="summary-card">
              <div className="summary-card-header">
                <div className="summary-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                </div>
                <span className="summary-label">Total Orders</span>
              </div>
              <div className="summary-value">{stats.orders}</div>
            </div>
            <div className="summary-card">
              <div className="summary-card-header">
                <div className="summary-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <span className="summary-label">Total Revenue</span>
              </div>
              <div className="summary-value">{stats.revenue}</div>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="app">
      {/* SIDEBAR */}
      <aside className={`sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">Rental<span>Hub</span></div>
          <button className="sidebar-toggle" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {sidebarCollapsed
                ? <polyline points="9 18 15 12 9 6" />
                : <polyline points="15 18 9 12 15 6" />}
            </svg>
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <a
              key={item.key}
              href="#"
              className={`sidebar-link ${activePage === item.key ? "active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                navigate(item.path); // ✅ URL change hunxa
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="main-area">
        {/* TOPBAR */}
        <header className="topbar">
          <div className="search-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input type="text" placeholder="Search..." />
          </div>
          <div className="topbar-right">
            <button className="notif-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className="notif-dot"></span>
            </button>
            <div className="profile-wrapper">
              <button className="profile-btn" onClick={() => setProfileOpen(!profileOpen)}>
                <div className="profile-avatar">S</div>
                <span className="profile-name">Seller</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {profileOpen && <div className="overlay open" onClick={() => setProfileOpen(false)}></div>}
              <div className={`profile-dropdown ${profileOpen ? "open" : ""}`}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/dashboard/profile"); // ✅ URL change hunxa
                    setProfileOpen(false);
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  Profile
                </a>
                <hr />
                <a
                  href="#"
                  className="danger"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLogout();
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Logout
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="content">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}