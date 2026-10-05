import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import './styles/services.css';
import './styles/work.css';
import './styles/stats.css';
import './styles/process.css';
import './styles/contact.css';
import './styles/footer.css';
import './styles/page-hero.css';
import './styles/motion.css';
import './styles/scroll-top-button.css';

// Lazy-load every route's page component so the initial bundle only ships
// the code a visitor's first page actually needs — Vite splits each of
// these into its own chunk, fetched on navigation instead of all upfront.
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const ServicesOverview = lazy(() => import('./pages/ServicesOverview'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const WorkOverview = lazy(() => import('./pages/WorkOverview'));
const CaseStudyDetail = lazy(() => import('./pages/CaseStudyDetail'));
const Testimonials = lazy(() => import('./pages/Testimonials'));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={null}>
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
      </Suspense>
    </BrowserRouter>
  );
}
