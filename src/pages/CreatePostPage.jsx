import { useState, useRef } from "react";
import Layout from "./Layout";
import { Image, X, ChevronDown, AlertCircle, CheckCircle2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SUGGESTED_TAGS = [
  "Computer Science", "Artificial Intelligence", "Web Development", "Cloud Computing",
  "Data Structures", "Machine Learning", "Hackathon", "Internship", "Placement",
  "Events", "Study Group", "Research", "Open Source", "UI/UX", "Project", "Rent", "Product", "Sale", "Resources"
];

export default function CreatePostPage() {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]); // [{ file, preview }]
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  // ── Tag helpers ──────────────────────────────────────────────
  const addTag = (tag) => {
    const trimmed = tag.trim();
    if (!trimmed || tags.includes(trimmed) || tags.length >= 5) return;
    setTags((prev) => [...prev, trimmed]);
    setTagInput("");
    setDropdownOpen(false);
    setErrors((e) => ({ ...e, tags: undefined }));
  };

  const removeTag = (tag) => setTags((prev) => prev.filter((t) => t !== tag));

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
    }
    if (e.key === "Backspace" && !tagInput && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const filteredSuggestions = SUGGESTED_TAGS.filter(
    (t) => t.toLowerCase().includes(tagInput.toLowerCase()) && !tags.includes(t)
  );

  // ── Image helpers ────────────────────────────────────────────
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }));
    setImages((prev) => [...prev, ...newImages].slice(0, 4)); // max 4
    e.target.value = "";
  };

  const removeImage = (idx) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[idx].preview);
      return prev.filter((_, i) => i !== idx);
    });
  };

  // ── Validation & submit ──────────────────────────────────────
  const validate = () => {
    const newErrors = {};
    if (!content.trim()) newErrors.content = "Post content cannot be empty.";
    else if (content.trim().length < 10) newErrors.content = "Post must be at least 10 characters.";
    if (tags.length === 0) newErrors.tags = "Please add at least one tag.";
    return newErrors;
  };

const handleSubmit = async () => {
  const errs = validate();
  setErrors(errs);
  if (Object.keys(errs).length !== 0) return;

  try {
    const token = localStorage.getItem("token"); // ✅ GET TOKEN

    const formData = new FormData();
    formData.append("content", content);
    formData.append("tags", JSON.stringify(tags));

    // images
    images.forEach((img) => {
      formData.append("images", img.file);
    });

    const res = await fetch("http://localhost:5000/api/posts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // ✅ REQUIRED
      },
      body: formData,
    });

    const data = await res.json();

    console.log("Saved:", data);

