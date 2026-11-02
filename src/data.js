// Demo content only — replace with the real venue's details before launch.
// Prices: null + pricing_type means "Enquire for Pricing" / custom quotation.
export const SETTINGS = {
  businessName: 'The Grand Pavilion',
  businessType: 'Marriage Hall & Wedding Event Venue',
  tagline: 'A Beautiful Beginning to Every Celebration.',
  description:
    'A beautiful venue for weddings, receptions, family celebrations, and unforgettable occasions. Discover elegant event spaces, thoughtful hospitality, and a setting designed to bring people together. (Demo description — replace with your own in Admin → Settings.)',
  address: '123 Celebration Avenue, Your City, India — DEMO ONLY',
  phone: '+91 90000 00000',
  whatsapp: '+91 90000 00000',
  email: 'hello@example.com',
  openingHours: 'Open daily, 9:00 AM – 9:00 PM (demo hours)',
  visitingHours: 'Venue visits by appointment — please call or send a site-visit request (demo)',
  currency: 'INR',
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=123+Celebration+Avenue+India',
  about:
    "The Grand Pavilion is presented here with demo content so you can explore the complete website and admin panel. Replace this text with your venue's genuine story — your spaces, your hospitality, and the celebrations you host. No history, awards or experience claims are made here, because those must come from the real business.",
  heroImage:
    'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1600&q=80'
}

