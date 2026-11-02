import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ENQUIRY_STATUSES, priceLabel } from './data'
import { downloadCsv, update } from './store'

// Demo convenience only: a local passcode, NOT production authentication.
// For production, use Supabase Auth (see README) and server-side checks.
const PASS_KEY = 'grand-pavilion-admin-pass'
const SESSION_KEY = 'grand-pavilion-admin-session'
const hash = (s) => btoa(unescape(encodeURIComponent(s)))

export function Admin({ state, setState }) {
  const [passSet, setPassSet] = useState(() => !!localStorage.getItem(PASS_KEY))
  const [loggedIn, setLoggedIn] = useState(() => localStorage.getItem(SESSION_KEY) === '1')
  const [tab, setTab] = useState('overview')
  const [pw, setPw] = useState(''); const [msg, setMsg] = useState('')

  if (!passSet) return (
    <div><h2>Admin — First Setup</h2><p>Set a passcode for this browser. This is a demo convenience only — for production, use Supabase Auth (see README).</p>
      <form className="form" onSubmit={(e) => { e.preventDefault(); if (pw.length < 4) { setMsg('Choose at least 4 characters.'); return } localStorage.setItem(PASS_KEY, hash(pw)); localStorage.setItem(SESSION_KEY, '1'); setPassSet(true); setLoggedIn(true) }}>
        <label>Choose a passcode<input type="password" value={pw} onChange={(e) => setPw(e.target.value)} /></label>
        {msg && <p className="error">{msg}</p>}<button className="btn" type="submit">Set Passcode & Enter Admin</button>
      </form></div>
  )
  if (!loggedIn) return (
    <div><h2>Admin Login</h2>
      <form className="form" onSubmit={(e) => { e.preventDefault(); if (hash(pw) === localStorage.getItem(PASS_KEY)) { localStorage.setItem(SESSION_KEY, '1'); setLoggedIn(true) } else setMsg('Incorrect passcode.') }}>
        <label>Passcode<input type="password" value={pw} onChange={(e) => setPw(e.target.value)} /></label>
        {msg && <p className="error">{msg}</p>}<button className="btn" type="submit">Log In</button>
      </form></div>
  )

  const logout = () => { localStorage.removeItem(SESSION_KEY); setLoggedIn(false) }
  const tabs = [['overview', 'Overview'], ['enquiries', 'Enquiries'], ['halls', 'Halls & Spaces'], ['packages', 'Packages'], ['availability', 'Availability'], ['settings', 'Website Settings']]
  return (
    <div>
      <div className="row"><h2>Admin Panel</h2><span><Link className="btn btn-dark" to="/">View Website</Link> <button className="btn" onClick={logout}>Log Out</button></span></div>
      <div className="chips">{tabs.map(([k, label]) => <button key={k} className={`chip ${tab === k ? 'active' : ''}`} onClick={() => setTab(k)}>{label}</button>)}</div>
      {tab === 'overview' && <div className="blocks">
        <div className="block"><h3>Halls</h3><p>{state.halls.length} total · {state.halls.filter((h) => h.isPublished).length} published</p></div>
        <div className="block"><h3>Packages</h3><p>{state.packages.length} total · {state.packages.filter((p) => p.isPublished).length} published</p></div>
        <div className="block"><h3>Enquiries</h3><p>{state.enquiries.length} total · {state.enquiries.filter((e) => e.status === 'New').length} new</p></div>
        <div className="block"><h3>Note</h3><p>Edits here are stored in this browser (localStorage) in this code version. For multi-device use, connect Supabase — see README.</p></div>
      </div>}
      {tab === 'enquiries' && <Enquiries state={state} setState={setState} />}
      {tab === 'halls' && <HallEditor state={state} setState={setState} />}
      {tab === 'packages' && <PackageEditor state={state} setState={setState} />}
      {tab === 'availability' && <AvailabilityEditor state={state} setState={setState} />}
      {tab === 'settings' && <SettingsEditor state={state} setState={setState} />}
    </div>
  )
}

