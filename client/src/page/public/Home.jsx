import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", minHeight: "100vh" }}>

      {/* Navbar */}
      <nav style={{
        display: "flex", justifyContent: "center", gap: "40px",
        padding: "16px 0", backgroundColor: "#a8c8e8", alignItems: "center"
      }}>

        {/* About Us → Browse page */}
        <button
          onClick={() => navigate("/browse")}
          style={{ textDecoration: "none", color: "#1a1a2e", fontWeight: "500", fontSize: "15px", background: "none", border: "none", cursor: "pointer" }}
        >About Us</button>
        <button
          onClick={() => navigate("/login")}
          style={{ textDecoration: "none", color: "#1a1a2e", fontWeight: "500", fontSize: "15px", background: "none", border: "none", cursor: "pointer" }}
        >Login</button>
      </nav>

      {/* Hero Section */}
      <div style={{
        backgroundColor: "#7eb8e0", display: "flex", alignItems: "center",
        justifyContent: "space-between", padding: "60px 80px", minHeight: "320px"
      }}>
        <div style={{ maxWidth: "400px" }}>
          <h1 style={{ fontSize: "36px", fontWeight: "700", color: "#1a1a2e", marginBottom: "12px", lineHeight: "1.2" }}>
            Elevate Your Space<br />with Our Furniture.
          </h1>
          <p style={{ color: "#2c3e6b", fontSize: "14px", marginBottom: "28px" }}>
            Discover luxurious, high-quality furniture crafted for comfort and style
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={() => navigate("/register")}
              style={{
                backgroundColor: "#1a1a2e", color: "white", border: "none",
                padding: "12px 28px", borderRadius: "4px", fontSize: "15px",
                cursor: "pointer", fontWeight: "600"
              }}
            >Get Started</button>
            <button
              onClick={() => navigate("/browse")}
              style={{
                backgroundColor: "transparent", color: "#1a1a2e",
                border: "2px solid #1a1a2e",
                padding: "12px 28px", borderRadius: "4px", fontSize: "15px",
                cursor: "pointer", fontWeight: "600"
              }}
            >Browse Products</button>
          </div>
        </div>
        <div>
          <img
            src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80"
            alt="Blue Sofa"
            style={{ width: "420px", borderRadius: "8px", objectFit: "cover" }}
          />
        </div>
      </div>

      {/* Best Choose Section */}
      <div style={{ backgroundColor: "#f0f0f0", padding: "40px 80px" }}>
        <h2 style={{ textAlign: "center", fontSize: "22px", fontWeight: "700", marginBottom: "30px", color: "#1a1a2e" }}>
          Best Choose our Furniture
        </h2>
        <div style={{ textAlign: "center" }}>
          <button
            onClick={() => navigate("/browse")}
            style={{
              backgroundColor: "#3b82f6", color: "white", border: "none",
              padding: "12px 32px", borderRadius: "6px", fontSize: "15px",
              cursor: "pointer", fontWeight: "600"
            }}
          >View All Products →</button>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        backgroundColor: "#f0f0f0", padding: "30px 80px",
        display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "40px", borderTop: "1px solid #ddd"
      }}>
        <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "4px" }}>
          <h4 style={{ color: "#1a1a2e", marginBottom: "10px", fontWeight: "600" }}>Furlenco</h4>
          <p style={{ color: "#666", fontSize: "13px", lineHeight: "1.6" }}>
            Explore our blog for the latest trends in home decor, expert advice on furniture care, and creative ideas to transform your living spaces.
          </p>
        </div>
        <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "4px" }}>
          <h4 style={{ color: "#1a1a2e", marginBottom: "14px", fontWeight: "600" }}>Quick Link</h4>
          {["Shop", "Reviews", "About", "Contact"].map(link => (
            <a key={link} href="#" style={{ display: "block", color: "#555", textDecoration: "none", fontSize: "14px", marginBottom: "8px" }}>{link}</a>
          ))}
        </div>
        <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "4px" }}>
          <h4 style={{ color: "#1a1a2e", marginBottom: "14px", fontWeight: "600" }}>Customer Care</h4>
          {["Help Center", "Returns & Refunds", "Terms & Conditions"].map(link => (
            <a key={link} href="#" style={{ display: "block", color: "#555", textDecoration: "none", fontSize: "14px", marginBottom: "8px" }}>{link}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}