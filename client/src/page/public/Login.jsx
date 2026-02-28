import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../utils/axios";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await loginUser({ email: formData.email, password: formData.password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.data));
      const role = res.data.data.role;
      if (role === "seller") {
        navigate("/dashboard");
      } else {
        navigate("/renter-dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      {/* Left Blue Panel */}
      <div className="auth-left">
        {/* Back to Home button */}
        <button
          onClick={() => navigate("/")}
          style={{
            position: "absolute", top: 20, left: 20,
            background: "rgba(255,255,255,0.25)", color: "#fff",
            border: "1px solid rgba(255,255,255,0.5)", borderRadius: 8,
            padding: "8px 16px", fontSize: "13px", fontWeight: 600,
            cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
          }}
        >
          ← Back to Home
        </button>

        <div className="auth-logo-box">
          <span className="auth-logo-text">
            Furlenco<span className="auth-logo-icon">⟳</span>
          </span>
        </div>
        <h2 className="auth-brand-name">Furlenco</h2>
        <p className="auth-brand-tagline">Live Fully, Rent Smartly</p>
      </div>

      {/* Right White Panel */}
      <div className="auth-right">
        <div className="auth-form-container">
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Sign in to continue</p>
          {error && <div className="error-box">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <span className="form-label">Email ID</span>
              <input
                type="email" name="email" value={formData.email}
                onChange={handleChange} required
                className="form-input"
              />
            </div>
            <div className="form-row">
              <span className="form-label">Password</span>
              <input
                type="password" name="password" value={formData.password}
                onChange={handleChange} required
                className="form-input"
              />
            </div>
            <div className="form-options">
              <label className="form-remember">
                <input type="checkbox" /> Remember Me?
              </label>
              <a href="#" className="form-forgot">Forgot Password?</a>
            </div>
            <button type="submit" disabled={loading} className="btn-login">
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p className="auth-bottom-text">
            Don't have an account?{" "}
            <span className="auth-link" onClick={() => navigate("/register")}>
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}