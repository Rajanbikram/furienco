import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/axios";

export default function Browse() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");
  const [filterPrice, setFilterPrice] = useState(50000);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/renter/products")
      .then((res) => setProducts(res.data.data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const categories = ["all", ...new Set(products.map((p) => p.category).filter(Boolean))];
  const locations = ["all", ...new Set(products.map((p) => p.location).filter(Boolean))];

  const filtered = products.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterCategory !== "all" && p.category !== filterCategory) return false;
    if (filterLocation !== "all" && p.location !== filterLocation) return false;
    if ((parseInt(p.price) || 0) > filterPrice) return false;
    return true;
  });

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", minHeight: "100vh", background: "#fafbfc" }}>

      {/* Navbar */}
      <nav style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "16px 80px", backgroundColor: "#a8c8e8",
      }}>
        <span style={{ fontWeight: "700", fontSize: "18px", color: "#1a1a2e" }}>RentalHub</span>
        <div />
        <button
          onClick={() => navigate("/login")}
          style={{
            background: "#1a1a2e", color: "#fff", border: "none",
            padding: "8px 22px", borderRadius: "4px", fontSize: "14px",
            cursor: "pointer", fontWeight: "600",
          }}
        >Login</button>
      </nav>

      <div style={{ maxWidth: 1152, margin: "0 auto", padding: "32px 16px" }}>
        <h1 style={{ fontSize: "1.875rem", fontWeight: 700, color: "#1e2a3a" }}>Browse Rentals</h1>

        {/* Search */}
        <div style={{ position: "relative", maxWidth: 576, marginTop: 20 }}>
          <div style={{
            display: "flex", alignItems: "center", border: "1px solid #e4e7ec",
            borderRadius: 8, background: "#fff", padding: "10px 16px",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
          }}>
            <svg style={{ marginRight: 12, color: "#6b7a8d", flexShrink: 0 }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input
              type="text"
              placeholder="Search for rentals..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ flex: 1, border: "none", outline: "none", fontSize: "0.875rem", background: "transparent", color: "#1e2a3a" }}
            />
          </div>
        </div>

        {/* Filters */}
        <div style={{
          display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: 16,
          border: "1px solid #e4e7ec", borderRadius: 8, background: "#fff",
          padding: 16, marginTop: 20, boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        }}>
          {/* Category */}
          <div style={{ minWidth: 140 }}>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 500, color: "#6b7a8d", marginBottom: 4 }}>Category</label>
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
              style={{ width: "100%", padding: "8px 12px", border: "1px solid #e4e7ec", borderRadius: 6, fontSize: "0.875rem", background: "#fff", color: "#1e2a3a", outline: "none" }}>
              {categories.map(c => <option key={c} value={c}>{c === "all" ? "All Categories" : c}</option>)}
            </select>
          </div>

          {/* Location */}
          <div style={{ minWidth: 140 }}>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 500, color: "#6b7a8d", marginBottom: 4 }}>Location</label>
            <select value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)}
              style={{ width: "100%", padding: "8px 12px", border: "1px solid #e4e7ec", borderRadius: 6, fontSize: "0.875rem", background: "#fff", color: "#1e2a3a", outline: "none" }}>
              {locations.map(l => <option key={l} value={l}>{l === "all" ? "All Locations" : l}</option>)}
            </select>
          </div>

          {/* Price */}
          <div style={{ minWidth: 200, flex: 1, maxWidth: 280 }}>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 500, color: "#6b7a8d", marginBottom: 4 }}>
              Max Price: Rs. {filterPrice.toLocaleString()}
            </label>
            <input type="range" min="500" max="50000" step="500" value={filterPrice}
              onChange={(e) => setFilterPrice(Number(e.target.value))}
              style={{ width: "100%", accentColor: "#3b82f6" }} />
          </div>

          {/* Reset */}
          <button onClick={() => { setSearch(""); setFilterCategory("all"); setFilterLocation("all"); setFilterPrice(50000); }}
            style={{ padding: "8px 16px", border: "none", background: "none", color: "#6b7a8d", fontSize: "0.875rem", cursor: "pointer" }}>
            Reset Filters
          </button>
        </div>

        {/* Products */}
        <div style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: 16, color: "#1e2a3a" }}>All Products</h2>

          {loading ? (
            <p style={{ color: "#6b7a8d", textAlign: "center", marginTop: 24 }}>Loading products...</p>
          ) : filtered.length === 0 ? (
            <p style={{ color: "#6b7a8d", textAlign: "center", marginTop: 24 }}>No products match your filters.</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} onRent={() => navigate("/login")} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product, onRent }) {
  const [imgError, setImgError] = useState(false);
  const price = parseInt(product.price) || 0;

  return (
    <div style={{
      border: "1px solid #e4e7ec", borderRadius: 8, background: "#fff",
      overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      transition: "box-shadow 0.2s",
    }}
      onMouseOver={(e) => e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)"}
      onMouseOut={(e) => e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)"}
    >
      {/* Image */}
      <div style={{ height: 180, overflow: "hidden", background: "#f5f6f8", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {product.imageUrl && !imgError ? (
          <img
            src={`http://localhost:5000${product.imageUrl}`}
            alt={product.name}
            onError={() => setImgError(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="#d1d5db" strokeWidth="1.5"><path d="m16.5 9.4-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
        )}
      </div>

      <div style={{ padding: 12 }}>
        <h3 style={{ fontWeight: 600, fontSize: "0.875rem", color: "#1e2a3a" }}>{product.name}</h3>
        <p style={{ fontSize: "0.7rem", color: "#6b7a8d", marginTop: 2 }}>{product.category}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.7rem", color: "#6b7a8d", marginTop: 4 }}>
          <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          {product.location}
        </div>
        <div style={{ marginTop: 8 }}>
          <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "#1e2a3a" }}>Rs. {price.toLocaleString()}/mo</span>
        </div>
        <p style={{ fontSize: "0.7rem", color: "#6b7a8d", marginTop: 2 }}>{product.tenure || "Monthly"}</p>
        <button
          onClick={onRent}
          style={{
            display: "block", width: "100%", marginTop: 10, padding: "6px",
            border: "none", borderRadius: 6, background: "#3b82f6", color: "#fff",
            fontSize: "0.8rem", fontWeight: 500, cursor: "pointer",
          }}
          onMouseOver={(e) => e.currentTarget.style.background = "#2563eb"}
          onMouseOut={(e) => e.currentTarget.style.background = "#3b82f6"}
        >
          Rent Now
        </button>
      </div>
    </div>
  );
}