import { useEffect, useState } from 'react'
import { SETTINGS, HALLS, PACKAGES, SERVICES, GALLERY, FAQS } from './data'

// Single source of truth for public pages and admin in this code version.
// Seeded from src/data.js into localStorage on first load.
// PRODUCTION NOTE: replace this file with Supabase (see README) for
// multi-device persistence and real authentication.
const KEY = 'grand-pavilion-store-v1'

function seed() {
  return {
    settings: SETTINGS,
    halls: HALLS,
    packages: PACKAGES,
    services: SERVICES,
    gallery: GALLERY,
    faqs: FAQS,
    enquiries: [],
    availability: {}, // key: `${hallId}|${yyyy-mm-dd}` -> 'available' | 'booked'
    enquirySeq: 0
  }
}

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) { const s = seed(); localStorage.setItem(KEY, JSON.stringify(s)); return s }
    return { ...seed(), ...JSON.parse(raw) }
  } catch { return seed() }
}

function save(state) { try { localStorage.setItem(KEY, JSON.stringify(state)) } catch {} }

export function useStore() {
  const [state, setState] = useState(load)
  useEffect(() => { save(state) }, [state])
  return [state, setState]
}

export function update(state, patch) { return { ...state, ...patch } }

export function availabilityFor(state, hallId, date) {
  if (!hallId || !date) return null
  return state.availability[`${hallId}|${date}`] || null // null = not configured
}

export function nextReference(state) {
  const year = new Date().getFullYear()
  const seq = (state.enquirySeq || 0) + 1
  return { ref: `GP-${year}-${String(seq).padStart(4, '0')}`, seq }
}

export function downloadCsv(filename, rows) {
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
  const csv = rows.map((r) => r.map(esc).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob); a.download = filename; a.click()
  URL.revokeObjectURL(a.href)
}
