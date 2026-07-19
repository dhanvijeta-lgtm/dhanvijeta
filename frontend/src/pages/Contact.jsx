import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaTelegram, FaWhatsapp } from 'react-icons/fa';
import toast from 'react-hot-toast';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(4, 'Subject must be at least 4 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters')
});

export function Contact() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (data) => {
    // Simulate sending email query
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success('Your message has been dispatched successfully. We will write back soon!');
    reset();
  };

  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      
      {/* HEADER */}
      <section className="text-center space-y-4">
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
          Contact <span className="gradient-gold">Dhan Vijeta</span>
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
          Have queries about course curriculum, checkout issues, or partnerships? Reach out directly and our support team will respond.
        </p>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* CONTACT DETAILS PANEL */}
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-6">
            <h3 className="text-xl font-bold text-white tracking-wide">Direct Channels</h3>
            
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="bg-white/5 p-3 rounded-xl text-finance-gold">
                  <FaEnvelope size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Support Email</h4>
                  <p className="text-xs text-gray-400 mt-0.5">contact@dhanvijeta.com</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="bg-white/5 p-3 rounded-xl text-finance-emerald">
                  <FaWhatsapp size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">WhatsApp Support</h4>
                  <p className="text-xs text-gray-400 mt-0.5">+91 98765 43210 (Mon-Sat, 9AM-6PM)</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="bg-white/5 p-3 rounded-xl text-sky-400">
                  <FaTelegram size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Telegram Helpdesk</h4>
                  <p className="text-xs text-gray-400 mt-0.5">@DhanVijetaSupportBot</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="bg-white/5 p-3 rounded-xl text-finance-rose">
                  <FaMapMarkerAlt size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Registered Office</h4>
                  <p className="text-xs text-gray-400 mt-0.5">14th Floor, Fintech Towers, Financial District, Hyderabad - 500032</p>
                </div>
              </div>
            </div>

          </div>

          {/* MAPS PLACEHOLDER RENDER */}
          <div className="glass-card rounded-2xl overflow-hidden border border-white/5 aspect-video w-full relative flex items-center justify-center bg-finance-navy">
            {/* Visual simulation of premium UI map */}
            <div className="absolute inset-0 bg-[radial-gradient(#1c2541_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
            <div className="text-center p-4 relative z-10 space-y-2">
              <FaMapMarkerAlt size={32} className="text-finance-gold mx-auto animate-float-slow" />
              <h4 className="text-sm font-bold text-white">Financial District Core Map</h4>
              <p className="text-[10px] text-gray-500 max-w-[280px]">Google Maps integration placeholder. Click link below to open directions.</p>
              <a 
                href="https://maps.google.com" 
                target="_blank" 
                rel="noreferrer"
                className="inline-block bg-finance-gold hover:bg-yellow-400 text-finance-dark text-xs font-bold px-4 py-1.5 rounded-lg transition"
              >
                Open in Maps
              </a>
            </div>
          </div>

        </div>

        {/* INPUT CONTACT FORM */}
        <div className="glass-card rounded-2xl p-8 border border-white/5 shadow-emerald-glow">
          <h3 className="text-xl font-bold text-white mb-6">Drop Us a Message</h3>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-finance-gold transition"
                {...register('name')}
              />
              {errors.name && <span className="text-red-500 text-xs mt-1 block">{errors.name.message}</span>}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email Address</label>
              <input
                type="email"
                placeholder="name@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-finance-gold transition"
                {...register('email')}
              />
              {errors.email && <span className="text-red-500 text-xs mt-1 block">{errors.email.message}</span>}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Subject</label>
              <input
                type="text"
                placeholder="Course Checkout Inquiry"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-finance-gold transition"
                {...register('subject')}
              />
              {errors.subject && <span className="text-red-500 text-xs mt-1 block">{errors.subject.message}</span>}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Message Description</label>
              <textarea
                rows="4"
                placeholder="Please write details about your query..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-finance-gold transition resize-none"
                {...register('message')}
              ></textarea>
              {errors.message && <span className="text-red-500 text-xs mt-1 block">{errors.message.message}</span>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-finance-dark font-extrabold py-3.5 rounded-xl transition shadow-gold-glow mt-2 disabled:opacity-50"
            >
              {isSubmitting ? 'Sending Request...' : 'Submit Message'}
            </button>
          </form>

        </div>

      </section>

    </div>
  );
}

export default Contact;
