import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Leaf, ChevronLeft, ChevronRight, Award, Clock, Users } from 'lucide-react';
import { Reveal, SectionHeading, GoldBtn } from '../components/UI';

/* ── DATA ── */
const dishes = [
  {
    name: 'Malabar Dum Biryani',
    img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80',
    desc: 'Fragrant basmati rice slow-cooked with tender meat, rose water & saffron in the age-old dum tradition.',
    tag: 'Signature',
  },
  {
    name: 'Karimeen Pollichathu',
    img: 'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=600&q=80',
    desc: 'Pearl spot fish marinated in Kerala masala, wrapped in banana leaf, slow-roasted to perfection.',
    tag: 'Seafood',
  },
  {
    name: 'Kerala Sadya',
    img: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&q=80',
    desc: 'A grand feast of 26 vegetarian delights served on a fresh banana leaf — the pride of Kerala.',
    tag: 'Festive',
  },
  {
    name: 'Palada Payasam',
    img: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&q=80',
    desc: 'Creamy vermicelli payasam slow-simmered in full-fat milk with cardamom & rose water. Pure bliss.',
    tag: 'Dessert',
  },
];

const testimonials = [
  { name: 'Priya Nair',    role: 'Food Critic, The Hindu',   quote: 'Malabar Gold transports you to the grandeur of a Kerala royal kitchen. Every dish is a masterpiece of flavour and presentation.', stars: 5 },
  { name: 'Rahul Menon',   role: 'Travel Blogger',           quote: 'I have eaten across Kerala for 15 years — no Biryani comes close to what Malabar Gold serves. Absolutely transcendent.', stars: 5 },
  { name: 'Anjali Thomas', role: 'Wedding Planner, Kochi',   quote: 'We booked their catering for 500 guests. Every single person came to compliment the food. Five stars does not do it justice.', stars: 5 },
];

const features = [
  { icon: Award, title: 'Royal Heritage Recipes', desc: 'Our recipes trace back 200 years to the royal kitchens of Malabar, preserved and perfected through generations of master chefs.' },
  { icon: Leaf,  title: 'Farm-to-Table Fresh',    desc: 'We source spices directly from certified Malabar farms and hand-pick coconuts, curry leaves, and produce daily at dawn.' },
  { icon: Clock, title: 'Slow-Cooked Perfection', desc: 'No shortcuts. Every biryani is dum-sealed for 3 hours. Every curry is simmered until the oil separates — a mark of mastery.' },
];

const particles = Array.from({ length: 12 }, (_, i) => ({
  left: `${8 + i * 7.5}%`,
  top: `${60 + Math.sin(i) * 25}%`,
  size: 4 + (i % 3) * 2,
  dur: `${5 + (i % 4)}s`,
  delay: `${i * 0.4}s`,
}));

