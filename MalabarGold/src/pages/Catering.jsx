import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Star } from 'lucide-react';
import { Reveal, SectionHeading, GoldBtn } from '../components/UI';

const plans = [
  {
    name: 'The Kerala Gathering',
    subtitle: 'Perfect for intimate celebrations',
    price: '₹850',
    unit: 'per person',
    minGuests: '50 guests minimum',
    popular: false,
    features: [
      'Full Kerala Sadya on banana leaf',
      'Malabar Biryani station',
      '3 curry selections',
      'Payasam & dessert counter',
      'Dedicated service staff',
      'Setup & cleanup included',
    ],
  },
  {
    name: 'The Grand Malabar',
    subtitle: 'Our most popular celebration package',
    price: '₹1,350',
    unit: 'per person',
    minGuests: '100 guests minimum',
    popular: true,
    features: [
      'Everything in Kerala Gathering',
      'Live Biryani Dum cooking station',
      'Seafood counter — 4 items',
      '5 curry selections',
      'Welcome drinks & mocktails',
      'Premium tableware & decor',
      'Head chef on-site supervision',
      'Photography-friendly setup',
    ],
  },
  {
    name: 'The Royal Feast',
    subtitle: 'An unmatched royal experience',
    price: '₹2,200',
    unit: 'per person',
    minGuests: '200 guests minimum',
    popular: false,
    features: [
      'Everything in Grand Malabar',
      'Full customised 7-course menu',
      'Dedicated sous chef team',
      'Live cooking theatre',
      'Premium floral & brass decor',
      'Personalised menu cards',
      'Post-event feedback & follow-up',
      'VIP pre-tasting session',
    ],
  },
];

const occasions = [
  { emoji: '💍', label: 'Weddings' },
  { emoji: '🎂', label: 'Birthdays' },
  { emoji: '🏢', label: 'Corporate' },
  { emoji: '🙏', label: 'Festivals' },
  { emoji: '🎓', label: 'Graduations' },
  { emoji: '🫂', label: 'Reunions' },
];

export default function Catering() {
  return (
    <div style={{ background: '#FDF8EE', paddingTop: '80px' }}>

      {/* Hero */}
      <section className="py-24 text-center" style={{ background: '#0B3D2E' }}>
        <Reveal>
          <p className="text-xs uppercase tracking-[0.4em] mb-4 gold-text">Catering & Events</p>
          <h1 className="font-serif text-5xl sm:text-6xl font-bold mb-5" style={{ color: '#FDF8EE' }}>
            Celebrate with<br /><span className="gold-text">Malabar Gold</span>
          </h1>
          <div className="gold-divider mb-6" />
          <p className="max-w-xl mx-auto px-6 text-base leading-relaxed" style={{ color: 'rgba(253,248,238,0.65)' }}>
            From intimate family gatherings to grand weddings of 1,000+ guests — we bring the full grandeur of Kerala's culinary heritage to your celebration.
          </p>
        </Reveal>
      </section>

      {/* Occasions */}
      <section className="py-14 w-full px-5 sm:px-8 lg:px-14 xl:px-20">
        <Reveal>
          <div className="flex flex-wrap justify-center gap-5">
            {occasions.map(({ emoji, label }) => (
              <div key={label} className="flex flex-col items-center gap-2 px-6 py-4 rounded-xl transition-all duration-300 cursor-default"
                style={{ border: '1px solid rgba(201,162,39,0.25)', background: 'white' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#C9A227'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(201,162,39,0.25)'; e.currentTarget.style.transform = 'none'; }}
              >
                <span className="text-3xl">{emoji}</span>
                <span className="text-sm font-semibold" style={{ color: '#1A2B23' }}>{label}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Pricing cards */}
      <section className="py-20 w-full px-5 sm:px-8 lg:px-14 xl:px-20">
        <Reveal>
          <SectionHeading eyebrow="Catering Packages" title="Choose Your Feast" />
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {plans.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 0.12}>
              <motion.div
                whileHover={{ y: plan.popular ? -4 : -6 }}
                className="relative rounded-2xl overflow-hidden transition-all duration-300"
                style={{
                  background: plan.popular ? '#0B3D2E' : '#FFFFFF',
                  border: plan.popular ? '2px solid #C9A227' : '1.5px solid #E8D5A3',
                  boxShadow: plan.popular ? '0 20px 50px rgba(11,61,46,0.25), 0 0 0 1px rgba(201,162,39,0.3)' : '0 4px 20px rgba(0,0,0,0.06)',
                }}
              >
                {plan.popular && (
                  <div className="text-center py-2 text-xs font-bold uppercase tracking-widest"
                    style={{ background: 'linear-gradient(135deg, #C9A227, #D4AF37)', color: '#0B3D2E' }}>
                    ✦ Most Popular ✦
                  </div>
                )}

                <div className="p-7">
                  <h3 className="font-serif text-xl font-bold mb-1"
                    style={{ color: plan.popular ? '#FDF8EE' : '#1A2B23' }}>
                    {plan.name}
                  </h3>
                  <p className="text-xs mb-6"
                    style={{ color: plan.popular ? 'rgba(253,248,238,0.55)' : '#4A6358' }}>
                    {plan.subtitle}
                  </p>

                  <div className="mb-2">
                    <span className="font-serif text-4xl font-bold gold-text">{plan.price}</span>
                    <span className="text-xs ml-2" style={{ color: plan.popular ? 'rgba(253,248,238,0.5)' : '#4A6358' }}>
                      {plan.unit}
                    </span>
                  </div>
                  <p className="text-xs mb-6" style={{ color: plan.popular ? 'rgba(201,162,39,0.6)' : 'rgba(201,162,39,0.8)' }}>
                    {plan.minGuests}
                  </p>

                  <div className="h-px mb-6"
                    style={{ background: plan.popular ? 'rgba(201,162,39,0.25)' : 'rgba(201,162,39,0.15)' }} />

                  <ul className="space-y-3 mb-8">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-start gap-2.5 text-sm"
                        style={{ color: plan.popular ? 'rgba(253,248,238,0.78)' : '#4A6358' }}>
                        <Check size={15} className="mt-0.5 flex-shrink-0" style={{ color: '#C9A227' }} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link to="/contact">
                    <GoldBtn outline={!plan.popular} className="w-full text-center justify-center block">
                      Get a Quote
                    </GoldBtn>
                  </Link>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Gallery strip */}
      <section className="pb-16 w-full px-5 sm:px-8 lg:px-14 xl:px-20 overflow-hidden">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.35em] text-center mb-8 gold-text">From Our Events</p>
        </Reveal>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=75',
            'https://images.unsplash.com/photo-1555244162-803834f70033?w=400&q=75',
            'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=75',
            'https://images.unsplash.com/photo-1543353071-087092ec393a?w=400&q=75',
          ].map((src, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #E8D5A3', aspectRatio: '1' }}>
                <img src={src} alt="Event" className="w-full h-full object-cover transition-transform duration-500 hover:scale-108" />
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
