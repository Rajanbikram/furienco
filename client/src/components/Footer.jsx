export default function Footer() {
  return (
    <footer style={{
      backgroundColor: "#f0f0f0",
      padding: "30px 80px",
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: "40px",
      borderTop: "1px solid #ddd"
    }}>
      <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "4px" }}>
        <h4 style={{ color: "#1a1a2e", marginBottom: "10px", fontWeight: "600" }}>Furlenco</h4>
        <p style={{ color: "#666", fontSize: "13px", lineHeight: "1.6" }}>
          Explore our blog for the latest trends in home decor, expert advice on
          furniture care, and creative ideas to transform your living spaces.
        </p>
      </div>

      <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "4px" }}>
        <h4 style={{ color: "#1a1a2e", marginBottom: "14px", fontWeight: "600" }}>Quick Link</h4>
        {["Shop", "Reviews", "About", "Contact"].map(link => (
          <a
            key={link}
            href="#"
            style={{
              display: "block",
              color: "#555",
              textDecoration: "none",
              fontSize: "14px",
              marginBottom: "8px"
            }}
          >
            {link}
          </a>
        ))}
      </div>

      <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "4px" }}>
        <h4 style={{ color: "#1a1a2e", marginBottom: "14px", fontWeight: "600" }}>Customer Care</h4>
        {["Help Center", "Returns & Refunds", "Terms & Conditions"].map(link => (
          <a
            key={link}
            href="#"
            style={{
              display: "block",
              color: "#555",
              textDecoration: "none",
              fontSize: "14px",
              marginBottom: "8px"
            }}
          >
            {link}
          </a>
        ))}
      </div>
    </footer>
  );
}