import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Clock, CheckCircle } from 'lucide-react';
import { Reveal, GoldBtn } from '../components/UI';

const initForm = { name: '', phone: '', date: '', guests: '', message: '' };

export default function Contact() {
  const [form, setForm]       = useState(initForm);
  const [errors, setErrors]   = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = 'Please enter your name.';
    if (!form.phone.trim())   e.phone   = 'Phone number is required.';
    if (!form.date)           e.date    = 'Please select a date.';
    if (!form.guests.trim())  e.guests  = 'Number of guests is required.';
    return e;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    setTimeout(() => { setLoading(false); setSuccess(true); setForm(initForm); }, 1800);
  };

  const field = (name, label, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-xs uppercase tracking-widest font-medium mb-2"
        style={{ color: 'rgba(201,162,39,0.75)' }}>
        {label}
      </label>
      <input
        type={type}
        value={form[name]}
        onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
        placeholder={placeholder}
        className="form-input"
        min={type === 'date' ? new Date().toISOString().split('T')[0] : undefined}
      />
      {errors[name] && <p className="text-xs mt-1" style={{ color: '#f87171' }}>{errors[name]}</p>}
    </div>
  );

  return (
    <div style={{ paddingTop: '80px' }}>

      {/* Hero */}
      <section className="py-24 text-center" style={{ background: '#0B3D2E' }}>
        <Reveal>
          <p className="text-xs uppercase tracking-[0.4em] mb-4 gold-text">Get in Touch</p>
          <h1 className="font-serif text-5xl sm:text-6xl font-bold" style={{ color: '#FDF8EE' }}>
            Reserve Your Table
          </h1>
          <div className="gold-divider mt-5" />
        </Reveal>
      </section>

      {/* Content */}
      <section className="py-20 w-full px-5 sm:px-8 lg:px-14 xl:px-20"
        style={{ background: '#0B3D2E' }}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-14 max-w-6xl mx-auto">

          {/* Info panel */}
          <div className="lg:col-span-2">
            <Reveal>
              <h2 className="font-serif text-3xl font-bold mb-5 gold-text">Visit Us</h2>
              <div className="h-px mb-8" style={{ background: 'rgba(201,162,39,0.2)' }} />

              <div className="space-y-6">
                {[
                  { Icon: MapPin, title: 'Address',  body: 'Beach Road, Kozhikode\nKerala 673001, India' },
                  { Icon: Phone,  title: 'Phone',    body: '+91 98765 43210\n+91 94321 09876' },
                  { Icon: Clock,  title: 'Hours',    body: 'Monday – Sunday\n12:00 PM – 11:00 PM' },
                ].map(({ Icon, title, body }) => (
                  <div key={title} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(201,162,39,0.1)', border: '1px solid rgba(201,162,39,0.3)' }}>
                      <Icon size={16} style={{ color: '#C9A227' }} />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest mb-1" style={{ color: 'rgba(201,162,39,0.6)' }}>{title}</p>
                      <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'rgba(253,248,238,0.8)' }}>{body}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 p-5 rounded-xl"
                style={{ border: '1px solid rgba(201,162,39,0.2)', background: 'rgba(201,162,39,0.05)' }}>
                <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'rgba(201,162,39,0.6)' }}>Private Dining</p>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(253,248,238,0.6)' }}>
                  We offer an exclusive private dining room "The Malabar Suite" for 10–30 guests — perfect for corporate dinners and intimate celebrations.
                </p>
              </div>
            </Reveal>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <Reveal delay={0.15}>
              <div className="rounded-2xl p-8"
                style={{ background: 'rgba(253,248,238,0.04)', border: '1px solid rgba(201,162,39,0.2)' }}>
                <AnimatePresence mode="wait">
                  {success ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-12"
                    >
                      <motion.div
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                        className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                        style={{ background: 'rgba(201,162,39,0.15)', border: '2px solid #C9A227' }}
                      >
                        <CheckCircle size={36} style={{ color: '#C9A227' }} />
                      </motion.div>
                      <h3 className="font-serif text-2xl font-bold mb-3" style={{ color: '#FDF8EE' }}>
                        Reservation Received!
                      </h3>
                      <p className="text-sm mb-8" style={{ color: 'rgba(253,248,238,0.6)' }}>
                        Thank you for choosing Malabar Gold. We will confirm your reservation within 2 hours via phone. We look forward to welcoming you.
                      </p>
                      <GoldBtn onClick={() => setSuccess(false)}>Make Another Reservation</GoldBtn>
                    </motion.div>
                  ) : (
                    <motion.form key="form" onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {field('name', 'Your Name', 'text', 'Rahul Menon')}
                        {field('phone', 'Phone Number', 'tel', '+91 98765 43210')}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {field('date', 'Preferred Date', 'date')}
                        {field('guests', 'Number of Guests', 'number', '4')}
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-widest font-medium mb-2"
                          style={{ color: 'rgba(201,162,39,0.75)' }}>
                          Special Requests
                        </label>
                        <textarea
                          rows={4}
                          value={form.message}
                          onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                          placeholder="Dietary restrictions, occasion, special arrangements..."
                          className="form-input resize-none"
                        />
                      </div>

                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        disabled={loading}
                        className="w-full py-4 rounded text-sm font-semibold tracking-wide gold-glow transition-all duration-300 flex items-center justify-center gap-2"
                        style={{ background: 'linear-gradient(135deg, #C9A227, #D4AF37)', color: '#0B3D2E' }}
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                            Submitting...
                          </>
                        ) : 'Confirm Reservation ✦'}
                      </motion.button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Map placeholder */}
      <div className="h-72 relative overflow-hidden" style={{ background: '#0E4F3A' }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPin size={40} style={{ color: '#C9A227' }} className="mx-auto mb-3" />
            <p className="font-serif text-lg" style={{ color: '#FDF8EE' }}>Beach Road, Kozhikode</p>
            <p className="text-xs mt-1" style={{ color: 'rgba(201,162,39,0.6)' }}>Kerala, India</p>
          </div>
        </div>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(201,162,39,0.4) 1px, transparent 0)', backgroundSize: '32px 32px' }} />
      </div>
    </div>
  );
}