function Enquiries({ state, setState }) {
  const patch = (id, p) => setState(update(state, { enquiries: state.enquiries.map((e) => e.id === id ? { ...e, ...p } : e) }))
  return (<div><h3>Enquiries</h3>
    <p><button className="btn" onClick={() => downloadCsv('enquiries.csv', [['Reference', 'Name', 'Email', 'Phone', 'Hall', 'Date', 'Status', 'Message'], ...state.enquiries.map((e) => [e.ref, e.name, e.email, e.phone, e.hallId, e.date, e.status, e.message])])}>Export CSV</button></p>
    {!state.enquiries.length && <p>No enquiries yet in this browser. Submit one from the public Enquiry page to test.</p>}
    {state.enquiries.map((e) => (
      <article className="card card-body" key={e.id} style={{ marginBottom: 12 }}>
        <div className="row"><strong>{e.ref} — {e.name}</strong><span>{e.createdAt ? new Date(e.createdAt).toLocaleDateString() : ''}</span></div>
        <p>{e.message}<br /><small>{e.email} · {e.phone} · Hall {e.hallId || 'any'} · {e.date || 'no date'} · {e.eventType} · {e.guests} guests</small></p>
        <label>Status<select value={e.status} onChange={(ev) => patch(e.id, { status: ev.target.value })}>{ENQUIRY_STATUSES.map((s) => <option key={s}>{s}</option>)}</select></label>
        <label>Private notes<textarea rows="2" value={e.notes || ''} onChange={(ev) => patch(e.id, { notes: ev.target.value })} /></label>
        <label>Follow-up date<input type="date" value={e.followUp || ''} onChange={(ev) => patch(e.id, { followUp: ev.target.value })} /></label>
        <p><button className="btn btn-dark" onClick={() => { if (window.confirm('Delete this enquiry?')) setState(update(state, { enquiries: state.enquiries.filter((x) => x.id !== e.id) })) }}>Delete</button></p>
      </article>))}</div>)
}

function HallEditor({ state, setState }) {
  const [form, setForm] = useState({ name: '', category: 'Ballroom', hallType: 'Indoor', shortDescription: '', description: '', facilities: '', eventTypes: '', image: '' })
  return (<div><h3>Halls & Spaces</h3>
    <div className="grid">{state.halls.map((h) => (
      <article className="card card-body" key={h.id}><h4>{h.name}</h4><p>{h.category} · {h.hallType} · {priceLabel(h)}</p>
        <label>Published<input type="checkbox" checked={h.isPublished} onChange={(e) => setState(update(state, { halls: state.halls.map((x) => x.id === h.id ? { ...x, isPublished: e.target.checked } : x) }))} /></label>
        <p><button className="btn btn-dark" onClick={() => { if (window.confirm(`Delete ${h.name}?`)) setState(update(state, { halls: state.halls.filter((x) => x.id !== h.id) })) }}>Delete</button></p></article>))}</div>
    <h4 style={{ marginTop: 24 }}>Add a hall</h4>
    <form className="form" onSubmit={(e) => { e.preventDefault(); if (!form.name.trim()) return; setState(update(state, { halls: [...state.halls, { id: Date.now(), slug: form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), isFeatured: false, isPublished: true, price: null, pricingType: 'price_on_request', facilities: form.facilities.split(',').map((s) => s.trim()).filter(Boolean), eventTypes: form.eventTypes.split(',').map((s) => s.trim()).filter(Boolean), gallery: [], capacityNote: '', ...form }] })); setForm({ name: '', category: 'Ballroom', hallType: 'Indoor', shortDescription: '', description: '', facilities: '', eventTypes: '', image: '' }) }}>
      <label>Name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
      <label>Category<input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></label>
      <label>Hall type<select value={form.hallType} onChange={(e) => setForm({ ...form, hallType: e.target.value })}><option>Indoor</option><option>Outdoor</option></select></label>
      <label>Short description<input value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} /></label>
      <label>Description<textarea rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
      <label>Facilities (comma separated)<input value={form.facilities} onChange={(e) => setForm({ ...form, facilities: e.target.value })} /></label>
      <label>Event types (comma separated)<input value={form.eventTypes} onChange={(e) => setForm({ ...form, eventTypes: e.target.value })} /></label>
      <label>Image URL<input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} /></label>
      <button className="btn" type="submit">Add Hall</button>
    </form></div>)
}

