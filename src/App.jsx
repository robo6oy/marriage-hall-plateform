import { HashRouter, Routes, Route } from 'react-router-dom'
import { Header, Footer } from './components'
import { useStore } from './store'
import { Home, HallsPage, HallDetail, PackagesPage, ServicesPage, GalleryPage, AboutPage, FaqsPage, ContactPage, EnquiryPage, PrivacyPage, TermsPage, NotFound } from './pages'
import { Admin } from './admin'

export default function App() {
  const [state, setState] = useStore()
  return (
    <HashRouter>
      <Header settings={state.settings} />
      <main className="wrap main">
        <Routes>
          <Route path="/" element={<Home state={state} />} />
          <Route path="/halls" element={<HallsPage state={state} />} />
          <Route path="/halls/:slug" element={<HallDetail state={state} />} />
          <Route path="/packages" element={<PackagesPage state={state} />} />
          <Route path="/services" element={<ServicesPage state={state} />} />
          <Route path="/gallery" element={<GalleryPage state={state} />} />
          <Route path="/about" element={<AboutPage state={state} />} />
          <Route path="/faqs" element={<FaqsPage state={state} />} />
          <Route path="/contact" element={<ContactPage state={state} />} />
          <Route path="/enquiry" element={<EnquiryPage state={state} setState={setState} />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/admin" element={<Admin state={state} setState={setState} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer settings={state.settings} />
    </HashRouter>
  )
}
