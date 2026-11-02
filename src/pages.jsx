import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Hero, HallCard, AvailabilityChecker } from './components'
import { priceLabel, ENQUIRY_STATUSES } from './data'
import { nextReference, update } from './store'

export function Home({ state }) {
  const halls = state.halls.filter((h) => h.isPublished)
  const featured = halls.filter((h) => h.isFeatured)
  const pkgs = state.packages.filter((p) => p.isPublished && p.isFeatured)
  return (
    <div>
      <Hero settings={state.settings} subtitle="From intimate family functions to grand wedding celebrations, find a space that fits your occasion." />
      <h2>Featured Halls</h2>
      <div className="grid">{featured.map((h) => <HallCard key={h.id} hall={h} />)}</div>
      <p><Link className="btn" to="/halls">Explore All Halls</Link></p>
      <h2>Popular Packages</h2>
      <div className="grid">{pkgs.map((p) => (
        <article className="card" key={p.id}><div className="card-img"><img loading="lazy" src={p.image} alt={p.name} /></div>
          <div className="card-body"><div className="row"><h3>{p.name}</h3><span className="price">{priceLabel(p)}</span></div><p>{p.description}</p></div></article>
      ))}</div>
      <div className="grid2" style={{ marginTop: 32 }}>
        <AvailabilityChecker state={state} halls={halls} />
        <div className="card card-body"><h3>Visit Us</h3><p>{state.settings.address}<br />{state.settings.openingHours}<br />{state.settings.visitingHours}<br />
          Phone: <a href={`tel:${state.settings.phone.replace(/\s/g, '')}`}>{state.settings.phone}</a><br />
          Email: <a href={`mailto:${state.settings.email}`}>{state.settings.email}</a><br />
          <a href={state.settings.mapUrl} target="_blank" rel="noreferrer">Get Directions →</a></p></div>
      </div>
      <h2 style={{ marginTop: 32 }}>Gallery Preview</h2>
      <div className="gal">{state.gallery.slice(0, 4).map((g) => <Link key={g.id} to="/gallery"><img loading="lazy" src={g.image} alt={g.title} /></Link>)}</div>
      <div className="cta"><h2>Your Celebration Starts Here</h2><p>Explore the halls, check a date, and send an enquiry — it takes a few minutes, and it is never a confirmed booking until the venue confirms.</p><p><Link className="btn" to="/enquiry">Send an Enquiry</Link></p></div>
    </div>
  )
}

export function HallsPage({ state }) {
  const [type, setType] = useState('All')
  const [event, setEvent] = useState('All')
  const [sort, setSort] = useState('featured')
  const halls = useMemo(() => {
    let list = state.halls.filter((h) => h.isPublished)
    if (type !== 'All') list = list.filter((h) => h.hallType === type || h.category === type)
    if (event !== 'All') list = list.filter((h) => h.eventTypes.includes(event))
    if (sort === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name))
    else list = [...list].sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured))
    return list
  }, [state.halls, type, event, sort])
  const events = [...new Set(state.halls.flatMap((h) => h.eventTypes))]
  return (
    <div>
      <h2>Our Halls & Spaces</h2><p className="lead">Filter by hall type or event. Prices shown as “Enquire for Pricing” mean the venue quotes for your date and guest count.</p>
      <div className="chips">
        <label>Type <select value={type} onChange={(e) => setType(e.target.value)}><option>All</option><option>Indoor</option><option>Outdoor</option><option>Ballroom</option><option>Banquet Hall</option><option>Garden</option><option>Event Space</option></select></label>
        <label>Event <select value={event} onChange={(e) => setEvent(e.target.value)}><option>All</option>{events.map((e) => <option key={e}>{e}</option>)}</select></label>
        <label>Sort <select value={sort} onChange={(e) => setSort(e.target.value)}><option value="featured">Featured first</option><option value="name">Name A–Z</option></select></label>
      </div>
      {halls.length ? <div className="grid">{halls.map((h) => <HallCard key={h.id} hall={h} />)}</div> : <p>No halls match those filters yet.</p>}
    </div>
  )
}

