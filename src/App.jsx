import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import ServicesOverview from './pages/ServicesOverview';
import ServiceDetail from './pages/ServiceDetail';
import WorkOverview from './pages/WorkOverview';
import CaseStudyDetail from './pages/CaseStudyDetail';
import Testimonials from './pages/Testimonials';
import './styles/services.css';
import './styles/work.css';
import './styles/stats.css';
import './styles/process.css';
import './styles/contact.css';
import './styles/footer.css';
import './styles/page-hero.css';
import './styles/motion.css';
import './styles/scroll-top-button.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/services" element={<ServicesOverview />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/work" element={<WorkOverview />} />
          <Route path="/work/:slug" element={<CaseStudyDetail />} />
          <Route path="/testimonials" element={<Testimonials />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