function PackageEditor({ state, setState }) {
  const [name, setName] = useState('')
  return (<div><h3>Packages</h3>
    <div className="grid">{state.packages.map((p) => (
      <article className="card card-body" key={p.id}><h4>{p.name}</h4><p>{p.category} · {priceLabel(p)}</p>
        <label>Published<input type="checkbox" checked={p.isPublished} onChange={(e) => setState(update(state, { packages: state.packages.map((x) => x.id === p.id ? { ...x, isPublished: e.target.checked } : x) }))} /></label>
        <p><button className="btn btn-dark" onClick={() => { if (window.confirm(`Delete ${p.name}?`)) setState(update(state, { packages: state.packages.filter((x) => x.id !== p.id) })) }}>Delete</button></p></article>))}</div>
    <form className="form" style={{ marginTop: 24 }} onSubmit={(e) => { e.preventDefault(); if (!name.trim()) return; setState(update(state, { packages: [...state.packages, { id: Date.now(), slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), category: 'Wedding Package', isFeatured: false, isPublished: true, description: 'Demo package outline — edit the description in src/data.js or extend this editor.', inclusions: [], exclusions: [], addons: [], eventTypes: [], image: '', price: null, pricingType: 'custom_quotation', terms: '' }] })); setName('') }}>
      <label>New package name<input value={name} onChange={(e) => setName(e.target.value)} /></label><button className="btn" type="submit">Add Package</button>
    </form></div>)
}

function AvailabilityEditor({ state, setState }) {
  const [hallId, setHallId] = useState(state.halls[0]?.id || ''); const [date, setDate] = useState(''); const [status, setStatus] = useState('available')
  return (<div><h3>Availability</h3><p>A date with no record is reported as “not configured” on the public site — never as available.</p>
    <form className="form" onSubmit={(e) => { e.preventDefault(); if (!hallId || !date) return; setState(update(state, { availability: { ...state.availability, [`${hallId}|${date}`]: status } })) }}>
      <label>Hall<select value={hallId} onChange={(e) => setHallId(e.target.value)}>{state.halls.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}</select></label>
      <label>Date<input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label>
      <label>Status<select value={status} onChange={(e) => setStatus(e.target.value)}><option value="available">Available</option><option value="booked">Booked</option></select></label>
      <button className="btn" type="submit">Save Availability</button>
    </form>
    <ul>{Object.entries(state.availability).map(([k, v]) => { const [hid, d] = k.split('|'); const hall = state.halls.find((h) => String(h.id) === hid); return (<li key={k}>{hall?.name || hid} — {d} — {v} <button className="btn btn-dark" onClick={() => { const a = { ...state.availability }; delete a[k]; setState(update(state, { availability: a })) }}>Delete</button></li>) })}</ul></div>)
}

function SettingsEditor({ state, setState }) {
  const [s, setS] = useState(state.settings)
  return (<div><h3>Website Settings</h3><p>Changes here update the public site immediately in this browser.</p>
    <form className="form" onSubmit={(e) => { e.preventDefault(); setState(update(state, { settings: s })) }}>
      <label>Business name<input value={s.businessName} onChange={(e) => setS({ ...s, businessName: e.target.value })} /></label>
      <label>Tagline<input value={s.tagline} onChange={(e) => setS({ ...s, tagline: e.target.value })} /></label>
      <label>Description<textarea rows="3" value={s.description} onChange={(e) => setS({ ...s, description: e.target.value })} /></label>
      <label>Address<input value={s.address} onChange={(e) => setS({ ...s, address: e.target.value })} /></label>
      <label>Phone<input value={s.phone} onChange={(e) => setS({ ...s, phone: e.target.value })} /></label>
      <label>Email<input type="email" value={s.email} onChange={(e) => setS({ ...s, email: e.target.value })} /></label>
      <label>Opening hours<input value={s.openingHours} onChange={(e) => setS({ ...s, openingHours: e.target.value })} /></label>
      <label>Hero image URL<input value={s.heroImage} onChange={(e) => setS({ ...s, heroImage: e.target.value })} /></label>
      <button className="btn" type="submit">Save Settings</button>
    </form>
    <h4 style={{ marginTop: 24 }}>Supabase migration (production)</h4>
    <p>To move beyond browser-local storage: create Supabase tables for settings, halls, packages, services, gallery, FAQs, enquiries and availability; enable Row Level Security so only authenticated admins can write; use Supabase Auth for admin login; and replace <code>src/store.js</code> with Supabase queries. Do not expose a service-role key in browser code.</p></div>)
}
