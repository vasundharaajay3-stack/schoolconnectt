import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, Users, ShieldCheck } from "lucide-react";
import api from "../api.js";

const ROLES = {
  student: { label: "Student", icon: GraduationCap, idLabel: "Admission Number" },
  teacher: { label: "Teacher", icon: Users, idLabel: "Username" },
  admin: { label: "Admin", icon: ShieldCheck, idLabel: "Username" },
};

export const LoginSelect = () => (
  <section className="sec page"><h1>Login</h1><p className="lead">Choose how you want to log in.</p>
    <div className="grid">
      {Object.entries(ROLES).map(([r, { label, icon: Icon }], k) => (
        <Link key={r} to={`/${r}-login`} className={`card c${k} linkcard`}><Icon size={40} /><h3>{label} Login</h3></Link>
      ))}
    </div></section>
);

export function LoginForm({ role }) {
  const cfg = ROLES[role];
  const nav = useNavigate();
  const [f, setF] = useState({ username: "", password: "" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!f.username.trim() || !f.password) return setErr(`Please enter your ${cfg.idLabel.toLowerCase()} and password.`);
    setErr(""); setBusy(true);
    try {
      const { data } = await api.post(`/api/${role}/login`, { username: f.username.trim(), password: f.password });
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("role", data.role);
      sessionStorage.setItem("user", JSON.stringify(data.user));
      nav(`/${role}-dashboard`);
    } catch (x) {
      setErr(x.response?.data?.error || "Cannot reach the server. Please try again later.");
    } finally { setBusy(false); }
  }

  return (
    <section className="sec page"><form className="card form" onSubmit={submit} noValidate>
      <h1>{cfg.label} Login</h1>
      {err && <div className="error" role="alert">{err}</div>}
      <label>{cfg.idLabel}<input value={f.username} onChange={(e) => setF({ ...f, username: e.target.value })} autoComplete="username" /></label>
      <label>Password<input type="password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} autoComplete="current-password" /></label>
      <button className="btn" disabled={busy}>{busy ? "Logging in…" : "Login"}</button>
      <Link to="/login">← Other login options</Link>
    </form></section>
  );
}