export default function Home() {
  const [testIdx, setTestIdx] = useState(0);

  /* Auto-advance testimonials */
  React.useEffect(() => {
    const t = setInterval(() => setTestIdx(i => (i + 1) % testimonials.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ background: '#FDF8EE' }}>

      {/* ═══════════════════════════════════
          1. HERO
      ═══════════════════════════════════ */}
      <section
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0B3D2E 0%, #0E4F3A 60%, #165C43 100%)' }}
      >
        {/* Noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }} />

        {/* Gold floating particles */}
        {particles.map((p, i) => (
          <div key={i} className="absolute rounded-full particle pointer-events-none"
            style={{
              left: p.left, top: p.top,
              width: p.size, height: p.size,
              background: `rgba(201,162,39,${0.3 + (i % 3) * 0.2})`,
              '--dur': p.dur, '--delay': p.delay,
              filter: 'blur(0.5px)',
            }}
          />
        ))}

        <div className="relative z-10 w-full px-5 sm:px-8 lg:px-14 xl:px-20 pt-28 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* LEFT: Text */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                <span className="inline-block text-xs uppercase tracking-[0.4em] font-medium mb-5 px-4 py-1.5 rounded-full"
                  style={{ color: '#C9A227', border: '1px solid rgba(201,162,39,0.35)', background: 'rgba(201,162,39,0.08)' }}>
                  ✦ Since 1892 — Kozhikode, Kerala ✦
                </span>
              </motion.div>

              <motion.h1
                className="font-serif text-5xl sm:text-6xl xl:text-7xl font-bold leading-[1.05] mb-6"
                style={{ color: '#FDF8EE' }}
                initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.25 }}
              >
                The Kerala<br />
                <span className="gold-text">Feast</span>
              </motion.h1>

              <motion.p
                className="text-lg leading-relaxed mb-8 max-w-lg"
                style={{ color: 'rgba(253,248,238,0.72)' }}
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                Step into the grandeur of Malabar's royal kitchens. Every dish carries the soul of Kerala — spiced with tradition, crafted with love, served with timeless elegance.
              </motion.p>

              <motion.div
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.55 }}
              >
                <Link to="/menu">
                  <GoldBtn>Explore Menu</GoldBtn>
                </Link>
                <Link to="/catering">
                  <GoldBtn outline>View Catering</GoldBtn>
                </Link>
              </motion.div>

              {/* Stats row */}
              <motion.div
                className="flex flex-wrap gap-8 mt-12 pt-8"
                style={{ borderTop: '1px solid rgba(201,162,39,0.18)' }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.75 }}
              >
                {[{ n: '130+', label: 'Years of Legacy' }, { n: '50K+', label: 'Happy Guests' }, { n: '26',   label: 'Sadya Courses' }].map(({ n, label }) => (
                  <div key={label}>
                    <p className="font-serif text-3xl font-bold gold-text">{n}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(253,248,238,0.5)' }}>{label}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* RIGHT: Food image with Ken Burns */}
            <motion.div
              className="relative hidden lg:block"
              initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.3 }}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl"
                style={{ border: '2px solid rgba(201,162,39,0.35)', aspectRatio: '4/3' }}>
                <img
                  src="https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=900&q=85"
                  alt="Kerala Sadya on banana leaf"
                  className="w-full h-full object-cover ken-burns"
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(11,61,46,0.5) 0%, transparent 60%)' }} />
                {/* Floating label */}
                <div className="absolute bottom-5 left-5 px-4 py-2 rounded-lg backdrop-blur-sm"
                  style={{ background: 'rgba(11,61,46,0.75)', border: '1px solid rgba(201,162,39,0.35)' }}>
                  <p className="text-xs" style={{ color: '#C9A227' }}>✦ Kerala Sadya</p>
                  <p className="text-sm font-semibold" style={{ color: '#FDF8EE' }}>26 Vegetarian Delights</p>
                </div>
              </div>
              {/* Decorative corner */}
              <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full"
                style={{ border: '1px solid rgba(201,162,39,0.25)', background: 'rgba(201,162,39,0.05)' }} />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full"
                style={{ border: '1px solid rgba(201,162,39,0.15)', background: 'rgba(201,162,39,0.04)' }} />
            </motion.div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, #FDF8EE)' }} />
      </section>

      {/* ═══════════════════════════════════
          2. MARQUEE STRIP
      ═══════════════════════════════════ */}
      <div className="py-4 overflow-hidden" style={{ background: '#0B3D2E', borderTop: '1px solid rgba(201,162,39,0.25)', borderBottom: '1px solid rgba(201,162,39,0.25)' }}>
        <div className="flex">
          <div className="marquee-track">
            {Array(8).fill(['Premium', 'Handcrafted', 'Traditional', 'Freshly Prepared', 'Malabar Spices', 'Royal Heritage', 'Farm-to-Table', '130 Years of Legacy']).flat().map((txt, i) => (
              <span key={i} className="text-sm font-medium tracking-widest uppercase flex items-center gap-6"
                style={{ color: '#C9A227' }}>
                {txt} <span style={{ color: 'rgba(201,162,39,0.4)' }}>✦</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════
          3. SIGNATURE DISHES
      ═══════════════════════════════════ */}
      <section className="py-24 w-full px-5 sm:px-8 lg:px-14 xl:px-20">
        <Reveal>
          <SectionHeading eyebrow="From Our Kitchen" title="Signature Creations" />
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
          {dishes.map((d, i) => (
            <Reveal key={d.name} delay={i * 0.1}>
              <div className="card-gold rounded-xl overflow-hidden group cursor-pointer">
                <div className="relative h-52 overflow-hidden">
                  <img src={d.img} alt={d.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(11,61,46,0.6) 0%, transparent 55%)' }} />
                  <span className="absolute top-3 right-3 text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full font-semibold"
                    style={{ background: 'rgba(201,162,39,0.9)', color: '#0B3D2E' }}>
                    {d.tag}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-lg font-semibold mb-2" style={{ color: '#1A2B23' }}>{d.name}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#4A6358' }}>{d.desc}</p>
                  <div className="mt-4 flex items-center gap-1.5" style={{ color: '#C9A227' }}>
                    <span className="text-xs font-semibold tracking-wide">View Details</span>
                    <span className="text-sm">→</span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3}>
          <div className="text-center mt-12">
            <Link to="/menu"><GoldBtn>View Full Menu</GoldBtn></Link>
          </div>
        </Reveal>
      </section>

      {/* ═══════════════════════════════════
          4. WHY US
      ═══════════════════════════════════ */}
      <section className="py-24 w-full px-5 sm:px-8 lg:px-14 xl:px-20"
        style={{ background: '#0B3D2E' }}>
        <Reveal>
          <SectionHeading eyebrow="Our Promise" title="Why Malabar Gold" light />
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <Reveal key={title} delay={i * 0.15}>
              <div className="text-center p-8 rounded-xl transition-all duration-400"
                style={{ border: '1px solid rgba(201,162,39,0.18)', background: 'rgba(253,248,238,0.03)' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(201,162,39,0.5)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(201,162,39,0.18)'}
              >
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{ background: 'rgba(201,162,39,0.1)', border: '1px solid rgba(201,162,39,0.3)' }}>
                  <Icon size={22} style={{ color: '#C9A227' }} />
                </div>
                <h3 className="font-serif text-xl font-semibold mb-3 gold-text">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(253,248,238,0.6)' }}>{desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════
          5. TESTIMONIALS
      ═══════════════════════════════════ */}
      <section className="py-24 w-full px-5 sm:px-8 lg:px-14 xl:px-20">
        <Reveal>
          <SectionHeading eyebrow="Guest Voices" title="What Our Guests Say" />
        </Reveal>

        <div className="max-w-3xl mx-auto">
          <div className="relative min-h-[200px]">
            {testimonials.map((t, i) => (
              <motion.div key={i}
                animate={{ opacity: i === testIdx ? 1 : 0, y: i === testIdx ? 0 : 20 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex flex-col items-center text-center"
                style={{ pointerEvents: i === testIdx ? 'auto' : 'none' }}
              >
                <div className="flex gap-1 mb-5">
                  {Array(t.stars).fill(0).map((_, j) => (
                    <Star key={j} size={16} fill="#C9A227" color="#C9A227" />
                  ))}
                </div>
                <p className="font-serif text-xl sm:text-2xl italic leading-relaxed mb-7"
                  style={{ color: '#1A2B23' }}>
                  "{t.quote}"
                </p>
                <div className="gold-divider mb-5" />
                <p className="font-semibold text-sm" style={{ color: '#1A2B23' }}>{t.name}</p>
                <p className="text-xs mt-1" style={{ color: '#4A6358' }}>{t.role}</p>
              </motion.div>
            ))}
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-56 sm:mt-48">
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => setTestIdx(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === testIdx ? 24 : 8,
                  height: 8,
                  background: i === testIdx ? '#C9A227' : 'rgba(201,162,39,0.25)',
                }}
              />
            ))}
          </div>

          {/* Arrows */}
          <div className="flex justify-center gap-4 mt-6">
            <button onClick={() => setTestIdx(i => (i - 1 + testimonials.length) % testimonials.length)}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
              style={{ border: '1px solid rgba(201,162,39,0.35)', color: '#C9A227' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,162,39,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => setTestIdx(i => (i + 1) % testimonials.length)}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
              style={{ border: '1px solid rgba(201,162,39,0.35)', color: '#C9A227' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,162,39,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          6. CTA BANNER
      ═══════════════════════════════════ */}
      <section className="py-20 w-full px-5 sm:px-8 lg:px-14 xl:px-20"
        style={{ background: '#0B3D2E' }}>
        <Reveal>
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.4em] mb-4 gold-text">Your Table Awaits</p>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold mb-5" style={{ color: '#FDF8EE' }}>
              Experience the Feast
            </h2>
            <p className="text-base mb-8 max-w-md mx-auto" style={{ color: 'rgba(253,248,238,0.6)' }}>
              Reserve your table today and embark on a culinary journey through the flavours of royal Kerala.
            </p>
            <Link to="/contact"><GoldBtn>Reserve Your Table</GoldBtn></Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
