import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Hero, HallCard, AvailabilityChecker, PageHero } from './components'
import { priceLabel, ENQUIRY_STATUSES, PHOTOS } from './data'
import { nextReference, update } from './store'

export function Home({ state }) {
  const halls = state.halls.filter((h) => h.isPublished)
  const featured = halls.filter((h) => h.isFeatured)
  const pkgs = state.packages.filter((p) => p.isPublished && p.isFeatured)
  return (
    <div>
      <Hero settings={state.settings} subtitle="From intimate family functions to grand wedding celebrations, find a space that fits your occasion — beautifully, calmly, and without the rush." />
      <section className="section"><h2>Featured Halls</h2><p className="lead">Elegant rooms, open-air gardens, and spaces that photograph beautifully — chosen to make your celebration feel effortless.</p>
      <div className="grid">{featured.map((h) => <HallCard key={h.id} hall={h} />)}</div>
      <p style={{ marginTop: 28 }}><Link className="btn" to="/halls">Explore All Halls</Link></p></section>
      <section className="section"><h2>Popular Packages</h2><p className="lead">Thoughtful starting points for weddings, receptions, and engagements — tailored to your date, hall, and guest list.</p>
      <div className="grid">{pkgs.map((p) => (
        <article className="card" key={p.id}><div className="card-img"><img loading="lazy" src={p.image} alt={p.name} /></div>
          <div className="card-body"><div className="row"><h3>{p.name}</h3><span className="price">{priceLabel(p)}</span></div><p>{p.description}</p></div></article>
      ))}</div></section>
      <section className="section"><div className="grid2">
        <AvailabilityChecker state={state} halls={halls} />
        <div className="card card-body"><h3>Visit Us</h3><p>{state.settings.address}<br />{state.settings.openingHours}<br />{state.settings.visitingHours}<br />
          Phone: <a href={`tel:${state.settings.phone.replace(/\s/g, '')}`}>{state.settings.phone}</a><br />
          Email: <a href={`mailto:${state.settings.email}`}>{state.settings.email}</a><br />
          <a href={state.settings.mapUrl} target="_blank" rel="noreferrer">Get Directions →</a></p></div>
      </div></section>
      <section className="section"><h2>Gallery Preview</h2><p className="lead">A glimpse of the rooms, the decor, and the evenings they hold.</p>
      <div className="gal">{state.gallery.slice(0, 4).map((g) => <Link key={g.id} to="/gallery"><img loading="lazy" src={g.image} alt={g.title} /></Link>)}</div></section>
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
      <PageHero image={PHOTOS.ballroom} eyebrow="Our spaces" title="Halls & Spaces" text="Find the room that fits your celebration — by size, style, and occasion." />
      <p className="lead">Filter by hall type or event. Prices shown as “Enquire for Pricing” mean the venue quotes for your date and guest count.</p>
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
      <PageHero image={hall.image} eyebrow={hall.category} title={hall.name} text={hall.shortDescription} />
      <p><span className="tag">{hall.category}</span><span className="tag">{hall.hallType}</span><span className="price">{priceLabel(hall)}</span></p>
      <p style={{ marginTop: 16 }}>{hall.description}</p>
      <p><em>{hall.capacityNote}</em></p>
      <h3>Facilities</h3><p>{hall.facilities.join(' · ')}</p>
      <h3>Suitable for</h3><p>{hall.eventTypes.join(' · ')}</p>
      <div className="gal">{hall.gallery.map((g, i) => <img key={i} loading="lazy" src={g} alt={`${hall.name} photo ${i + 1}`} />)}</div>
      <p style={{ marginTop: 28 }}><Link className="btn" to={`/enquiry?hall=${hall.id}`}>Enquire for this Hall</Link> <Link className="btn btn-dark" to="/halls">Back to Halls</Link></p>
    </div>
  )
}

export function PackagesPage({ state }) {
  return (<div><PageHero image={PHOTOS.floral} eyebrow="Celebrations, simplified" title="Packages" text="Elegant starting points — then tailored to your date, hall, and guest list." />
    <p className="lead">Demo package outlines. Final inclusions and quotations are prepared by the management for your date, hall and guest count.</p>
    <div className="grid">{state.packages.filter((p) => p.isPublished).map((p) => (
      <article className="card" key={p.id}><div className="card-img"><img loading="lazy" src={p.image} alt={p.name} /></div><div className="card-body">
        <div className="row"><h3>{p.name}</h3><span className="price">{priceLabel(p)}</span></div><p>{p.description}</p>
        <h4>Inclusions</h4><ul>{p.inclusions.map((x, i) => <li key={i}>{x}</li>)}</ul>
        <h4>Optional add-ons</h4><p>{p.addons.join(', ')}</p><p><small>{p.terms}</small></p>
      </div></article>))}</div></div>)
}

