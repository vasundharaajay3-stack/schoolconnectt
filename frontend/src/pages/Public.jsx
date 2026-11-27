import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, BookOpen, Library, Droplets, Trees, Puzzle, Monitor, Megaphone, CalendarDays } from "lucide-react";

const SLIDES = [
  { t: "Every Child Deserves a Bright Future.", c: "linear-gradient(135deg,#6d4fc2,#4a90e2)", e: "🌟" },
  { t: "Learning Today, Leading Tomorrow.", c: "linear-gradient(135deg,#4a90e2,#38b6a6)", e: "📚" },
  { t: "Together We Learn, Together We Grow.", c: "linear-gradient(135deg,#f2a900,#ef7b6c)", e: "🌱" },
  { t: "Building Knowledge, Creating Opportunities.", c: "linear-gradient(135deg,#8e5fd0,#ef7b6c)", e: "🎒" },
];

// Set confirmed:true ONLY after the school confirms a facility. No transportation by design.
const FACILITIES = [
  { n: "Classrooms", i: BookOpen, d: "Classes for 1st to 7th Standard.", confirmed: false },
  { n: "Library", i: Library, d: "Books and reading resources for students.", confirmed: false },
  { n: "Drinking Water", i: Droplets, d: "Safe drinking water for children.", confirmed: false },
  { n: "Playground", i: Trees, d: "Open space for play and sports.", confirmed: false },
  { n: "Learning Activities", i: Puzzle, d: "Activities that make learning fun.", confirmed: false },
  { n: "Digital Learning Resources", i: Monitor, d: "Digital education information through SchoolConnect.", confirmed: false },
];

// Placeholder entries: replace with real notices from the school.
const ANNOUNCEMENTS = [
  { d: "Date to be added", t: "Examination schedule", x: "Exam dates will be announced here by the school." },
  { d: "Date to be added", t: "Holiday notice", x: "Holiday announcements will appear here." },
  { d: "Date to be added", t: "General update", x: "Important school notices will be posted here." },
];
const EVENTS = [
  { d: "15 August", t: "Independence Day", x: "Flag hoisting and celebrations." },
  { d: "26 January", t: "Republic Day", x: "Celebrations with students and teachers." },
  { d: "Date to be added", t: "Annual Day", x: "Cultural programmes by students." },
  { d: "Date to be added", t: "Sports Activities", x: "Games and sports for all classes." },
];

function Slider() {
  const [i, setI] = useState(0);
  useEffect(() => { const id = setInterval(() => setI((x) => (x + 1) % SLIDES.length), 5000); return () => clearInterval(id); }, []);
  const s = SLIDES[i];
  return (
    <section className="hero" style={{ background: s.c }}>
      <div className="hero-emoji">{s.e}</div>
      <h1>{s.t}</h1>
      <Link to="/about" className="btn yellow">Explore Our School</Link>
      <div className="dots">{SLIDES.map((_, k) => <button key={k} aria-label={`Slide ${k + 1}`} className={k === i ? "on" : ""} onClick={() => setI(k)} />)}</div>
    </section>
  );
}

const FacilityCards = ({ limit }) => (
  <div className="grid">
    {FACILITIES.slice(0, limit).map(({ n, i: Icon, d, confirmed }, k) => (
      <div key={n} className={`card c${k % 4}`}><Icon size={34} /><h3>{n}</h3><p>{d}</p>
        {!confirmed && <span className="badge">Awaiting school confirmation</span>}</div>
    ))}
  </div>
);

const NewsCards = ({ items, Icon, cls }) => (
  <div className="grid">{items.map((a) => (
    <div key={a.t} className={`card ${cls}`}><Icon size={28} /><span className="date">{a.d}</span><h3>{a.t}</h3><p>{a.x}</p></div>
  ))}</div>
);

const ContactCards = () => (
  <div className="grid">
    <div className="card c0"><Phone size={34} /><h3>Phone</h3><p>6363965083</p></div>
    <div className="card c1"><Mail size={34} /><h3>Email</h3><p style={{ wordBreak: "break-all" }}>Ghpskoluru123@gmail.com</p></div>
    <div className="card c2"><MapPin size={34} /><h3>Location</h3><p>Koluru, Sagara Taluk, Shivamogga District, Karnataka.</p></div>
  </div>
);

export function Home() {
  return (<>
    <Slider />
    <section className="sec cream"><h2>Welcome to GHPS Koluru</h2>
      <p className="lead">GHPS Koluru is a government primary school in Koluru, Sagara Taluk, Shivamogga District. We provide primary education from 1st to 7th Standard.</p></section>
    <section className="sec"><h2>About Our School</h2>
      <p className="lead">We aim to give every child a caring place to learn, grow and discover their talents.</p>
      <Link to="/about" className="btn">Read more</Link></section>
    <section className="sec cream"><h2>Facilities</h2><FacilityCards limit={3} /><Link to="/facilities" className="btn">All facilities</Link></section>
    <section className="sec"><h2>Latest News</h2><NewsCards items={ANNOUNCEMENTS.slice(0, 2)} Icon={Megaphone} cls="c1" /><Link to="/news" className="btn">All news</Link></section>
    <section className="sec cream"><h2>Contact Us</h2><ContactCards /></section>
  </>);
}

export const About = () => (
  <section className="sec page">
    <h1>About GHPS Koluru</h1>
    <p className="lead">GHPS Koluru is a government primary school for 1st to 7th Standard in Koluru, Sagara Taluk, Shivamogga District, Karnataka.</p>
    <div className="grid">
      <div className="card c0"><h3>Our Vision</h3><p>Every child learns, grows and builds a bright future.</p></div>
      <div className="card c1"><h3>Our Mission</h3><p>Provide quality primary education in a safe and caring environment.</p></div>
      <div className="card c2"><h3>Why Education Matters</h3><p>Education opens doors to opportunity for children and their families.</p></div>
      <div className="card c3"><h3>Child Development</h3><p>We support each child's learning, confidence and good values.</p></div>
      <div className="card c0"><h3>Digital Learning</h3><p>SchoolConnect shows that government school students can benefit from modern technology.</p></div>
    </div>
  </section>
);

export const Facilities = () => (
  <section className="sec page"><h1>Our Facilities</h1>
    <p className="lead">Facilities marked "Awaiting school confirmation" will be shown as available once GHPS Koluru confirms them.</p>
    <FacilityCards /></section>
);

export const News = () => (
  <section className="sec page"><h1>News</h1>
    <h2>Announcements</h2><NewsCards items={ANNOUNCEMENTS} Icon={Megaphone} cls="c1" />
    <h2>Events</h2><NewsCards items={EVENTS} Icon={CalendarDays} cls="c2" /></section>
);

export const Contact = () => (
  <section className="sec page"><h1>Contact GHPS Koluru</h1><ContactCards /></section>
);
