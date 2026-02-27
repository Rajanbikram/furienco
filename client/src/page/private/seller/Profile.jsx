import { useState } from "react";

export default function Profile() {
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

  const [form, setForm] = useState({
    name: storedUser.customerName || "",
    email: storedUser.customerEmail || "",
    phone: storedUser.customerPhone || "",
    address: storedUser.customerAddress || "",
    bio: storedUser.bio || "",
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveProfile = (e) => {
    e.preventDefault();
    // Update localStorage with new values
    const updatedUser = {
      ...storedUser,
      customerName: form.name,
      customerEmail: form.email,
    };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <h1 className="page-title">Profile Settings</h1>
      <div className="profile-grid">

        {/* LEFT CARD */}
        <div className="card profile-card-center">
          <div className="profile-big-avatar">
            {form.name ? form.name.charAt(0).toUpperCase() : "?"}
          </div>
          <div className="profile-card-name">{form.name || "N/A"}</div>
          <div className="profile-card-email">{form.email || "N/A"}</div>
          {form.bio && <div className="profile-card-bio">{form.bio}</div>}
          <div className="profile-card-info">
            {form.phone && (
              <div className="profile-info-row">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <span>{form.phone}</span>
              </div>
            )}
            {form.address && (
              <div className="profile-info-row">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <span>{form.address}</span>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="card">
          <div className="card-title">Edit Profile</div>
          <form onSubmit={saveProfile}>
            <div className="form-group">
              <div className="form-row">
                <div>
                  <label className="form-label">Full Name</label>
                  <input className="form-input" name="name" value={form.name} onChange={handleChange} />
                </div>
                <div>
                  <label className="form-label">Email</label>
                  <input className="form-input" name="email" type="email" value={form.email} onChange={handleChange} />
                </div>
              </div>
            </div>
            <div className="form-group">
              <div className="form-row">
                <div>
                  <label className="form-label">Phone</label>
                  <input className="form-input" name="phone" value={form.phone} onChange={handleChange} />
                </div>
                <div>
                  <label className="form-label">Address</label>
                  <input className="form-input" name="address" value={form.address} onChange={handleChange} />
                </div>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Bio</label>
              <textarea className="form-textarea" name="bio" rows="3" value={form.bio} onChange={handleChange}></textarea>
            </div>
            <div className="save-row">
              <button type="submit" className="btn-save">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                  <polyline points="17 21 17 13 7 13 7 21"/>
                  <polyline points="7 3 7 8 15 8"/>
                </svg>
                Save Changes
              </button>
              {saved && <span className="save-msg">Profile updated successfully!</span>}
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}