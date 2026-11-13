import React from 'react';
import { motion } from 'framer-motion';
import { Reveal, SectionHeading } from '../components/UI';

const timeline = [
  {
    year: '1892',
    title: 'The Founding',
    desc: 'Haji Muhammed Koya opened a small toddy shop-turned-eatery near the Kozhikode beach, famous for his legendary fish curry and parotta. Word spread across the spice markets like monsoon rain.',
    img: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=600&q=80',
    side: 'left',
  },
  {
    year: '1935',
    title: 'The Malabar Kitchen',
    desc: 'His son, Ibrahim Koya, formalised the recipes, documenting 86 family dishes in handwritten Urdu manuscripts. The restaurant moved to a heritage bungalow and began serving the British Raj officers.',
    img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80',
    side: 'right',
  },
  {
    year: '1972',
    title: 'The Sadya Tradition',
    desc: 'The third generation introduced the grand 26-course Kerala Sadya, drawing guests from Trivandrum to Madras. The banana leaf feast became a Sunday ritual for thousands of families.',
    img: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&q=80',
    side: 'left',
  },
  {
    year: '2008',
    title: 'National Recognition',
    desc: 'Malabar Gold was awarded "India\'s Best Traditional Restaurant" by the National Culinary Federation. Chef Zainul Koya represented Kerala at the World Street Food Congress in Singapore.',
    img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80',
    side: 'right',
  },
  {
    year: '2026',
    title: 'A Living Legacy',
    desc: 'Today, the fifth generation carries forward the flame. With the same handwritten recipes, the same Malabar spices, and an unwavering commitment — every plate is a letter to our ancestors.',
    img: 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=600&q=80',
    side: 'left',
  },
];

export default function OurStory() {
  return (
    <div style={{ background: '#FDF8EE', paddingTop: '80px' }}>

      {/* Hero */}
      <section className="relative py-28 overflow-hidden" style={{ background: '#0B3D2E' }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=60)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="relative z-10 text-center w-full px-5 sm:px-8 lg:px-14 xl:px-20">
          <motion.p
            className="text-xs uppercase tracking-[0.4em] mb-4 gold-text"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          >
            Our Heritage
          </motion.p>
          <motion.h1
            className="font-serif text-5xl sm:text-6xl font-bold mb-5"
            style={{ color: '#FDF8EE' }}
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }}
          >
            A Story of Spice & Soul
          </motion.h1>
          <div className="gold-divider" />
          <motion.p
            className="mt-6 max-w-xl mx-auto text-base leading-relaxed"
            style={{ color: 'rgba(253,248,238,0.65)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.35 }}
          >
            For 130 years, the Koya family has been the keeper of Kerala's most treasured culinary secrets. This is our story.
          </motion.p>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 w-full px-5 sm:px-8 lg:px-14 xl:px-20">
        <div className="relative">
          {/* Center line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px hidden lg:block"
            style={{ background: 'linear-gradient(to bottom, transparent, #C9A227 10%, #C9A227 90%, transparent)', transform: 'translateX(-50%)' }} />

          <div className="space-y-20">
            {timeline.map((item, i) => (
              <Reveal key={item.year} delay={0.1}>
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center ${item.side === 'right' ? 'lg:flex-row-reverse' : ''}`}>

                  {/* Text */}
                  <div className={`${item.side === 'right' ? 'lg:order-2 lg:pl-16' : 'lg:pr-16 lg:text-right'}`}>
                    <span className="inline-block font-serif text-5xl font-bold gold-text mb-2">{item.year}</span>
                    <h3 className="font-serif text-2xl font-semibold mb-4" style={{ color: '#1A2B23' }}>{item.title}</h3>
                    <div className={`gold-divider mb-4 ${item.side === 'left' ? 'lg:ml-auto' : ''}`} style={{ margin: item.side === 'left' ? undefined : '0 auto 1rem 0' }} />
                    <p className="text-sm leading-relaxed" style={{ color: '#4A6358' }}>{item.desc}</p>
                  </div>

                  {/* Image */}
                  <div className={`relative ${item.side === 'right' ? 'lg:order-1' : ''}`}>
                    <div className="rounded-2xl overflow-hidden" style={{ border: '1.5px solid #E8D5A3', aspectRatio: '16/10' }}>
                      <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    {/* Year badge */}
                    <div className="absolute -top-4 -right-4 w-14 h-14 rounded-full flex items-center justify-center font-serif text-sm font-bold"
                      style={{ background: 'linear-gradient(135deg, #C9A227, #D4AF37)', color: '#0B3D2E' }}>
                      {item.year.slice(2)}
                    </div>
                  </div>

                  {/* Center dot */}
                  <div className="hidden lg:flex absolute left-1/2 w-5 h-5 rounded-full items-center justify-center"
                    style={{ background: '#0B3D2E', border: '2px solid #C9A227', transform: 'translateX(-50%)' }}>
                    <div className="w-2 h-2 rounded-full" style={{ background: '#C9A227' }} />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 w-full px-5 sm:px-8 lg:px-14 xl:px-20" style={{ background: '#0B3D2E' }}>
        <Reveal>
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs uppercase tracking-[0.4em] mb-4 gold-text">Our Creed</p>
            <h2 className="font-serif text-4xl font-bold mb-6" style={{ color: '#FDF8EE' }}>
              "We do not cook food.<br />We preserve memories."
            </h2>
            <div className="gold-divider mb-6" />
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(253,248,238,0.6)' }}>
              — Chef Zainul Koya, 5th generation, Malabar Gold
            </p>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
