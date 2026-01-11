import React, { useState, useEffect, useRef } from 'react';
import { generateSalesReply } from './lib/ai';
import emailjs from '@emailjs/browser';

const SUGGESTIONS = [
  "Build a School Management System",
  "Automate my Real Estate leads",
  "How does AI Workflow work?",
  "I need a high-end E-commerce site"
];

// Re-usable Project Card for the Gallery
const ProjectCard = ({ title, desc, tag, icon }: { title: string, desc: string, tag: string, icon: string }) => (
  <div className="group relative bg-white/[0.03] border border-white/10 p-8 rounded-[2rem] overflow-hidden hover:border-emerald-500/50 transition-all duration-500 hover:-translate-y-2">
    <div className="text-4xl mb-4">{icon}</div>
    <span className="text-[10px] uppercase tracking-widest text-emerald-500 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">{tag}</span>
    <h3 className="text-xl font-bold mt-4 mb-2 text-white">{title}</h3>
    <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
  </div>
);

// NEW: Contact Form Component inside the same file
const ContactForm = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState('');

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('SENDING BRIEF...');

    // UPDATED: Using your specific VITE_ placeholders
    emailjs.sendForm(
      import.meta.env.VITE_EMAILJS_SERVICE_ID, 
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID, 
      formRef.current!, 
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    )
      .then(() => {
        setStatus('PROJECT BRIEF SENT SUCCESSFULLY!');
        formRef.current?.reset();
      }, (error) => {
        setStatus('FAILED. PLEASE USE WHATSAPP.');
        console.log(error.text);
      });
  };

  return (
    <section id="contact-form" className="mb-44 relative">
      <div className="flex items-center gap-8 mb-16">
        <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase">Start a Project</h2>
        <div className="h-[1px] flex-1 bg-white/10" />
      </div>

      <div className="relative group">
        <div className="absolute -inset-1 bg-emerald-500/20 blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
        <form ref={formRef} onSubmit={sendEmail} className="relative bg-black/80 border border-white/10 p-10 md:p-16 rounded-[3rem] backdrop-blur-3xl grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest ml-2">Your Name</label>
            <input type="text" name="user_name" required placeholder="John Doe" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-emerald-500 outline-none transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest ml-2">Email Address</label>
            <input type="email" name="user_email" required placeholder="john@company.com" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-emerald-500 outline-none transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest ml-2">Service Required</label>
            <select name="service_type" className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl px-6 py-4 focus:border-emerald-500 outline-none transition-all text-slate-400">
              <option value="AI_Agent">AI Agent Integration</option>
              <option value="Workflow_Automation">Workflow Automation</option>
              <option value="School_Portal">School Management System</option>
              <option value="Ecommerce">E-Commerce System</option>
              <option value="Real_Estate">Real Estate Portal</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest ml-2">Budget Range</label>
            <select name="budget" className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl px-6 py-4 focus:border-emerald-500 outline-none transition-all text-slate-400">
              <option value="200k-500k">200,000 - 500,000 NGN</option>
              <option value="500k-1m">500,000 - 1,000,000 NGN</option>
              <option value="1m+">1,000,000 NGN +</option>
            </select>
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest ml-2">Brief the Project</label>
            <textarea name="message" rows={4} required placeholder="Tell me about the system you want to build..." className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-4 focus:border-emerald-500 outline-none transition-all resize-none"></textarea>
          </div>
          <div className="md:col-span-2 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-[10px] text-slate-500 italic max-w-sm text-center md:text-left">By clicking submit, you agree to the 50% upfront payment policy for project initiation.</p>
            <button type="submit" className="w-full md:w-auto bg-emerald-500 text-black font-black px-12 py-4 rounded-2xl hover:scale-105 transition-all shadow-xl shadow-emerald-500/20 active:scale-95 whitespace-nowrap">
              {status || 'SEND PROJECT BRIEF'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

function App() {
  const [input, setInput] = useState('');
  const [chat, setChat] = useState<{role: string, content: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chat]);

  const handleSend = async (msgOverride?: string) => {
    const text = msgOverride || input;
    if (!text.trim()) return;
    setChat(prev => [...prev, { role: 'user', content: text }]);
    setInput('');
    setLoading(true);
    try {
      const res = await generateSalesReply(text, chat);
      setChat(prev => [...prev, { role: 'assistant', content: res }]);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const openWhatsApp = () => {
    const lastMsg = chat.filter(m => m.role === 'assistant').pop()?.content || "";
    const phone = "2349032650856"; 
    const url = `https://wa.me/${phone}?text=${encodeURIComponent("Ref: AI Consultation\n\n" + lastMsg)}`;
    window.open(url, '_blank');
  };

  const scrollToContact = () => {
    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#020202] text-slate-300 font-sans selection:bg-emerald-500/30">
      
      {/* MASSIVE AMBIENT GLOWS */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[10%] w-[700px] h-[700px] bg-emerald-600/10 blur-[180px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        
        {/* HEADER SECTION */}
        <header className="flex justify-between items-center mb-24 border-b border-white/5 pb-8">
          <div>
            <h1 className="text-3xl font-black text-white italic tracking-tighter">PRINCEWILL<span className="text-emerald-500">.AI</span></h1>
            <p className="text-[10px] text-slate-500 font-bold tracking-[0.3em] uppercase mt-1">Systems & Automation Architect</p>
          </div>
          <div className="flex gap-8 items-center">
            <div className="hidden lg:flex gap-6 text-[10px] font-black tracking-widest text-slate-400">
              <span className="hover:text-emerald-500 cursor-pointer">INSTAGRAM</span>
              <span className="hover:text-emerald-500 cursor-pointer">LINKEDIN</span>
              <a href="https://wa.me/2349032650856" target="_blank" className="hover:text-emerald-500 cursor-pointer">WHATSAPP</a>
            </div>
            <button onClick={scrollToContact} className="bg-white text-black px-8 py-3 rounded-full font-black text-xs hover:bg-emerald-500 transition-all active:scale-95 shadow-lg shadow-white/5 uppercase tracking-widest">Book Consultation</button>
          </div>
        </header>

        {/* HERO + AI TERMINAL SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-44 items-center">
          <div className="lg:col-span-5">
            <div className="inline-block px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black tracking-widest mb-6 uppercase">Available for Hire</div>
            <h2 className="text-8xl font-black text-white leading-[0.8] tracking-tighter mb-8 italic">
              AI <br/> POWERED <br/> <span className="text-emerald-500">GROWTH.</span>
            </h2>
            <p className="text-xl text-slate-400 mb-6 leading-relaxed border-l-2 border-emerald-500/30 pl-6">
              I don't just build websites. I build digital employees. My systems automate your sales, capture your leads, and manage your data 24/7.
            </p>
            {/* HERO WHATSAPP CTA */}
            <a href="https://wa.me/2349032650856" target="_blank" className="inline-flex items-center gap-4 text-emerald-500 font-black text-sm tracking-[0.2em] hover:translate-x-2 transition-transform duration-300 group">
               CHAT DIRECTLY ON WHATSAPP <span className="text-xl group-hover:scale-125 transition-transform">→</span>
            </a>
          </div>

          <div className="lg:col-span-7 relative">
            <div className="absolute -inset-10 bg-emerald-500/20 blur-[100px] rounded-[4rem] -z-10 animate-pulse" />
            
            <div className="flex flex-col h-[700px] bg-black/80 border border-emerald-500/40 rounded-[3rem] overflow-hidden backdrop-blur-3xl shadow-[0_0_80px_-20px_rgba(16,185,129,0.4)]">
              <div className="p-6 border-b border-white/10 bg-emerald-500/5 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-[10px] font-black tracking-widest text-emerald-500 uppercase ml-4">Agent v1.0.4 Online</span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                {chat.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                    <div className="text-5xl mb-4">⚡</div>
                    <p className="font-mono text-xs uppercase tracking-[0.3em]">System Ready. Brief your requirements.</p>
                  </div>
                )}
                {chat.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                    <div className={`max-w-[85%] p-6 rounded-[2rem] shadow-xl ${
                      msg.role === 'user' 
                      ? 'bg-emerald-600 text-white rounded-br-none' 
                      : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none backdrop-blur-md'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {loading && <div className="text-emerald-500 font-mono text-[10px] animate-pulse">SYSTEM_THINKING...</div>}
                <div ref={scrollRef} />
              </div>

              <div className="p-8 border-t border-white/10 bg-black/60 space-y-6">
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                  {SUGGESTIONS.map((s, i) => (
                    <button key={i} onClick={() => handleSend(s)} className="text-[9px] uppercase font-black px-5 py-2.5 rounded-full border border-white/10 hover:border-emerald-500 text-slate-500 hover:text-emerald-400 transition-all bg-white/5">{s}</button>
                  ))}
                </div>
                <div className="flex gap-4">
                  <input value={input} onChange={(e)=>setInput(e.target.value)} onKeyDown={(e)=>e.key==='Enter'&&handleSend()} placeholder="Ask about AI, Websites, or Automations..." className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-emerald-500 transition-all" />
                  <button onClick={()=>handleSend()} className="bg-emerald-500 text-black font-black px-10 rounded-2xl hover:scale-105 transition-transform active:scale-95">SEND</button>
                </div>
                
                {chat.some(m => m.role === 'assistant') && (
                  <button 
                    onClick={openWhatsApp} 
                    className="w-full py-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 text-xs font-black tracking-widest hover:bg-emerald-500 hover:text-black transition-all flex items-center justify-center gap-3 animate-bounce shadow-lg shadow-emerald-500/20"
                  >
                    <span>SECURE THIS QUOTE ON WHATSAPP</span>
                    <span className="text-lg">→</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* PRICING & SERVICES TABLE */}
        <section className="mb-44">
          <div className="mb-16">
            <h2 className="text-4xl font-black text-white italic">SERVICE CATALOG</h2>
            <p className="text-slate-500 mt-2">Transparent pricing for premium digital infrastructure.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "AI Agent Integration", price: "500k+", desc: "Custom trained LLM agents for customer service and automated sales." },
              { title: "Workflow Automation", price: "350k+", desc: "Connecting WhatsApp, CRM, and Sheets to eliminate manual labor." },
              { title: "School Management", price: "800k+", desc: "Complete portal for fees, results, and student data management." },
              { title: "E-Commerce System", price: "450k+", desc: "Full online store with automated inventory and payment tracking." },
              { title: "Real Estate Portal", price: "600k+", desc: "Property listing engines with automated lead routing systems." },
              { title: "Corporate/NGO", price: "250k+", desc: "Professional high-performance sites for brands and foundations." }
            ].map((item, i) => (
              <div key={i} className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-all">
                <h3 className="text-emerald-500 font-black text-sm uppercase tracking-widest mb-2">{item.title}</h3>
                <p className="text-3xl font-bold text-white mb-4 italic">{item.price}</p>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* DEEP EXPLANATIONS */}
        <section className="mb-44 grid grid-cols-1 lg:grid-cols-2 gap-20 bg-emerald-500/[0.02] p-16 rounded-[4rem] border border-white/5">
          <div className="space-y-8">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-2xl">⚡</div>
            <h3 className="text-5xl font-black text-white italic leading-tight">THE POWER OF <br/> AUTOMATION.</h3>
            <p className="text-slate-400 text-lg leading-relaxed">
              Workflow automation isn't just software; it's a <strong>Digital Employee</strong>. Imagine every time a lead chats with you on WhatsApp, their name is saved, a follow-up is scheduled, and an invoice is prepared—instantly. 
              <br/><br/>
              I connect your favorite tools so you can stop doing "admin work" and start growing your business.
            </p>
          </div>
          <div className="space-y-8 border-l border-white/10 lg:pl-20">
            <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center text-2xl">🧠</div>
            <h3 className="text-5xl font-black text-white italic leading-tight">AI FOR <br/> REAL BUSINESS.</h3>
            <p className="text-slate-400 text-lg leading-relaxed">
              We move past simple "Chatbots." I build AI Systems that understand your business logic. 
              <br/><br/>
              Your AI system can analyze your sales data, draft professional emails, and handle complex customer inquiries using the same technology behind ChatGPT, but customized 100% for your brand.
            </p>
          </div>
        </section>

        {/* WORK GALLERY */}
        <section className="mb-44">
          <div className="flex items-center gap-8 mb-16">
            <h2 className="text-5xl font-black text-white italic">PORTFOLIO</h2>
            <div className="h-[1px] flex-1 bg-white/10" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ProjectCard icon="🔍" tag="AI Intelligence" title="AI CV Screening Agent" desc="Custom NLP engine that ranks thousands of applicants based on job context." />
            <ProjectCard icon="🏦" tag="Fintech" title="SecureBank Dashboard" desc="High-security banking UI with real-time transaction tracking and state management." />
            <ProjectCard icon="⚙️" tag="Systems" title="Focus Grid Dashboard" desc="Precision-engineered productivity dashboard for high-load task management." />
            <ProjectCard icon="📚" tag="Content" title="WisdomStack Blog" desc="Minimalist philosophical content engine optimized for performance and SEO." />
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="mb-44 text-center">
          <h2 className="text-5xl font-black text-white mb-20 italic">TESTIMONIALS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { q: "Reduced our customer support response time by 90%.", a: "Lagos Tech Hub" },
              { q: "The School Management system is the best investment we've made.", a: "Lead Academy" },
              { q: "Automated our entire real estate lead funnel perfectly.", a: "Luxe Properties" },
              { q: "Princewill understands the bridge between AI and Business.", a: "Sarah (NGO Director)" },
              { q: "High-quality code and beautiful UI design.", a: "Swift Logistics CEO" },
              { q: "A visionary developer who thinks about ROI.", a: "Fintech Startup Founder" }
            ].map((t, i) => (
              <div key={i} className="p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/5 italic">
                <p className="text-slate-300 text-lg">"{t.q}"</p>
                <p className="mt-6 not-italic font-black text-emerald-500 uppercase tracking-widest text-xs">— {t.a}</p>
              </div>
            ))}
          </div>
        </section>

        <ContactForm />

        {/* FOOTER */}
        <footer className="py-20 border-t border-white/5 text-center">
          <h2 className="text-2xl font-black text-white italic mb-6">PRINCEWILL.AI</h2>
          <p className="text-slate-600 text-xs mb-10 tracking-[0.5em] uppercase">Built for 2026 and Beyond</p>
          <div className="flex justify-center gap-10 text-[10px] font-black tracking-widest text-slate-400">
            <a href="https://wa.me/2349032650856" target="_blank" className="hover:text-emerald-500 transition-colors">WHATSAPP</a>
            <span>LINKEDIN</span>
            <span>TWITTER</span>
            <span>GITHUB</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;