const SERVICE_IMAGES = {
  'Hall Rental': PHOTOS.ballroom, 'Catering Arrangements': PHOTOS.dining,
  'Stage & Mandap Decoration': PHOTOS.mandap, 'Floral Decoration': PHOTOS.floral,
  'Lighting & Sound': PHOTOS.reception, 'Bridal & Preparation Rooms': PHOTOS.garden,
  'Guest Parking': PHOTOS.banquet, 'Power Backup': PHOTOS.ballroom
}

export function ServicesPage({ state }) {
  return (<div><PageHero image={PHOTOS.reception} eyebrow="Everything around the celebration" title="Services" text="From the first welcome to the last song — the details, taken care of, so you can be present for the moment." />
    <p className="lead">A complete celebration is more than a hall. These demo services cover dining, decor, light, sound, and comfort for your guests — confirm menus, inclusions, and availability when you enquire.</p>
    <div className="grid">{state.services.map((s) => (
      <article className="card" key={s.id}><div className="card-img"><img loading="lazy" src={SERVICE_IMAGES[s.name] || PHOTOS.ballroom} alt={s.name} /></div>
        <div className="card-body"><h3>{s.name}</h3><p><span className="tag">{s.category}</span><span className="tag">{s.provider}</span></p><p>{s.description}</p></div></article>))}</div>
    <div className="cta"><h2>Want a service tailored to your celebration?</h2><p>Tell us your date, hall, and occasion — the venue will put together a quotation around what you actually need.</p><p><Link className="btn" to="/enquiry">Ask About Services</Link></p></div></div>)
}

