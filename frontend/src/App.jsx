import { useState } from "react";
import { Routes, Route, NavLink, Link, Navigate, useLocation } from "react-router-dom";
import { Menu, X, GraduationCap } from "lucide-react";
import { Home, About, Facilities, News, Contact } from "./pages/Public.jsx";
import { LoginSelect, LoginForm } from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";

function Navbar() {
  const [open, setOpen] = useState(false);
  const links = [["/", "Home"], ["/about", "About"], ["/facilities", "Facilities"], ["/news", "News"], ["/contact", "Contact"]];
  return (
    <header className="nav">
      <div className="nav-inner">
        <Link to="/" className="brand"><GraduationCap size={30} /> SchoolConnect</Link>
        <button className="burger" aria-label="Menu" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
        <nav className={open ? "links open" : "links"} onClick={() => setOpen(false)}>
          {links.map(([to, t]) => <NavLink key={to} to={to} end={to === "/"}>{t}</NavLink>)}
          <NavLink to="/login" className="login-btn">Login</NavLink>
        </nav>
      </div>
    </header>
  );
}

function Protected({ role, children }) {
  const ok = sessionStorage.getItem("token") && sessionStorage.getItem("role") === role;
  return ok ? children : <Navigate to={`/${role}-login`} replace />;
}

export default function App() {
  const { pathname } = useLocation();
  return (
    <>
      <Navbar />
      <main key={pathname}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/news" element={<News />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<LoginSelect />} />
          {["student", "teacher", "admin"].map((r) => (
            <Route key={r} path={`/${r}-login`} element={<LoginForm role={r} />} />
          ))}
          {["student", "teacher", "admin"].map((r) => (
            <Route key={r} path={`/${r}-dashboard`} element={<Protected role={r}><Dashboard role={r} /></Protected>} />
          ))}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <footer className="footer">© GHPS Koluru · SchoolConnect · Koluru, Sagara Taluk, Shivamogga, Karnataka</footer>
    </>
  );
}