export function HallDetail({ state }) {
  const { slug } = useParams()
  const hall = state.halls.find((h) => h.slug === slug && h.isPublished)
  if (!hall) return <div><h2>Hall not found</h2><p><Link to="/halls">Back to halls</Link></p></div>
  return (
    <div>
      <h2>{hall.name}</h2><p><span className="tag">{hall.category}</span><span className="tag">{hall.hallType}</span><span className="price">{priceLabel(hall)}</span></p>
      <div className="card-img" style={{ height: 360 }}><img src={hall.image} alt={hall.name} /></div>
      <p style={{ marginTop: 16 }}>{hall.description}</p>
      <p><em>{hall.capacityNote}</em></p>
      <h3>Facilities</h3><p>{hall.facilities.join(' · ')}</p>
      <h3>Suitable for</h3><p>{hall.eventTypes.join(' · ')}</p>
      <div className="gal">{hall.gallery.map((g, i) => <img key={i} loading="lazy" src={g} alt={`${hall.name} photo ${i + 1}`} />)}</div>
      <p><Link className="btn" to={`/enquiry?hall=${hall.id}`}>Enquire for this Hall</Link> <Link className="btn btn-dark" to="/halls">Back to Halls</Link></p>
    </div>
  )
}

export function PackagesPage({ state }) {
  return (<div><h2>Packages</h2><p className="lead">Demo package outlines. Final inclusions and quotations are prepared by the management for your date, hall and guest count.</p>
    <div className="grid">{state.packages.filter((p) => p.isPublished).map((p) => (
      <article className="card" key={p.id}><div className="card-img"><img loading="lazy" src={p.image} alt={p.name} /></div><div className="card-body">
        <div className="row"><h3>{p.name}</h3><span className="price">{priceLabel(p)}</span></div><p>{p.description}</p>
        <h4>Inclusions</h4><ul>{p.inclusions.map((x, i) => <li key={i}>{x}</li>)}</ul>
        <h4>Optional add-ons</h4><p>{p.addons.join(', ')}</p><p><small>{p.terms}</small></p>
      </div></article>))}</div></div>)
}

export function ServicesPage({ state }) {
  return (<div><h2>Services</h2><p className="lead">Demo service listings — confirm menus, inclusions and availability when you enquire.</p>
    <div className="grid">{state.services.map((s) => (<article className="card card-body" key={s.id}><h3>{s.name}</h3><p><span className="tag">{s.category}</span><span className="tag">{s.provider}</span></p><p>{s.description}</p></article>))}</div></div>)
}