if (res.ok) {
  setShowSuccess(true);

  setTimeout(() => {
    navigate("/home");
  }, 1200);
} else {
      console.error("Error:", data);
    }

  } catch (err) {
    console.error("Upload failed:", err);
  }
};
  const handleReset = () => {
    setContent("");
    setTags([]);
    setTagInput("");
    setImages([]);
    setErrors({});
    setSubmitted(false);
  };


  return (
    <Layout searchPlaceholder="Search communities...">
      <div style={{ padding: "28px 32px", fontFamily: "'DM Sans', sans-serif", maxWidth: 720 }}>
        {/* Page header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 800, color: "#1e293b" }}>Create Post</h1>
          <p style={{ margin: 0, fontSize: 13, color: "#94a3b8" }}>Share something with the SRM Connect community</p>
        </div>

        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8ecf0", overflow: "visible" }}>
          {/* Author row */}
          <div style={{ padding: "18px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#0ea5b0", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
              {currentUser?.name?.[0]}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>{currentUser?.name}</div>
              <div style={{ fontSize: 12, color: "#94a3b8" }}>Posting to • SRM Connect Community</div>
            </div>
          </div>

          {/* ── Content field ── */}
          <div style={{ padding: "18px 20px", borderBottom: "1px solid #f1f5f9" }}>
            <textarea
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (e.target.value.trim().length >= 10) setErrors((er) => ({ ...er, content: undefined }));
              }}
              placeholder={`What's on your mind, ${currentUser?.name}? Share updates, questions, or resources…`}
              rows={5}
              style={{
                width: "100%", resize: "none", border: "none", outline: "none",
                fontSize: 14, color: "#1e293b", lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif",
                background: "transparent", boxSizing: "border-box",
              }}
            />
            {/* char count */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
              {errors.content ? (
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#dc2626", fontSize: 12, fontWeight: 500 }}>
                  <AlertCircle size={13} /> {errors.content}
                </div>
              ) : <span />}
              <span style={{ fontSize: 11, color: content.length > 450 ? "#f59e0b" : "#cbd5e1" }}>
                {content.length}/500
              </span>
            </div>
          </div>

          {/* ── Image previews ── */}
          {images.length > 0 && (
            <div style={{ padding: "14px 20px", borderBottom: "1px solid #f1f5f9" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 10 }}>
                {images.map((img, idx) => (
                  <div key={idx} style={{ position: "relative", borderRadius: 8, overflow: "hidden", aspectRatio: "1", background: "#f1f5f9" }}>
                    <img src={img.preview} alt={img.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <button
                      onClick={() => removeImage(idx)}
                      style={{ position: "absolute", top: 5, right: 5, width: 22, height: 22, borderRadius: "50%", background: "rgba(0,0,0,0.6)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}
                    >
                      <X size={11} />
                    </button>
                  </div>
                ))}
                {images.length < 4 && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    style={{ borderRadius: 8, border: "2px dashed #e2e8f0", background: "#f8fafc", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, color: "#94a3b8", fontSize: 11, aspectRatio: "1" }}
                  >
                    <Plus size={18} /> Add more
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ── Tags field ── */}
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9", position: "relative" }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 8 }}>
              Tags <span style={{ color: "#94a3b8", fontWeight: 400 }}>(up to 5)</span>
            </label>

            {/* Tags input box */}
            <div
              style={{
                display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center",
                border: `1.5px solid ${errors.tags ? "#fca5a5" : dropdownOpen ? "#0ea5b0" : "#e2e8f0"}`,
                borderRadius: 10, padding: "8px 12px", background: "#f8fafc", cursor: "text",
                minHeight: 42,
              }}
              onClick={() => { setDropdownOpen(true); }}
            >
              {tags.map((tag) => (
                <span key={tag} style={{ display: "flex", alignItems: "center", gap: 5, background: "#e0f7f8", color: "#0ea5b0", borderRadius: 20, padding: "3px 10px", fontSize: 12, fontWeight: 600 }}>
                  #{tag}
                  <X size={11} style={{ cursor: "pointer" }} onClick={(e) => { e.stopPropagation(); removeTag(tag); }} />
                </span>
              ))}
              {tags.length < 5 && (
                <input
                  value={tagInput}
                  onChange={(e) => { setTagInput(e.target.value); setDropdownOpen(true); }}
                  onKeyDown={handleTagKeyDown}
                  onFocus={() => setDropdownOpen(true)}
                  onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
                  placeholder={tags.length === 0 ? "Type a tag or pick from list…" : ""}
                  style={{ border: "none", outline: "none", background: "transparent", fontSize: 13, color: "#1e293b", fontFamily: "'DM Sans', sans-serif", flex: 1, minWidth: 120 }}
                />
              )}
              <ChevronDown size={15} color="#94a3b8" style={{ marginLeft: "auto", flexShrink: 0, transform: dropdownOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }} />
            </div>

            {/* Dropdown */}
            {dropdownOpen && filteredSuggestions.length > 0 && (
              <div style={{
                position: "absolute", top: "calc(100% - 8px)", left: 20, right: 20, zIndex: 50,
                background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10,
                boxShadow: "0 8px 24px rgba(0,0,0,0.10)", maxHeight: 200, overflowY: "auto",
              }}>
                {filteredSuggestions.map((tag) => (
                  <div
                    key={tag}
                    onMouseDown={() => addTag(tag)}
                    style={{ padding: "10px 16px", fontSize: 13, color: "#1e293b", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#f0fdfe"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    <span style={{ fontSize: 11, color: "#0ea5b0", fontWeight: 700 }}>#</span> {tag}
                  </div>
                ))}
              </div>
            )}

            {errors.tags && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#dc2626", fontSize: 12, fontWeight: 500, marginTop: 6 }}>
                <AlertCircle size={13} /> {errors.tags}
              </div>
            )}
            <p style={{ margin: "6px 0 0", fontSize: 11, color: "#94a3b8" }}>Press Enter or comma to add a custom tag</p>
          </div>

          {/* ── Bottom toolbar ── */}
          <div style={{ padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <input
                type="file"
                accept="image/*"
                multiple
                ref={fileInputRef}
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={images.length >= 4}
                style={{
                  display: "flex", alignItems: "center", gap: 7, padding: "8px 14px",
                  border: "1px solid #e2e8f0", borderRadius: 8, background: "#f8fafc",
                  color: images.length >= 4 ? "#cbd5e1" : "#64748b",
                  fontSize: 12, fontWeight: 600, cursor: images.length >= 4 ? "not-allowed" : "pointer",
                }}
              >
                <Image size={14} /> Photo {images.length > 0 && `(${images.length}/4)`}
              </button>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={handleReset}
                style={{ padding: "9px 20px", border: "1px solid #e2e8f0", borderRadius: 8, background: "#fff", fontSize: 13, fontWeight: 600, color: "#64748b", cursor: "pointer" }}
              >
                Discard
              </button>
              <button
                onClick={handleSubmit}
                style={{ padding: "9px 24px", border: "none", borderRadius: 8, background: "#0ea5b0", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: "0 2px 8px rgba(14,165,176,0.3)" }}
              >
                Post
              </button>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div style={{ marginTop: 16, background: "#f0fdfe", border: "1px solid #b2eff3", borderRadius: 10, padding: "12px 16px", fontSize: 12, color: "#0e7490", lineHeight: 1.6 }}>
          💡 <strong>Tips:</strong> Add relevant tags so your post reaches the right people. You can upload up to 4 images per post.
        </div>
      </div>
    
      {showSuccess && (
  <div className="hp-modal-overlay">
    <div className="hp-modal" style={{ textAlign: "center" }}>
      <h3>✅ Post Published</h3>
      <p>Your post is now live!</p>
    </div>
  </div>
)}
    </Layout>
  );
}