const img = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`

export const PHOTOS = {
  ballroom: img('photo-1519167758481-83f550bb49b3'),
  banquet: img('photo-1511795409834-ef04bbd61622'),
  garden: img('photo-1465495976277-4387d4b0b4c6'),
  mandap: img('photo-1583939003579-730e3918a45a'),
  floral: img('photo-1519741497674-611481863552'),
  reception: img('photo-1519225421980-715cb0215aed'),
  dining: img('photo-1414235077428-338989a2e8c0')
}

export const HALLS = [
  {
    id: 1, slug: 'the-grand-ballroom', name: 'The Grand Ballroom',
    category: 'Ballroom', hallType: 'Indoor', isFeatured: true, isPublished: true,
    shortDescription: 'Our largest demo celebration space — an elegant ballroom setting for weddings and grand receptions.',
    description:
      'Our largest demo celebration space — an elegant ballroom setting for weddings and grand receptions. This is demo content for preview purposes: capacities, dimensions, floor details and facilities for this space have not been confirmed by the business yet, so none are published here. The owner can add the genuine figures in Admin → Halls & Spaces.',
    facilities: ['Stage', 'Dining Area', 'Air Conditioning', 'Lighting and Sound'],
    eventTypes: ['Wedding Ceremonies', 'Wedding Receptions', 'Sangeet Nights', 'Anniversary Celebrations'],
    image: PHOTOS.ballroom, gallery: [PHOTOS.ballroom, PHOTOS.banquet, PHOTOS.floral],
    price: null, pricingType: 'price_on_request',
    capacityNote: 'Capacities are confirmed by the management for your event type and layout — please ask when you enquire. (Demo note.)'
  },
  {
    id: 2, slug: 'the-royal-banquet-hall', name: 'The Royal Banquet Hall',
    category: 'Banquet Hall', hallType: 'Indoor', isFeatured: true, isPublished: true,
    shortDescription: 'A refined demo banquet hall suited to receptions, engagements and family functions.',
    description:
      'A refined demo banquet hall suited to receptions, engagements and family functions. This is demo content for preview purposes: capacities, dimensions, floor details and facilities for this space have not been confirmed by the business yet, so none are published here. The owner can add the genuine figures in Admin → Halls & Spaces.',
    facilities: ['Stage', 'Dining Area', 'Air Conditioning', 'Bridal Room'],
    eventTypes: ['Wedding Receptions', 'Engagement Ceremonies', 'Birthday Celebrations', 'Family Functions'],
    image: PHOTOS.banquet, gallery: [PHOTOS.banquet, PHOTOS.reception, PHOTOS.mandap],
    price: null, pricingType: 'price_on_request',
    capacityNote: 'Capacities are confirmed by the management for your event type and layout — please ask when you enquire. (Demo note.)'
  },
  {
    id: 3, slug: 'the-celebration-garden', name: 'The Celebration Garden',
    category: 'Garden', hallType: 'Outdoor', isFeatured: true, isPublished: true,
    shortDescription: 'An open-air demo garden space for ceremonies and evening celebrations under the sky.',
    description:
      'An open-air demo garden space for ceremonies and evening celebrations under the sky. This is demo content for preview purposes: capacities, dimensions, floor details and facilities for this space have not been confirmed by the business yet, so none are published here. The owner can add the genuine figures in Admin → Halls & Spaces.',
    facilities: ['Mandap Area', 'Lighting', 'Parking'],
    eventTypes: ['Wedding Ceremonies', 'Haldi Ceremonies', 'Mehendi Functions', 'Community Gatherings'],
    image: PHOTOS.garden, gallery: [PHOTOS.garden, PHOTOS.floral],
    price: null, pricingType: 'price_on_request',
    capacityNote: 'Capacities are confirmed by the management for your event type and layout — please ask when you enquire. (Demo note.)'
  },
  {
    id: 4, slug: 'the-imperial-event-space', name: 'The Imperial Event Space',
    category: 'Event Space', hallType: 'Indoor', isFeatured: false, isPublished: true,
    shortDescription: 'A versatile demo event space for pre-wedding functions, birthdays and corporate gatherings.',
    description:
      'A versatile demo event space for pre-wedding functions, birthdays and corporate gatherings. This is demo content for preview purposes: capacities, dimensions, floor details and facilities for this space have not been confirmed by the business yet, so none are published here. The owner can add the genuine figures in Admin → Halls & Spaces.',
    facilities: ['Stage', 'Sound System', 'Air Conditioning'],
    eventTypes: ['Engagement Ceremonies', 'Sangeet Nights', 'Birthday Celebrations', 'Corporate Events'],
    image: PHOTOS.mandap, gallery: [PHOTOS.mandap, PHOTOS.dining],
    price: null, pricingType: 'price_on_request',
    capacityNote: 'Capacities are confirmed by the management for your event type and layout — please ask when you enquire. (Demo note.)'
  }
]

export const PACKAGES = [
  {
    id: 1, slug: 'wedding-celebration-package', name: 'Wedding Celebration Package',
    category: 'Wedding Package', isFeatured: true, isPublished: true,
    description: 'A demo package outline for a full wedding celebration. The final inclusions and quotation are prepared by the management for your date, hall and guest count.',
    inclusions: ['Venue hall for the ceremony', 'Stage and mandap arrangement discussion', 'Dining area setup discussion'],
    exclusions: ['Anything not listed under inclusions — confirmed in your written quotation'],
    addons: ['Extended decoration', 'Additional function hours'],
    eventTypes: ['Wedding Ceremonies', 'Wedding Receptions', 'Engagement Ceremonies'],
    image: PHOTOS.floral, price: null, pricingType: 'custom_quotation',
    terms: 'Demo terms placeholder. Final terms are shared by the management in your quotation.'
  },
  {
    id: 2, slug: 'reception-package', name: 'Reception Package',
    category: 'Reception Package', isFeatured: true, isPublished: true,
    description: 'A demo package outline for a wedding reception evening, tailored after a venue visit and discussion of your requirements.',
    inclusions: ['Venue hall for the reception', 'Stage arrangement discussion', 'Guest seating and dining layout discussion'],
    exclusions: ['Anything not listed under inclusions — confirmed in your written quotation'],
    addons: ['Welcome decoration', 'Lighting themes'],
    eventTypes: ['Wedding Ceremonies', 'Wedding Receptions', 'Engagement Ceremonies'],
    image: PHOTOS.reception, price: null, pricingType: 'custom_quotation',
    terms: 'Demo terms placeholder. Final terms are shared by the management in your quotation.'
  },
  {
    id: 3, slug: 'engagement-package', name: 'Engagement Package',
    category: 'Engagement Package', isFeatured: true, isPublished: true,
    description: 'A demo package outline for engagement and ring ceremonies, quoted individually for each celebration.',
    inclusions: ['Venue hall for the ceremony', 'Stage arrangement discussion'],
    exclusions: ['Anything not listed under inclusions — confirmed in your written quotation'],
    addons: ['Floral decoration', 'Photography area setup'],
    eventTypes: ['Wedding Ceremonies', 'Wedding Receptions', 'Engagement Ceremonies'],
    image: PHOTOS.dining, price: null, pricingType: 'custom_quotation',
    terms: 'Demo terms placeholder. Final terms are shared by the management in your quotation.'
  }
]

export const SERVICES = [
  { id: 1, name: 'Hall Rental', category: 'Catering & Dining', provider: 'In-house', description: 'The event hall itself, arranged for your function type and guest count.' },
  { id: 2, name: 'Catering Arrangements', category: 'Catering & Dining', provider: 'In-house', description: 'Menu and dining arrangements are discussed with the management for your event. (Demo listing — confirm menus when you enquire.)' },
  { id: 3, name: 'Stage & Mandap Decoration', category: 'Decoration', provider: 'In-house', description: 'Stage and mandap decoration options for ceremonies and receptions. (Demo listing.)' },
  { id: 4, name: 'Floral Decoration', category: 'Decoration', provider: 'Partner', description: 'Floral arrangements for entrances, stages and tables through decoration partners. (Demo listing.)' },
  { id: 5, name: 'Lighting & Sound', category: 'Event Arrangements', provider: 'In-house', description: 'Lighting and sound arrangements for ceremonies, sangeet nights and receptions. (Demo listing.)' },
  { id: 6, name: 'Bridal & Preparation Rooms', category: 'Accommodation', provider: 'In-house', description: 'Dedicated preparation rooms for the couple and family. (Demo listing — confirm availability for your hall.)' },
  { id: 7, name: 'Guest Parking', category: 'Facilities', provider: 'In-house', description: 'Parking arrangements for guests. (Demo listing — capacity confirmed by the management.)' },
  { id: 8, name: 'Power Backup', category: 'Facilities', provider: 'In-house', description: 'Power backup arrangements for uninterrupted celebrations. (Demo listing.)' }
]

export const GALLERY = [
  { id: 1, category: 'Venue', title: 'Grand Ballroom', image: PHOTOS.ballroom },
  { id: 2, category: 'Venue', title: 'Banquet Hall', image: PHOTOS.banquet },
  { id: 3, category: 'Venue', title: 'Celebration Garden', image: PHOTOS.garden },
  { id: 4, category: 'Decor', title: 'Floral Decor', image: PHOTOS.floral },
  { id: 5, category: 'Decor', title: 'Mandap Stage', image: PHOTOS.mandap },
  { id: 6, category: 'Celebration', title: 'Reception Tables', image: PHOTOS.reception },
  { id: 7, category: 'Celebration', title: 'Dining Setup', image: PHOTOS.dining }
]

export const FAQS = [
  { id: 1, question: 'Is an enquiry a confirmed booking?', answer: 'No. An enquiry only creates a reference number. The venue confirms availability, hall and pricing separately in writing.' },
  { id: 2, question: 'How do I check if a hall is available on my date?', answer: 'Use the Availability checker on the Home or Enquiry page. A date with no published record is reported as not configured, never as available — please enquire for that date.' },
  { id: 3, question: 'Can I visit the venue before booking?', answer: 'Yes, venue visits are by appointment. Send a site-visit request through the Enquiry form or call the venue.' },
  { id: 4, question: 'Are prices fixed?', answer: 'Most packages in this demo are custom quotations. The final quotation depends on your date, hall, guest count and inclusions, and is shared by the management.' },
  { id: 5, question: 'Do you provide catering and decoration?', answer: 'Catering arrangements, stage and mandap decoration, floral decoration, lighting and sound are listed under Services. Confirm menus and inclusions when you enquire, as demo listings are not a final offer.' }
]

export const ENQUIRY_STATUSES = [
  'New', 'Contacted', 'Site Visit Scheduled', 'Site Visit Done', 'Quotation Sent',
  'Follow-up', 'Confirmed', 'Completed', 'Cancelled'
]

export function priceLabel(item) {
  if (item.price != null) return `₹${item.price.toLocaleString('en-IN')}`
  if (item.pricingType === 'custom_quotation') return 'Custom Quotation'
  return 'Enquire for Pricing'
}
