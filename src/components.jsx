import { useState } from 'react'
import { Link } from 'react-router-dom'
import { priceLabel } from './data'
import { availabilityFor } from './store'

export function Header({ settings }) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  return (
    <header className="header">
      <div className="wrap nav">
        <Link className="brand" to="/" onClick={close}>{settings.businessName}</Link>
        <button
          className="menu-btn"
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >{open ? '×' : '☰'}</button>
        <nav className={`nav-links ${open ? 'open' : ''}`} aria-label="Main navigation">
          <Link to="/" onClick={close}>Home</Link>
          <Link to="/halls" onClick={close}>Halls</Link>
          <Link to="/packages" onClick={close}>Packages</Link>
          <Link to="/services" onClick={close}>Services</Link>
          <Link to="/gallery" onClick={close}>Gallery</Link>
          <Link to="/about" onClick={close}>About</Link>
          <Link to="/faqs" onClick={close}>FAQs</Link>
          <Link to="/contact" onClick={close}>Contact</Link>
        </nav>
        <Link className="btn nav-cta" to="/enquiry" onClick={close}>Check Availability</Link>
      </div>
    </header>
  )
}

export function Footer({ settings }) {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="wrap footer-grid">
        <div><h3>{settings.businessName}</h3><p>{settings.tagline}</p><p>{settings.description}</p></div>
        <div><h3>Explore</h3><p>
          <Link to="/">Home</Link><br /><Link to="/halls">Halls</Link><br /><Link to="/packages">Packages</Link><br />
          <Link to="/gallery">Gallery</Link><br /><Link to="/faqs">FAQs</Link><br /><Link to="/privacy">Privacy Policy</Link><br /><Link to="/terms">Terms</Link>
        </p></div>
        <div><h3>Visit</h3><p>{settings.address}<br />{settings.openingHours}<br />
          <a href={`tel:${settings.phone.replace(/\s/g, '')}`}>{settings.phone}</a><br />
          <a href={`mailto:${settings.email}`}>{settings.email}</a><br />
          <a href={settings.mapUrl} target="_blank" rel="noreferrer">Get Directions</a></p></div>
      </div>
      <div className="wrap"><p>© {year} {settings.businessName} — demo website. All details are demo only.</p></div>
    </footer>
  )
}

export function PageHero({ image, eyebrow, title, text }) {
  return (
    <section className="page-hero">
      <img src={image} alt={title} />
      <div className="page-hero-text">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
        {text && <p>{text}</p>}
      </div>
    </section>
  )
}

export function Hero({ settings, title, subtitle }) {
  return (
    <section className="hero">
      <div className="hero-img"><img src={settings.heroImage} alt="Celebration hall" /></div>
      <div>
        <p className="eyebrow">Welcome to {settings.businessName}</p>
        <h1>{title || settings.tagline}</h1>
        {subtitle && <p className="lead">{subtitle}</p>}
        <p><Link className="btn" to="/enquiry">Check Availability</Link> <Link className="btn btn-dark" to="/halls">Explore Our Halls</Link></p>
        <p><strong>{settings.openingHours}</strong></p>
        <div className="demo">Demo site: all business details, halls and packages are demo content, easy to replace with the real venue's details.</div>
      </div>
    </section>
  )
}

export function HallCard({ hall }) {
  return (
    <article className="card">
      <Link to={`/halls/${hall.slug}`}><div className="card-img"><img loading="lazy" src={hall.image} alt={hall.name} /></div></Link>
      <div className="card-body">
        <div className="row"><h3><Link to={`/halls/${hall.slug}`}>{hall.name}</Link></h3><span className="price">{priceLabel(hall)}</span></div>
        <p>{hall.shortDescription}</p>
        <p><span className="tag">{hall.category}</span><span className="tag">{hall.hallType}</span>{hall.isFeatured && <span className="badge">Featured</span>}</p>
        <p><Link to={`/halls/${hall.slug}`}>View hall →</Link></p>
      </div>
    </article>
  )
}

export function AvailabilityChecker({ state, halls }) {
  const [hallId, setHallId] = useState('')
  const [date, setDate] = useState('')
  const [result, setResult] = useState(null)
  function check(e) {
    e.preventDefault()
    if (!hallId || !date) { setResult({ kind: 'error', text: 'Please choose a hall and a date.' }); return }
    const status = availabilityFor(state, Number(hallId), date)
    if (status === 'available') setResult({ kind: 'ok', text: `Good news — this hall is recorded as available on ${date} (demo record). Please still send an enquiry to confirm.` })
    else if (status === 'booked') setResult({ kind: 'error', text: `This hall is recorded as booked on ${date}. Please try another hall or date.` })
    else setResult({ kind: 'warn', text: `Availability for this hall on ${date} is not configured yet. Please send an enquiry and the venue will confirm.` })
  }
  return (
    <form className="checker" onSubmit={check}>
      <h3>Check Availability</h3>
      <p>An enquiry is not a confirmed booking. A date with no record is reported as not configured, never as available.</p>
      <label>Hall<select value={hallId} onChange={(e) => setHallId(e.target.value)}><option value="">Choose a hall</option>{halls.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}</select></label>
      <label>Date<input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label>
      <button className="btn" type="submit">Check</button>
      {result && <p className={result.kind}>{result.text}</p>}
    </form>
  )
}
