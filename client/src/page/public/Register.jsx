import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../utils/axios";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    setLoading(true);
    try {
      const data = {
        customerName: formData.fullName,
        customerEmail: formData.email,
        customerPhone: "N/A",
        customerAddress: "N/A",
        password: formData.password
      };
      await registerUser(data);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: "Full Name", name: "fullName", type: "text" },
    { label: "Email ID", name: "email", type: "email" },
    { label: "Password", name: "password", type: "password" },
    { label: "Confirm Password", name: "confirmPassword", type: "password" },
  ];

  return (
    <div className="auth-wrapper">

      {/* Left Blue Panel */}
      <div className="auth-left">
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
          <h2 className="auth-title">Create an Account</h2>
          <p className="auth-subtitle">Sign Up</p>

          {error && <div className="error-box">{error}</div>}

          <form onSubmit={handleSubmit}>
            {fields.map(({ label, name, type }) => (
              <div className="form-row" key={name}>
                <span className="form-label">{label}</span>
                <input
                  type={type} name={name} value={formData[name]}
                  onChange={handleChange} required
                  className="form-input"
                />
              </div>
            ))}

            <button type="submit" disabled={loading} className="btn-register">
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="auth-bottom-text">
            Already have an account?{" "}
            <span className="auth-link" onClick={() => navigate("/login")}>
              Sign in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}