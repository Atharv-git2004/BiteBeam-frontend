import React from 'react';
import { motion } from 'framer-motion';

/* Reusable scroll-reveal wrapper */
export function Reveal({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.65, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* Section heading with gold underline */
export function SectionHeading({ eyebrow, title, light = false }) {
  return (
    <div className="text-center mb-14">
      {eyebrow && (
        <p className="text-xs uppercase tracking-[0.35em] font-medium mb-3 gold-text">{eyebrow}</p>
      )}
      <h2
        className="font-serif text-4xl sm:text-5xl font-bold leading-tight"
        style={{ color: light ? '#FDF8EE' : '#1A2B23' }}
      >
        {title}
      </h2>
      <div className="gold-divider mt-5" />
    </div>
  );
}

/* Gold button */
export function GoldBtn({ children, onClick, outline = false, className = '' }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`px-8 py-3.5 rounded text-sm font-semibold tracking-wide transition-all duration-300 gold-glow ${className}`}
      style={outline
        ? { border: '1.5px solid #C9A227', color: '#FDF8EE', background: 'transparent' }
        : { background: 'linear-gradient(135deg, #C9A227, #D4AF37)', color: '#0B3D2E' }
      }
    >
      {children}
    </motion.button>
  );
}
