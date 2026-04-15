import Layout from "./Layout";
import { Star, Calendar, BookOpen, BarChart2, Download } from "lucide-react";

const attendanceData = [
  { subject: "Database Management Systems", code: "18CS302J", conducted: 45, present: 42, pct: 93, status: "SAFE" },
  { subject: "Artificial Intelligence", code: "18CS304J", conducted: 40, present: 30, pct: 75, status: "WARNING" },
  { subject: "Cloud Computing", code: "18CS306J", conducted: 38, present: 34, pct: 89, status: "SAFE" },
  { subject: "Theory of Computation", code: "18CS301", conducted: 42, present: 39, pct: 92, status: "SAFE" },
];

const internalMarks = [
  { subject: "Database Management Systems", score: 18, max: 20 },
  { subject: "Artificial Intelligence", score: 42, max: 50 },
  { subject: "Cloud Computing", score: 25, max: 25 },
  { subject: "Theory of Computation", score: 23, max: 25 },
];

const semHistory = [
  { sem: 1, gpa: 8.92 },
  { sem: 2, gpa: 9.10 },
  { sem: 3, gpa: 9.45 },
  { sem: 4, gpa: 9.08 },
  { sem: 5, gpa: 9.31 },
];

const StatCard = ({ icon, label, value, sub, subColor }) => (
  <div style={{ background: "#fff", borderRadius: 12, padding: "18px 20px", border: "1px solid #e8ecf0", flex: 1 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
      <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>{label}</span>
      <span style={{ color: "#94a3b8" }}>{icon}</span>
    </div>
    <div style={{ fontSize: 28, fontWeight: 800, color: "#1e293b", lineHeight: 1 }}>{value}</div>
    {sub && <div style={{ fontSize: 11, color: subColor || "#94a3b8", marginTop: 6 }}>{sub}</div>}
  </div>
);

export default function MyDetailsPage() {
  return (
    <Layout searchPlaceholder="Search records...">
      <div style={{ padding: 28, fontFamily: "'DM Sans', sans-serif", maxWidth: 1100 }}>
        <h1 style={{ margin: "0 0 24px", fontSize: 20, fontWeight: 700, color: "#1e293b" }}>My Details</h1>

        {/* Stat cards */}
        <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
          <StatCard icon={<Star size={16} />} label="CUMULATIVE GPA" value="9.24" sub="↑ +0.12 from last semester" subColor="#22c55e" />
          <div style={{ background: "#fff", borderRadius: 12, padding: "18px 20px", border: "1px solid #e8ecf0", flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>TOTAL ATTENDANCE</span>
              <Calendar size={16} color="#94a3b8" />
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <span style={{ fontSize: 28, fontWeight: 800, color: "#1e293b" }}>88%</span>
              <span style={{ fontSize: 12, color: "#94a3b8" }}>/ 100%</span>
            </div>
            <div style={{ marginTop: 10, height: 6, background: "#e2e8f0", borderRadius: 4 }}>
              <div style={{ width: "88%", height: "100%", background: "#0ea5b0", borderRadius: 4 }} />
            </div>
          </div>
          <StatCard icon={<BookOpen size={16} />} label="CREDITS EARNED" value="124" sub="Out of 160 required" />
          <StatCard icon={<BarChart2 size={16} />} label="BATCH RANK" value="#12" sub="Top 5% of Department" subColor="#f59e0b" />
        </div>

        {/* Main grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 20 }}>
          {/* Attendance Records */}
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e8ecf0", overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#1e293b" }}>Attendance Records</h2>
                <p style={{ margin: "3px 0 0", fontSize: 12, color: "#94a3b8" }}>Current Semester: VI</p>
              </div>
              <button style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#0ea5b0", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                <Download size={13} /> Download PDF
              </button>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {["SUBJECT", "HOURS CONDUCTED", "HOURS PRESENT", "PERCENTAGE", "STATUS"].map((h) => (
                    <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 10, fontWeight: 600, color: "#94a3b8", letterSpacing: 0.5, whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {attendanceData.map((row) => (
                  <tr key={row.code} style={{ borderTop: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>{row.subject}</div>
                      <div style={{ fontSize: 11, color: "#94a3b8" }}>{row.code}</div>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#475569" }}>{row.conducted}</td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#475569" }}>{row.present}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ height: 6, width: 80, background: "#e2e8f0", borderRadius: 4, flexShrink: 0 }}>
                          <div style={{ height: "100%", width: `${row.pct}%`, background: row.status === "WARNING" ? "#f59e0b" : "#22c55e", borderRadius: 4 }} />
                        </div>
                        <span style={{ fontSize: 12, color: "#475569", fontWeight: 600 }}>{row.pct}%</span>
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 12,
                        background: row.status === "SAFE" ? "#dcfce7" : "#fef9c3",
                        color: row.status === "SAFE" ? "#16a34a" : "#92400e",
                      }}>{row.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Internal Marks */}
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e8ecf0", padding: 20 }}>
            <h2 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: "#1e293b" }}>Internal Marks</h2>
            {internalMarks.map(({ subject, score, max }) => (
              <div key={subject} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: "#475569", fontWeight: 500 }}>{subject}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#1e293b" }}>{score}/{max}</span>
                </div>
                <div style={{ height: 7, background: "#e2e8f0", borderRadius: 4 }}>
                  <div style={{ height: "100%", width: `${(score / max) * 100}%`, background: "#0ea5b0", borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Semester History */}
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e8ecf0", padding: "20px 24px", marginTop: 20 }}>
          <h2 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: "#1e293b" }}>Semester History</h2>
          <div style={{ display: "flex", gap: 16 }}>
            {semHistory.map(({ sem, gpa }) => (
              <div key={sem} style={{ flex: 1, background: "#f8fafc", borderRadius: 10, padding: "14px 16px", border: "1px solid #e8ecf0" }}>
                <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600, letterSpacing: 0.5, marginBottom: 8 }}>SEMESTER {sem}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                  <span style={{ fontSize: 22, fontWeight: 800, color: "#1e293b" }}>{gpa.toFixed(2)}</span>
                  <span style={{ fontSize: 10, color: "#94a3b8" }}>GPA</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
