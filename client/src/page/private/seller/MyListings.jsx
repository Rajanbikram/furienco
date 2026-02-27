import { useState, useEffect } from "react";
import API from "../../../utils/axios";

const IMAGE_BASE = "http://localhost:5000";

export default function MyListings() {
  const [listings, setListings] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState({ id: null, price: "", description: "" });

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const res = await API.get("/seller/listings");
      setListings(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Pause = Delete from DB and UI
  const deleteListing = async (id) => {
    try {
      await API.delete(`/seller/listings/${id}`);
      setListings(listings.filter((l) => l.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (listing) => {
    setEditData({ id: listing.id, price: listing.price, description: listing.description });
    setEditModal(true);
  };

  const saveEdit = async () => {
    try {
      await API.put(`/seller/listings/${editData.id}`, {
        price: editData.price,
        description: editData.description,
      });
      setEditModal(false);
      fetchListings();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1 className="page-title">My Listings</h1>

      <div className="listings-grid">
        {listings.map((l) => (
          <div className="listing-card" key={l.id}>
            <div className="listing-img">
              {l.imageUrl ? (
                <img src={`${IMAGE_BASE}${l.imageUrl}`} alt={l.name} className="listing-img-photo" />
              ) : (
                <span>No Image</span>
              )}
            </div>
            <div className="listing-body">
              <div className="listing-header">
                <div className="listing-name">{l.name}</div>
                <span className="badge badge-success-solid">Active</span>
              </div>
              <div className="listing-price">Rs. {l.price}/mo</div>
              <div className="listing-tenure">{l.tenure}</div>
              <div className="listing-stats">
                <span>👁 {l.views} views</span>
                <span>🛒 {l.rents} rents</span>
              </div>
              <div className="listing-actions">
                <button className="btn-edit" onClick={() => openEditModal(l)}>✏️ Edit</button>
                <button className="btn-toggle btn-pause" onClick={() => deleteListing(l.id)}>
                  Pause
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {listings.length === 0 && (
        <div className="empty-state">No listings yet. Add your first listing!</div>
      )}

      {editModal && (
        <div className="modal-overlay open">
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">Edit Listing</div>
              <button className="modal-close" onClick={() => setEditModal(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="form-group">
              <label className="form-label">Price</label>
              <input className="form-input" value={editData.price}
                onChange={(e) => setEditData({ ...editData, price: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-textarea" rows="3" value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}></textarea>
            </div>
            <button className="btn-primary" onClick={saveEdit}>Save Changes</button>
          </div>
        </div>
      )}
    </div>
  );
}