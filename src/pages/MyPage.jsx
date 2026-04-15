import { useState } from "react";

const MyPage = () => {
  const [activeTab, setActiveTab] = useState("Semester 6");

  const attendanceData = [
    { subject: "Computer Networks", percent: 90, attended: 18, total: 20 },
    { subject: "Machine Learning", percent: 95, attended: 19, total: 20 },
    { subject: "Cyber Security", percent: 80, attended: 16, total: 20 },
  ];

  const results = {
    "Semester 6": [
      { code: "CS1001", name: "Artificial Intelligence", grade: "A+", score: "94/100" },
      { code: "CS1002", name: "Distributed Operating Systems", grade: "A", score: "88/100" },
      { code: "MA2003", name: "Numerical Methods", grade: "O", score: "97/100" },
      { code: "CS1004", name: "Mobile App Development", grade: "A+", score: "92/100" },
    ],
    "Semester 5": [
      { code: "CS901", name: "Data Structures", grade: "O", score: "98/100" },
      { code: "CS902", name: "Computer Architecture", grade: "A+", score: "95/100" },
    ],
  };

  const schedule = [
    { time: "08:30 AM", title: "Machine Learning Laboratory", detail: "Lab Block 3, Room 402 • Prof. Sarah Jenkins" },
    { time: "11:15 AM", title: "Software Engineering", detail: "10th Block, Hall B • Dr. Robert Chen" },
    { time: "01:30 PM", title: "Lunch Break", detail: "Central Cafeteria" },
    { time: "02:30 PM", title: "Human Computer Interaction", detail: "Tech Tower, Room 101 • Prof. Alan Turing" },
  ];

  const planner = [
    { type: "URGENT ASSIGNMENT", label: "Due Tomorrow", color: "#e53e3e", title: "Neural Networks Project", detail: "Implementation of CNN for image recognition..." },
    { type: "UPCOMING EXAM", label: "Oct 28", color: "#d97706", title: "Mid-Term: Cyber Security", detail: "Modules 1-4. Focus on encryption protocols..." },
    { type: "THESIS SUBMISSION", label: "Nov 12", color: "#3b82f6", title: "Draft Chapter 3 Review", detail: "Meeting with supervisor Dr. Lee at 4 PM." },
  ];

  const circleColor = (pct) => pct >= 90 ? "#3b82f6" : pct >= 80 ? "#f59e0b" : "#ef4444";

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "#1a202c", minHeight: "100vh", backgroundColor: "#f7f8fc" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Profile Card */}
      <div style={{ background: "#fff", borderRadius: 16, padding: "24px 28px", marginBottom: 24, display: "flex", alignItems: "center", gap: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <div style={{ position: "relative" }}>
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Elena" alt="avatar" style={{ width: 80, height: 80, borderRadius: "50%", border: "3px solid #e8f0ff", background: "#e8f0ff" }} />
          <span style={{ position: "absolute", bottom: 0, right: 0, width: 20, height: 20, background: "#3b82f6", borderRadius: "50%", border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          </span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Elena Rodriguez</h2>
            <span style={{ background: "#eff6ff", color: "#3b82f6", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20 }}>CS GRADUATE '24</span>
          </div>
          <p style={{ margin: "0 0 10px", fontSize: 13, color: "#64748b", maxWidth: 420, lineHeight: 1.5 }}>
            Specializing in Human-Computer Interaction and Distributed Systems. Dean's List Honor Roll student for three consecutive semesters. Active member of SRM Coding Club.
          </p>
          <div style={{ display: "flex", gap: 24 }}>
            <div><span style={{ fontSize: 20, fontWeight: 700, color: "#1a202c" }}>3.92</span><br /><span style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5 }}>Current CGPA</span></div>
            <div><span style={{ fontSize: 20, fontWeight: 700, color: "#1a202c" }}>94%</span><br /><span style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5 }}>Total Attendance</span></div>
          </div>
        </div>
        <button style={{ background: "#3b82f6", color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px", fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          Edit Profile
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
        {/* Attendance */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Attendance</h3>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
          </div>
          {attendanceData.map((item) => (
            <div key={item.subject} style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18 }}>
              <svg width="52" height="52" viewBox="0 0 52 52">
                <circle cx="26" cy="26" r="22" fill="none" stroke="#f1f5f9" strokeWidth="5" />
                <circle cx="26" cy="26" r="22" fill="none" stroke={circleColor(item.percent)} strokeWidth="5"
                  strokeDasharray={`${(item.percent / 100) * 138} 138`} strokeLinecap="round" transform="rotate(-90 26 26)" />
                <text x="26" y="31" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1a202c">{item.percent}%</text>
              </svg>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{item.subject}</div>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>{item.attended}/{item.total} Lectures</div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Results */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Recent Results</h3>
            <div style={{ display: "flex", gap: 6 }}>
              {["Semester 6", "Semester 5"].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} style={{ border: "none", borderRadius: 8, padding: "5px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", background: activeTab === tab ? "#3b82f6" : "#f1f5f9", color: activeTab === tab ? "#fff" : "#64748b" }}>{tab}</button>
              ))}
            </div>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                {["Course Code", "Course Name", "Grade", "Score"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "6px 8px", color: "#94a3b8", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results[activeTab].map(row => (
                <tr key={row.code} style={{ borderBottom: "1px solid #f8fafc" }}>
                  <td style={{ padding: "10px 8px", color: "#64748b", fontWeight: 500 }}>{row.code}</td>
                  <td style={{ padding: "10px 8px", fontWeight: 500 }}>{row.name}</td>
                  <td style={{ padding: "10px 8px" }}>
                    <span style={{ background: row.grade === "O" ? "#fef3c7" : "#eff6ff", color: row.grade === "O" ? "#d97706" : "#3b82f6", fontWeight: 700, padding: "2px 8px", borderRadius: 6, fontSize: 12 }}>{row.grade}</span>
                  </td>
                  <td style={{ padding: "10px 8px", fontWeight: 600, color: "#1a202c" }}>{row.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Today's Schedule */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, display: "inline" }}>Today's Schedule </h3>
              <span style={{ fontSize: 12, color: "#94a3b8", marginLeft: 6 }}>Oct 24, Mon</span>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </div>
          <div style={{ position: "relative", paddingLeft: 16 }}>
            <div style={{ position: "absolute", left: 16, top: 8, bottom: 8, width: 2, background: "#f1f5f9", borderRadius: 2 }} />
            {schedule.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 16, marginBottom: 20, position: "relative" }}>
                <div style={{ position: "absolute", left: -20, top: 4, width: 8, height: 8, background: "#3b82f6", borderRadius: "50%", border: "2px solid #fff", boxShadow: "0 0 0 2px #dbeafe" }} />
                <div style={{ width: 60, flexShrink: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#3b82f6" }}>{item.time.split(" ")[0]}</div>
                  <div style={{ fontSize: 10, color: "#94a3b8" }}>{item.time.split(" ")[1]}</div>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{item.title}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8" }}>{item.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Academic Planner */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700 }}>Academic Planner</h3>
          {planner.map((item, i) => (
            <div key={i} style={{ borderLeft: `3px solid ${item.color}`, background: item.color + "10", borderRadius: "0 10px 10px 0", padding: "12px 14px", marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: item.color, textTransform: "uppercase", letterSpacing: 0.5 }}>{item.type}</span>
                <span style={{ fontSize: 11, color: "#94a3b8" }}>{item.label}</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{item.title}</div>
              <div style={{ fontSize: 11, color: "#64748b" }}>{item.detail}</div>
            </div>
          ))}
          <button style={{ width: "100%", background: "#f8fafc", border: "1.5px dashed #e2e8f0", borderRadius: 10, padding: "10px", color: "#94a3b8", fontSize: 13, fontWeight: 600, cursor: "pointer", marginTop: 4 }}>+ Add Task</button>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
