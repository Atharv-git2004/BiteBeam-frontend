import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTopBtn from './components/ScrollToTopBtn';
import Home from './pages/Home';
import Menu from './pages/Menu';
import OurStory from './pages/OurStory';
import Catering from './pages/Catering';
import Contact from './pages/Contact';

const pageVariants = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.25, ease: 'easeIn' } },
};

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname} variants={pageVariants} initial="initial" animate="animate" exit="exit">
        <Routes location={location}>
          <Route path="/"          element={<Home />} />
          <Route path="/menu"      element={<Menu />} />
          <Route path="/our-story" element={<OurStory />} />
          <Route path="/catering"  element={<Catering />} />
          <Route path="/contact"   element={<Contact />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <AnimatedRoutes />
      <Footer />
      <ScrollToTopBtn />
    </BrowserRouter>
  );
}