export function GalleryPage({ state }) {
  const [cat, setCat] = useState('All')
  const [open, setOpen] = useState(null)
  const items = cat === 'All' ? state.gallery : state.gallery.filter((g) => g.category === cat)
  return (<div><h2>Gallery</h2><div className="chips">{['All', 'Venue', 'Decor', 'Celebration'].map((c) => <button key={c} className={`chip ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>{c}</button>)}</div>
    <div className="gal">{items.map((g) => <img key={g.id} loading="lazy" src={g.image} alt={g.title} onClick={() => setOpen(g)} style={{ cursor: 'pointer' }} />)}</div>
    {open && <div className="lightbox open" onClick={() => setOpen(null)}><button aria-label="Close photo" onClick={() => setOpen(null)}>×</button><img src={open.image} alt={open.title} /></div>}
    <p>Tip: click a photo to view it larger. Click anywhere or press Esc in your browser to close — lightbox closes on backdrop click.</p></div>)
}

export function AboutPage({ state }) {
  return (<div><h2>A Place for Celebrations</h2><p className="lead">{state.settings.about}</p>
    <div className="blocks"><div className="block"><h3>Hospitality</h3><p>Warm, organised hosting for weddings and family occasions.</p></div>
    <div className="block"><h3>Care</h3><p>Thoughtful arrangements, from the stage to the dining layout.</p></div>
    <div className="block"><h3>Comfort & Consistency</h3><p>Spaces designed to bring people together, celebration after celebration.</p></div></div>
    <p style={{ marginTop: 24 }}><Link className="btn" to="/halls">Explore Our Halls</Link> <Link className="btn btn-dark" to="/enquiry">Send an Enquiry</Link></p></div>)
}

export function FaqsPage({ state }) {
  const [q, setQ] = useState('')
  const list = state.faqs.filter((f) => (f.question + f.answer).toLowerCase().includes(q.toLowerCase()))
  return (<div><h2>Frequently Asked Questions</h2><label>Search FAQs<input value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. booking, availability, catering" /></label>
    {list.map((f) => <details key={f.id} className="faq"><summary>{f.question}</summary><p>{f.answer}</p></details>)}
    {!list.length && <p>No FAQs match that search.</p>}</div>)
}

export function ContactPage({ state }) {
  const s = state.settings
  return (<div><h2>Contact & Visit</h2><p>{s.address}<br />{s.openingHours}<br />{s.visitingHours}<br />
    Phone: <a href={`tel:${s.phone.replace(/\s/g, '')}`}>{s.phone}</a> · WhatsApp: {s.whatsapp}<br />
    Email: <a href={`mailto:${s.email}`}>{s.email}</a><br /><a href={s.mapUrl} target="_blank" rel="noreferrer">Get Directions</a></p>
    <p><Link className="btn" to="/enquiry">Send an Enquiry</Link></p></div>)
}

export function EnquiryPage({ state, setState }) {
  const params = new URLSearchParams(window.location.hash.split('?')[1] || '')
  const [form, setForm] = useState({ name: '', email: '', phone: '', hallId: params.get('hall') || '', date: '', eventType: '', guests: '', message: '' })
  const [err, setErr] = useState(''); const [done, setDone] = useState(null)
  function submit(e) {
    e.preventDefault()
    if (!form.name.trim() || !form.message.trim()) { setErr('Please add your name and a message.'); return }
    if (!form.email.trim() && !form.phone.trim()) { setErr('Please add either an email or a phone number so the venue can reply.'); return }
    const { ref, seq } = nextReference(state)
    const enquiry = { id: Date.now(), ref, status: 'New', notes: '', followUp: '', createdAt: new Date().toISOString(), ...form, hallId: form.hallId ? Number(form.hallId) : null }
    setState(update(state, { enquiries: [enquiry, ...state.enquiries], enquirySeq: seq }))
    setErr(''); setDone(enquiry)
  }
  if (done) return (<div><h2>Enquiry received</h2><div className="ok"><p>Thank you, {done.name}. Your enquiry reference is <strong>{done.ref}</strong>.</p><p><strong>This is not a confirmed booking.</strong> The venue will confirm availability separately.</p></div><p><Link className="btn" to="/">Back Home</Link></p></div>)
  return (<div><h2>Enquiry & Site-Visit Request</h2><p className="lead">An enquiry is never a confirmed booking. You will receive a reference number, and the venue confirms separately.</p>
    <form className="form" onSubmit={submit}>
      <label>Name *<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
      <label>Email<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
      <label>Phone<input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
      <label>Hall<select value={form.hallId} onChange={(e) => setForm({ ...form, hallId: e.target.value })}><option value="">Any hall</option>{state.halls.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}</select></label>
      <label>Preferred date<input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></label>
      <label>Event type<input value={form.eventType} onChange={(e) => setForm({ ...form, eventType: e.target.value })} placeholder="Wedding, reception, engagement…" /></label>
      <label>Approx. guests<input type="number" min="0" value={form.guests} onChange={(e) => setForm({ ...form, guests: e.target.value })} /></label>
      <label>Message *<textarea rows="5" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></label>
      {err && <p className="error">{err}</p>}<button className="btn" type="submit">Submit Enquiry</button>
    </form>
    <div style={{ marginTop: 24 }}><AvailabilityChecker state={state} halls={state.halls.filter((h) => h.isPublished)} /></div>
    <p><small>Enquiry statuses in Admin: {ENQUIRY_STATUSES.join(', ')}.</small></p></div>)
}

export function PrivacyPage() {
  return (<div><h2>Privacy Policy</h2><p><em>Placeholder — please review and adapt before launch.</em></p><p>This demo website does not take payments or create customer accounts. Details shared in an enquiry are used only to respond to that enquiry. No analytics or tracking scripts are included in this code version.</p></div>)
}
export function TermsPage() {
  return (<div><h2>Terms</h2><p><em>Placeholder — please review and adapt before launch.</em></p><p>An enquiry is a request for information and availability, not a booking or a contract. Final hall, package, pricing and cancellation terms are those shared by the venue in its written quotation.</p></div>)
}
export function NotFound() {
  return (<div><h2>Page not found</h2><p>That page doesn't exist here.</p><p><Link className="btn" to="/">Back Home</Link></p></div>)
}
