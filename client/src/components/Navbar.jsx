import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav style={{
      display: "flex",
      justifyContent: "center",
      gap: "40px",
      padding: "16px 0",
      backgroundColor: "#a8c8e8",
      alignItems: "center"
    }}>
      {["Furniture", "Trends", "Blog", "About Us"].map(item => (
        <a
          key={item}
          href="#"
          style={{
            textDecoration: "none",
            color: "#1a1a2e",
            fontWeight: "500",
            fontSize: "15px"
          }}
        >
          {item}
        </a>
      ))}
      <button
        onClick={() => navigate("/login")}
        style={{
          color: "#1a1a2e",
          fontWeight: "500",
          fontSize: "15px",
          background: "none",
          border: "none",
          cursor: "pointer"
        }}
      >
        Login
      </button>
    </nav>
  );
}