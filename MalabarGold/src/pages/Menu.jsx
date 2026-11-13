import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Leaf, Flame } from 'lucide-react';
import { Reveal, SectionHeading, GoldBtn } from '../components/UI';

const categories = ['All', 'Biryani', 'Curries', 'Seafood', 'Breads', 'Desserts'];

const menuItems = [
  /* Biryani */
  { id: 1, name: 'Malabar Dum Biryani',       cat: 'Biryani',  price: 420, veg: false, img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80', desc: 'Aromatic basmati rice layered with tender mutton, caramelised onions, saffron & Kerala spices, sealed and slow-cooked for 3 hours in a clay pot. A feast for royalty.' },
  { id: 2, name: 'Thalassery Chicken Biryani', cat: 'Biryani',  price: 350, veg: false, img: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&q=80', desc: 'The jewel of Thalassery — Jeerakasala rice tossed with fried chicken, ghee-fried cashews, raisins and a secret 11-spice blend.' },
  { id: 3, name: 'Vegetable Dum Biryani',       cat: 'Biryani',  price: 280, veg: true,  img: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=80', desc: 'Garden-fresh vegetables, paneer and saffron-infused rice dum-cooked with whole spices. Rich, aromatic and deeply satisfying.' },
  /* Curries */
  { id: 4, name: 'Kerala Prawn Curry',          cat: 'Curries',  price: 480, veg: false, img: 'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=600&q=80', desc: 'Plump Malabar prawns simmered in a luscious coconut-based curry with kudampuli, fresh green chillies, and hand-ground masala.' },
  { id: 5, name: 'Nadan Beef Curry',            cat: 'Curries',  price: 390, veg: false, img: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=600&q=80', desc: 'Slow-braised beef with roasted coconut slivers, black pepper, and an earthy gravy that is the soul of Kerala kitchens.' },
  { id: 6, name: 'Avial',                       cat: 'Curries',  price: 220, veg: true,  img: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&q=80', desc: 'The iconic Kerala mixed-vegetable dish cooked in curd and coconut, finished with curry leaves and coconut oil. Pure and wholesome.' },
  /* Seafood */
  { id: 7,  name: 'Karimeen Pollichathu',       cat: 'Seafood',  price: 550, veg: false, img: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80', desc: 'Pearl spot fish marinated in fiery Kerala masala, wrapped in banana leaf and slow-roasted on charcoal. The crown jewel of Backwater cuisine.' },
  { id: 8,  name: 'Malabar Fish Fry',           cat: 'Seafood',  price: 380, veg: false, img: 'https://images.unsplash.com/photo-1519984388953-d2406bc725e1?w=600&q=80', desc: 'Fresh Seer fish steak marinated in turmeric, red chilli, raw mango paste and pan-fried in coconut oil until golden and crisp.' },
  { id: 9,  name: 'Crab Masala',                cat: 'Seafood',  price: 620, veg: false, img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=80', desc: 'Mud crab cooked in an intensely flavourful onion-tomato masala with whole spices. Best enjoyed with appam.' },
  /* Breads */
  { id: 10, name: 'Malabar Parotta',            cat: 'Breads',   price: 60,  veg: true,  img: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&q=80', desc: 'Flaky, layered flatbread made with all-purpose flour, kneaded for hours and cooked on a tawa with generous ghee.' },
  { id: 11, name: 'Appam',                      cat: 'Breads',   price: 45,  veg: true,  img: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=80', desc: 'Lacy, bowl-shaped rice flour hoppers fermented overnight. Soft at centre, crisp at edges. The perfect companion for any stew.' },
  /* Desserts */
  { id: 12, name: 'Palada Payasam',             cat: 'Desserts', price: 180, veg: true,  img: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&q=80', desc: 'Creamy vermicelli slow-simmered in full-fat milk, sweetened with sugar, flavoured with cardamom, rose water & topped with cashew-raisins.' },
  { id: 13, name: 'Ada Pradhaman',              cat: 'Desserts', price: 160, veg: true,  img: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&q=80', desc: 'Rice flakes cooked in jaggery and coconut milk — the soul of every Kerala Sadya. Rich, dark, and deeply comforting.' },
];

export default function Menu() {
  const [activeTab, setActiveTab] = useState('All');
  const [selected, setSelected]  = useState(null);

  const filtered = activeTab === 'All' ? menuItems : menuItems.filter(m => m.cat === activeTab);

  return (
    <div style={{ background: '#FDF8EE', paddingTop: '80px' }}>
      <section className="py-20 w-full px-5 sm:px-8 lg:px-14 xl:px-20">
        <Reveal>
          <SectionHeading eyebrow="Crafted with Tradition" title="Our Menu" />
        </Reveal>

        {/* Filter tabs */}
        <Reveal delay={0.1}>
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveTab(cat)}
                className="px-5 py-2 rounded-full text-sm font-semibold tracking-wide transition-all duration-300"
                style={{
                  background: activeTab === cat ? 'linear-gradient(135deg, #C9A227, #D4AF37)' : 'transparent',
                  color: activeTab === cat ? '#0B3D2E' : '#1A2B23',
                  border: activeTab === cat ? '1.5px solid #C9A227' : '1.5px solid rgba(201,162,39,0.35)',
                  boxShadow: activeTab === cat ? '0 4px 15px rgba(201,162,39,0.3)' : 'none',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
                onClick={() => setSelected(item)}
                className="card-gold rounded-xl overflow-hidden cursor-pointer group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={item.img} alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-110" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(11,61,46,0.55) 0%, transparent 50%)' }} />
                  {/* Veg / Non-veg */}
                  <span className="absolute top-3 left-3 w-5 h-5 rounded flex items-center justify-center"
                    style={{ border: `1.5px solid ${item.veg ? '#16a34a' : '#dc2626'}`, background: 'rgba(255,255,255,0.9)' }}>
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: item.veg ? '#16a34a' : '#dc2626' }} />
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-serif text-base font-semibold mb-1" style={{ color: '#1A2B23' }}>{item.name}</h3>
                  <p className="text-xs line-clamp-2 leading-relaxed mb-3" style={{ color: '#4A6358' }}>{item.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-lg font-bold gold-text">₹{item.price}</span>
                    <span className="text-xs px-3 py-1 rounded-full font-medium"
                      style={{ background: 'rgba(201,162,39,0.1)', color: '#C9A227', border: '1px solid rgba(201,162,39,0.25)' }}>
                      {item.cat}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* ── Dish Modal ── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(11,61,46,0.85)', backdropFilter: 'blur(8px)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.85, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.85, y: 30 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              className="relative rounded-2xl overflow-hidden max-w-md w-full"
              style={{ background: '#FDF8EE', border: '1.5px solid #C9A227' }}
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setSelected(null)}
                className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(11,61,46,0.7)', color: '#FDF8EE' }}>
                <X size={16} />
              </button>

              <img src={selected.img} alt={selected.name} className="w-full h-56 object-cover" />

              <div className="p-6">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h2 className="font-serif text-2xl font-bold" style={{ color: '#1A2B23' }}>{selected.name}</h2>
                  <span className="flex-shrink-0 font-serif text-xl font-bold gold-text">₹{selected.price}</span>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-4 h-4 rounded flex items-center justify-center"
                    style={{ border: `1.5px solid ${selected.veg ? '#16a34a' : '#dc2626'}`, background: 'white' }}>
                    <span className="w-2 h-2 rounded-full" style={{ background: selected.veg ? '#16a34a' : '#dc2626' }} />
                  </span>
                  <span className="text-xs" style={{ color: '#4A6358' }}>{selected.veg ? 'Vegetarian' : 'Non-Vegetarian'}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full ml-2"
                    style={{ background: 'rgba(201,162,39,0.12)', color: '#C9A227', border: '1px solid rgba(201,162,39,0.25)' }}>
                    {selected.cat}
                  </span>
                </div>
                <p className="text-sm leading-relaxed mb-6" style={{ color: '#4A6358' }}>{selected.desc}</p>
                <GoldBtn className="w-full text-center justify-center" onClick={() => setSelected(null)}>
                  Add to Order — ₹{selected.price}
                </GoldBtn>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
