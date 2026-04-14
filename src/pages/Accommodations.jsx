import { useState } from "react";

const Accommodations = () => {
  const [rentRange, setRentRange] = useState("$300 - $900");
  const [distance, setDistance] = useState("Under 1km");
  const [gender, setGender] = useState("Any");

  const listings = [
    {
      id: 1, title: "Urban Loft Suite", price: 450, tag: "FLATMATE WANTED", tagColor: "#3b82f6", dist: "0.3 KM AWAY", distColor: "#22c55e",
      desc: "Looking for a quiet, study-oriented flatmate to share this bright, 2...",
      poster: { name: "Alex Chen", role: "CS Junior • Male, Frisco", img: "Alex" },
      img: "https://images.unsplash.com/photo-1555636222-cae831e670b3?w=400&q=80",
    },
    {
      id: 2, title: "Scholar's Garden Villa", price: 850, tag: "ENTIRE HOME", tagColor: "#a855f7", dist: "1.2 KM AWAY", distColor: "#f59e0b",
      desc: "Spacious 3BHK villa. Perfect for a group of 3-4 students. Fully furnishe...",
      poster: { name: "Priya Sharma", role: "Verified Owner • Any Gender", img: "Priya" },
      img: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&q=80",
    },
    {
      id: 3, title: "Shared Campus Dorm", price: 320, tag: "FLATMATE WANTED", tagColor: "#3b82f6", dist: "0.1 KM AWAY", distColor: "#22c55e",
      desc: "Looking for a co-ed flatmate. Very close to the Engineering Block...",
      poster: { name: "Jordan Mills", role: "M&A Senior • Co-Ed, OK", img: "Jordan" },
      img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80",
    },
  ];

  const amenities = ["WiFi", "GYM", "AC", "FOOD"];
  const [selectedAmenities, setSelectedAmenities] = useState(["WiFi"]);

  const toggleAmenity = (a) => setSelectedAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "#1a202c", minHeight: "100vh", backgroundColor: "#f7f8fc" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: "0 0 4px", fontSize: 26, fontWeight: 700 }}>Student Living</h2>
          <p style={{ margin: 0, fontSize: 13, color: "#94a3b8" }}>Find your ideal home and the perfect community near SRM Campus. Modern living for modern scholars.</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 10, padding: "9px 16px", fontWeight: 600, fontSize: 13, cursor: "pointer", color: "#475569", display: "flex", alignItems: "center", gap: 6 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
            Map View
          </button>
          <button style={{ background: "#3b82f6", border: "none", borderRadius: 10, padding: "9px 16px", fontWeight: 600, fontSize: 13, cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", gap: 6 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Post a Listing
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ background: "#fff", borderRadius: 14, padding: "14px 20px", display: "flex", gap: 20, alignItems: "flex-end", marginBottom: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", flexWrap: "wrap" }}>
        <FilterSelect label="RENT RANGE" value={rentRange} options={["$300 - $900", "$300 - $600", "$600 - $900", "$900+"]} onChange={setRentRange} />
        <FilterSelect label="DISTANCE" value={distance} options={["Under 1km", "Under 2km", "Under 3km", "Any"]} onChange={setDistance} />
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Gender Preference</div>
          <div style={{ display: "flex", gap: 4 }}>
            {["Any", "Co-Ed", "Same"].map(g => (
              <button key={g} onClick={() => setGender(g)} style={{ border: "none", borderRadius: 6, padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", background: gender === g ? "#1a202c" : "#f1f5f9", color: gender === g ? "#fff" : "#64748b" }}>{g}</button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Amenities</div>
          <div style={{ display: "flex", gap: 4 }}>
            {amenities.map(a => (
              <button key={a} onClick={() => toggleAmenity(a)} style={{ border: "none", borderRadius: 6, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", background: selectedAmenities.includes(a) ? "#eff6ff" : "#f1f5f9", color: selectedAmenities.includes(a) ? "#3b82f6" : "#64748b" }}>{a}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Listing Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: 24 }}>
        {listings.map(l => (
          <div key={l.id} style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <div style={{ position: "relative" }}>
              <img src={l.img} alt={l.title} style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }} onError={e => { e.target.style.background = "#e2e8f0"; e.target.src = ""; }} />
              <div style={{ position: "absolute", top: 10, left: 10, display: "flex", gap: 6 }}>
                <span style={{ background: l.tagColor, color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 6, textTransform: "uppercase", letterSpacing: 0.4 }}>{l.tag}</span>
                <span style={{ background: "#fff", color: l.distColor, fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 6 }}>{l.dist}</span>
              </div>
            </div>
            <div style={{ padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>{l.title}</h4>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: 18, fontWeight: 700, color: "#1a202c" }}>${l.price}</span>
                  <span style={{ fontSize: 11, color: "#94a3b8" }}>/mo</span>
                </div>
              </div>
              <p style={{ margin: "0 0 12px", fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>{l.desc}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${l.poster.img}`} alt={l.poster.name} style={{ width: 28, height: 28, borderRadius: "50%", background: "#e8f0ff" }} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, lineHeight: 1 }}>{l.poster.name}</div>
                  <div style={{ fontSize: 10, color: "#94a3b8" }}>{l.poster.role}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button style={{ flex: 1, background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: 10, padding: "8px", fontWeight: 600, fontSize: 12, cursor: "pointer", color: "#475569" }}>View Details</button>
                <button style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: 10, padding: "8px 10px", cursor: "pointer" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Featured Listing */}
      <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex" }}>
          <div style={{ flex: 1, padding: "28px 32px" }}>
            <span style={{ background: "#fef9c3", color: "#a16207", fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>⭐ Trending Listing</span>
            <h3 style={{ margin: "12px 0 6px", fontSize: 22, fontWeight: 700 }}>Lakeside Residency –<br />Private Room</h3>
            <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#64748b" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                0.8 km to Campus
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#64748b" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/></svg>
                Gigabit Internet
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#64748b" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                Free Parking
              </span>
            </div>
            <p style={{ margin: "0 0 20px", fontSize: 13, color: "#64748b", lineHeight: 1.7, maxWidth: 420 }}>
              Experience a premium stay at Lakeside. The room is fully furnished with a private balcony overlooking the campus lake. Shared kitchen with 2 other friendly graduate students. Utilities are split equally.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={{ background: "#3b82f6", border: "none", borderRadius: 10, padding: "11px 22px", fontWeight: 600, fontSize: 13, cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", gap: 7 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                Chat with Owner
              </button>
              <button style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: 10, padding: "11px 14px", cursor: "pointer" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              </button>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: 2, width: 320, flexShrink: 0 }}>
            <img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80" alt="kitchen" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            <img src="https://images.unsplash.com/photo-1586105251261-72a756497a11?w=400&q=80" alt="bathroom" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
        </div>
      </div>
    </div>
  );
};

const FilterSelect = ({ label, value, options, onChange }) => (
  <div>
    <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>{label}</div>
    <select value={value} onChange={e => onChange(e.target.value)} style={{ border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "6px 28px 6px 10px", fontSize: 13, fontWeight: 500, color: "#1a202c", background: "#fff", cursor: "pointer", appearance: "none", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center" }}>
      {options.map(o => <option key={o}>{o}</option>)}
    </select>
  </div>
);

export default Accommodations;
