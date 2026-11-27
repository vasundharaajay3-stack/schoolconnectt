import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import api from "../api.js";

export default function Dashboard({ role }) {
  const nav = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const logout = () => { sessionStorage.clear(); nav("/login"); };

  useEffect(() => {
    api.get(role === "student" ? "/api/student/attendance" : "/api/summary")
      .then((r) => setData(r.data))
      .catch((x) => {
        if (x.response?.status === 401) return logout();
        setErr(x.response?.data?.error || "Could not load information from the server.");
      });
  }, []);

  return (
    <section className="sec page dash">
      <div className="dash-head">
        <div><h1>Welcome, {user.name}</h1><p className="lead">{role[0].toUpperCase() + role.slice(1)} Dashboard</p></div>
        <button className="btn outline" onClick={logout}><LogOut size={18} /> Logout</button>
      </div>
      {err && <div className="error">{err}</div>}

      {role === "student" && (<>
        <div className="grid">
          <div className="card c0"><h3>Admission No.</h3><p className="big">{user.id}</p></div>
          <div className="card c1"><h3>Class</h3><p className="big">{user.class_number}</p></div>
          <div className="card c2"><h3>Section</h3><p className="big">{user.section}</p></div>
          <div className="card c3"><h3>Attendance</h3><p className="big">{data?.percentage != null ? `${data.percentage}%` : "—"}</p></div>
        </div>
        <h2>Attendance History</h2>
        {data && data.records.length === 0 && <p className="card">No attendance records are available yet.</p>}
        {data && data.records.length > 0 && (
          <div className="table-wrap"><table><thead><tr><th>Date</th><th>Status</th></tr></thead><tbody>
            {data.records.map((r) => <tr key={r.date}><td>{r.date}</td><td className={r.status === "Present" ? "ok" : "bad"}>{r.status}</td></tr>)}
          </tbody></table></div>)}
      </>)}

      {role !== "student" && (<>
        <div className="grid">
          <div className="card c0"><h3>Name</h3><p className="big">{user.name}</p></div>
          <div className="card c1"><h3>Username</h3><p className="big">{user.username}</p></div>
          <div className="card c2"><h3>Total Students</h3><p className="big">{data?.students ?? "—"}</p></div>
          <div className="card c3"><h3>Total Teachers</h3><p className="big">{data?.teachers ?? "—"}</p></div>
        </div>
        <h2>Students by Class</h2>
        {data && data.by_class.length === 0 && <p className="card">No student records in the database yet.</p>}
        {data && data.by_class.length > 0 && (
          <div className="table-wrap"><table><thead><tr><th>Class</th><th>Students</th></tr></thead><tbody>
            {data.by_class.map((c) => <tr key={c.class_number}><td>{c.class_number}</td><td>{c.n}</td></tr>)}
          </tbody></table></div>)}
        <p className="lead">Editing records and marking attendance are not built yet. This dashboard shows read-only information.</p>
      </>)}
    </section>
  );
}
