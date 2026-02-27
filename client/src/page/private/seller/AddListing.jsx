import { useState, useRef } from "react";
import API from "../../../utils/axios";

export default function AddListing() {
  const [form, setForm] = useState({
    name: "", description: "", category: "",
    price: "", tenure: "3 months", location: "", tags: "",
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => formData.append(key, val));
      if (image) formData.append("image", image);
      await API.post("/seller/listings", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("success");
      setForm({ name: "", description: "", category: "", price: "", tenure: "3 months", location: "", tags: "" });
      setImage(null);
      setImagePreview(null);
    } catch (err) {
      setMessage("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="page-title">Add New Listing</h1>
      <div className="card card-narrow">

        {message === "success" && <div className="alert-success">Listing submitted successfully!</div>}
        {message === "error" && <div className="alert-error">Failed to submit listing!</div>}

        <div className="form-group">
          <label className="form-label">Product Title</label>
          <input className="form-input" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Mountain Bike" />
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-textarea" name="description" value={form.description} onChange={handleChange} rows="4" placeholder="Describe your product..."></textarea>
        </div>

        <div className="form-group">
          <div className="form-row">
            <div>
              <label className="form-label">Category</label>
              <select className="form-select" name="category" value={form.category} onChange={handleChange}>
                <option value="">Select category</option>
                <option>Electronics</option>
                <option>Vehicles</option>
                <option>Sports & Outdoors</option>
                <option>Tools & Equipment</option>
                <option>Furniture</option>
              </select>
            </div>
            <div>
              <label className="form-label">Price (Rs.)</label>
              <input className="form-input" name="price" value={form.price} onChange={handleChange} type="number" placeholder="e.g. 5000" />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Tenure (months)</label>
          <div className="tenure-group">
            {["3 months", "6 months", "12 months"].map((t) => (
              <button key={t} className={`tenure-btn ${form.tenure === t ? "active" : ""}`}
                onClick={() => setForm({ ...form, tenure: t })}>{t}</button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Location</label>
          <select className="form-select" name="location" value={form.location} onChange={handleChange}>
            <option value="">Select location</option>
            <option>Kathmandu</option>
            <option>Pokhara</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Tags</label>
          <input className="form-input" name="tags" value={form.tags} onChange={handleChange} placeholder="eco-friendly, premium, budget..." />
        </div>

        <div className="form-group">
          <label className="form-label">Product Images</label>
          <input type="file" accept="image/png, image/jpeg" ref={fileInputRef}
            onChange={handleImageChange} className="input-hidden" />
          {imagePreview ? (
            <div className="image-preview-box">
              <img src={imagePreview} alt="Preview" className="image-preview" />
              <button className="image-remove-btn" onClick={removeImage}>✕ Remove</button>
            </div>
          ) : (
            <div className="upload-box" onClick={() => fileInputRef.current.click()}
              onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="upload-icon">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              <p>Click to upload or drag & drop</p>
              <p className="small">PNG, JPG up to 5MB</p>
            </div>
          )}
        </div>

        <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? "Submitting..." : "Submit Listing"}
        </button>
      </div>
    </div>
  );
}