export function GalleryPage({ state }) {
  const [cat, setCat] = useState('All')
  const [open, setOpen] = useState(null)
  const items = cat === 'All' ? state.gallery : state.gallery.filter((g) => g.category === cat)
  return (<div><PageHero image={PHOTOS.garden} eyebrow="Moments in pictures" title="Gallery" text="Rooms dressed for weddings, gardens at golden hour, and tables set for celebration." />
    <div className="chips">{['All', 'Venue', 'Decor', 'Celebration'].map((c) => <button key={c} className={`chip ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>{c}</button>)}</div>
    <div className="gal">{items.map((g) => <img key={g.id} loading="lazy" src={g.image} alt={g.title} onClick={() => setOpen(g)} style={{ cursor: 'pointer' }} />)}</div>
    {open && <div className="lightbox open" onClick={() => setOpen(null)}><button aria-label="Close photo" onClick={() => setOpen(null)}>×</button><img src={open.image} alt={open.title} /></div>}
    <p>Tip: click a photo to view it larger. Click the backdrop or the × button to close.</p></div>)
}

export function AboutPage({ state }) {
  return (<div><PageHero image={PHOTOS.ballroom} eyebrow="Our story" title="A Place for Celebrations" text="Where families gather, vows are exchanged, and ordinary evenings turn into memories." />
    <p className="lead">{state.settings.about}</p>
    <section className="section"><div className="grid2">
      <div><img src={PHOTOS.garden} alt="Celebration garden" style={{ borderRadius: 20, height: 360, width: '100%', objectFit: 'cover' }} /></div>
      <div><h2>Begin beautifully, celebrate fully</h2><p>A wedding is not just one day — it is the weeks of planning, the morning preparations, the first look, the music, and the people who travel to be there. A good venue makes all of that feel lighter: clear spaces, thoughtful layouts, and a team that has thought about the details before you have to ask.</p><p>This site is a preview of that experience. Explore the halls, picture your occasion in each one, and then come for a visit — the rooms tell the story better than any page can.</p><p><Link className="btn" to="/halls">Explore Our Halls</Link></p></div>
    </div></section>
    <section className="section"><h2>What a celebration here feels like</h2><p className="lead">Not a list of claims — just the experience we aim to create, in every hall and every occasion.</p>
    <div className="blocks">
      <div className="block"><img src={PHOTOS.ballroom} alt="Elegant ballroom" /><h3>Hospitality, first</h3><p>Warm, organised hosting for weddings and family occasions — so hosts can celebrate instead of managing.</p></div>
      <div className="block"><img src={PHOTOS.floral} alt="Floral decor" /><h3>Care in the details</h3><p>Thoughtful arrangements, from the stage and mandap to the dining layout and the light as evening falls.</p></div>
      <div className="block"><img src={PHOTOS.reception} alt="Reception tables" /><h3>Comfort for every guest</h3><p>Spaces designed to bring people together — easy to find, easy to enjoy, and easy to remember.</p></div>
    </div></section>
    <div className="cta"><h2>Come and see it in person</h2><p>Venue visits are by appointment. Send a site-visit request and walk the halls before you decide.</p><p><Link className="btn" to="/enquiry">Book a Site Visit</Link></p></div></div>)
}

export function FaqsPage({ state }) {
  const [q, setQ] = useState('')
  const list = state.faqs.filter((f) => (f.question + f.answer).toLowerCase().includes(q.toLowerCase()))
  return (<div><PageHero image={PHOTOS.mandap} eyebrow="Good to know" title="Frequently Asked Questions" text="Clear answers, before you enquire — about bookings, availability, visits, and pricing." />
    <p className="lead">Search below, or send an enquiry if your question isn't here. The venue will reply with the details for your date and hall.</p>
    <label>Search FAQs<input value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. booking, availability, catering" /></label>
    {list.map((f) => <details key={f.id} className="faq"><summary>{f.question}</summary><p>{f.answer}</p></details>)}
    {!list.length && <p>No FAQs match that search.</p>}
    <div className="cta"><h2>Still unsure about something?</h2><p>Ask directly — an enquiry takes a few minutes and is never a confirmed booking.</p><p><Link className="btn" to="/enquiry">Ask a Question</Link></p></div></div>)
}

export function ContactPage({ state }) {
  const s = state.settings
  return (<div><PageHero image={PHOTOS.reception} eyebrow="We would love to hear from you" title="Contact & Visit" text="Call, email, or send an enquiry — and come walk the halls before your big day." />
    <p className="lead">The easiest next step is a short visit. See the light in the room, check the dining layout, and talk through your date, guest list, and occasion in person.</p>
    <div className="blocks">
      <div className="block"><h3>Visit</h3><p>{s.address}<br />{s.openingHours}<br />{s.visitingHours}</p><p><a href={s.mapUrl} target="_blank" rel="noreferrer">Get Directions →</a></p></div>
      <div className="block"><h3>Call & WhatsApp</h3><p>Phone: <a href={`tel:${s.phone.replace(/\s/g, '')}`}>{s.phone}</a><br />WhatsApp: {s.whatsapp}<br /><small>Demo numbers — replace with the real venue's contacts before launch.</small></p></div>
      <div className="block"><h3>Email</h3><p><a href={`mailto:${s.email}`}>{s.email}</a><br /><small>For enquiries, site visits, and quotations.</small></p><p><Link className="btn" to="/enquiry">Send an Enquiry</Link></p></div>
    </div>
    <section className="section"><div className="grid2">
      <div><img src={PHOTOS.ballroom} alt="Grand Pavilion hall" style={{ borderRadius: 20, height: 360, width: '100%', objectFit: 'cover' }} /></div>
      <div><h2>What to bring to your visit</h2><p>Just three things help the venue give you a clear answer: your preferred date (or a range), your approximate guest count, and the kind of occasion — wedding, reception, engagement, or family celebration.</p><p>From there, the venue can confirm which hall fits, what is included, and what your quotation would look like.</p><p><Link className="btn" to="/enquiry">Plan Your Visit</Link> <Link className="btn btn-dark" to="/halls">Browse Halls First</Link></p></div>
    </div></section></div>)
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
  return (<div><PageHero image={PHOTOS.floral} eyebrow="Start with a conversation" title="Enquiry & Site-Visit Request" text="An enquiry is never a confirmed booking. You will receive a reference number, and the venue confirms separately." />
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
    <div style={{ marginTop: 32 }}><AvailabilityChecker state={state} halls={state.halls.filter((h) => h.isPublished)} /></div>
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
