import React, { useState, useEffect, useRef } from 'react';
import { generateSalesReply } from './lib/ai';
import emailjs from '@emailjs/browser';
import logo from './assets/princewill-ai.png';

const SUGGESTIONS = [
  "Automate my WhatsApp sales",
  "Build a School Management System",
  "AI for Real Estate leads",
  "I need a high-end E-commerce site"
];

const ProjectCard = ({ title, desc, tag, icon }: { title: string, desc: string, tag: string, icon: string }) => (
  <div className="group relative bg-white/[0.03] border border-white/10 p-6 md:p-8 rounded-[2rem] overflow-hidden hover:border-emerald-500/50 transition-all duration-500 hover:-translate-y-2">
    <div className="text-3xl md:text-4xl mb-4">{icon}</div>
    <span className="text-[10px] uppercase tracking-widest text-emerald-500 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">{tag}</span>
    <h3 className="text-xl font-bold mt-4 mb-2 text-white">{title}</h3>
    <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
  </div>
);

const ContactForm = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState('');

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('SENDING BRIEF...');
    emailjs.sendForm(
      import.meta.env.VITE_EMAILJS_SERVICE_ID, 
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID, 
      formRef.current!, 
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    ).then(() => {
      setStatus('PROJECT BRIEF SENT SUCCESSFULLY!');
      formRef.current?.reset();
    }, (error) => {
      setStatus('FAILED. PLEASE USE WHATSAPP.');
      console.log(error.text);
    });
  };

  return (
    <section id="contact-form" className="mb-24 md:mb-44 relative">
      <div className="flex items-center gap-4 md:gap-8 mb-12 md:mb-16">
        <h2 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter uppercase shrink-0">Start a Project</h2>
        <div className="h-[1px] flex-1 bg-white/10" />
      </div>
      <div className="relative group">
        <div className="absolute -inset-1 bg-emerald-500/20 blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
        <form ref={formRef} onSubmit={sendEmail} className="relative bg-black/80 border border-white/10 p-6 md:p-16 rounded-[2rem] md:rounded-[3rem] backdrop-blur-3xl grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest ml-2">Your Name</label>
            <input type="text" name="user_name" required placeholder="John Doe" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-emerald-500 outline-none transition-all text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest ml-2">Email Address</label>
            <input type="email" name="user_email" required placeholder="john@company.com" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-emerald-500 outline-none transition-all text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest ml-2">Service Required</label>
            <select name="service_type" className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl px-6 py-4 focus:border-emerald-500 outline-none transition-all text-slate-400 text-sm">
              <option value="WhatsApp_Automation">WhatsApp AI Automation (No Website Needed)</option>
              <option value="AI_Agent">AI Agent Integration (High End)</option>
              <option value="Workflow_Automation">Workflow Automation</option>
              <option value="School_Portal">School Management System</option>
              <option value="Ecommerce">E-Commerce System</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest ml-2">Budget Range</label>
            <select name="budget" className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl px-6 py-4 focus:border-emerald-500 outline-none transition-all text-slate-400 text-sm">
              <option value="100k-200k">100,000 - 200,000 NGN</option>
              <option value="200k-500k">200,000 - 500,000 NGN</option>
              <option value="500k+">500,000 NGN +</option>
            </select>
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest ml-2">Brief the Project</label>
            <textarea name="message" rows={4} required placeholder="Tell me about the system you want to build..." className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-4 focus:border-emerald-500 outline-none transition-all resize-none text-sm"></textarea>
          </div>
          <div className="md:col-span-2 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-[10px] text-slate-500 italic max-w-sm text-center md:text-left">By clicking submit, you agree to the 50% upfront payment policy for project initiation.</p>
            <button type="submit" className="w-full md:w-auto bg-emerald-500 text-black font-black px-12 py-4 rounded-2xl hover:scale-105 transition-all shadow-xl shadow-emerald-500/20 active:scale-95 whitespace-nowrap text-xs">
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
    <div className="min-h-screen bg-[#020202] text-slate-300 font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[10%] w-[300px] md:w-[700px] h-[300px] md:h-[700px] bg-emerald-600/10 blur-[120px] md:blur-[180px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-blue-600/10 blur-[100px] md:blur-[150px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
        <header className="flex flex-col md:flex-row justify-between items-center gap-6 mb-16 md:mb-24 border-b border-white/5 pb-8">
          <div className="text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-black text-white italic tracking-tighter">PRINCEWILL<span className="text-emerald-500">.AI</span></h1>
            <p className="text-[8px] md:text-[10px] text-slate-500 font-bold tracking-[0.3em] uppercase mt-1">Systems & Automation Architect</p>
          </div>
          <div className="flex gap-4 md:gap-8 items-center">
            <div className="hidden sm:flex gap-4 md:gap-6 text-[10px] font-black tracking-widest text-slate-400">
              <a href="https://github.com/nwafor-princewill" target="_blank" className="hover:text-emerald-500 transition-colors uppercase">GITHUB</a>
              <a href="https://x.com/fanciitech?s=11" target="_blank" className="hover:text-emerald-500 transition-colors uppercase">TWITTER</a>
              <a href="https://wa.me/2349032650856" target="_blank" className="hover:text-emerald-500 transition-colors uppercase">WHATSAPP</a>
            </div>
            <button onClick={scrollToContact} className="bg-white text-black px-6 md:px-8 py-3 rounded-full font-black text-[10px] md:text-xs hover:bg-emerald-500 transition-all active:scale-95 shadow-lg shadow-white/5 uppercase tracking-widest">Book Consultation</button>
          </div>
        </header>

        {/* HERO SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 mb-24 md:mb-44 items-center">
          <div className="lg:col-span-5 text-center lg:text-left">
            <div className="inline-block px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[9px] md:text-[10px] font-black tracking-widest mb-6 uppercase italic">Built for 2026</div>
            <h2 className="text-5xl sm:text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter mb-8 italic break-words uppercase">
              AI <br className="hidden md:block"/> POWERED <br/> <span className="text-emerald-500">GROWTH.</span>
            </h2>
            <p className="text-lg md:text-xl text-slate-400 mb-6 leading-relaxed lg:border-l-2 lg:border-emerald-500/30 lg:pl-6">
              I build Digital Employees that handle your customers, capture leads, and close sales on WhatsApp while you sleep. **No Website Required.**
            </p>
            <a href="https://wa.me/2349032650856" target="_blank" className="inline-flex items-center gap-4 text-emerald-500 font-black text-xs md:text-sm tracking-[0.2em] hover:translate-x-2 transition-transform duration-300 group uppercase italic">
                Secure your AI agent now <span className="text-xl group-hover:scale-125 transition-transform">→</span>
            </a>
          </div>

          <div className="lg:col-span-7 relative">
            <div className="absolute -inset-4 md:-inset-10 bg-emerald-500/20 blur-[60px] md:blur-[100px] rounded-[2rem] md:rounded-[4rem] -z-10 animate-pulse" />
            <div className="flex flex-col h-[550px] md:h-[700px] bg-black/80 border border-emerald-500/40 rounded-[2rem] md:rounded-[3rem] overflow-hidden backdrop-blur-3xl shadow-[0_0_80px_-20px_rgba(16,185,129,0.4)]">
              <div className="p-4 md:p-6 border-b border-white/10 bg-emerald-500/5 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-[9px] md:text-[10px] font-black tracking-widest text-emerald-500 uppercase ml-2 md:ml-4">Agent v1.0.4 Online</span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4 md:space-y-6 custom-scrollbar">
                {chat.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center px-4">
                    <div className="relative mb-6">
                       <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full animate-pulse" />
                       <img src={logo} alt="Princewill.AI Logo" className="w-24 h-24 md:w-32 md:h-32 object-contain relative animate-[pulse_2s_ease-in-out_infinite] hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                    </div>
                    <p className="font-mono text-xs md:text-sm uppercase tracking-[0.3em] text-white animate-pulse drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
                      System Ready. Brief your requirements.
                    </p>
                  </div>
                )}
                {chat.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                    <div className={`max-w-[90%] md:max-w-[85%] p-4 md:p-6 rounded-2xl md:rounded-[2rem] shadow-xl text-sm md:text-base ${msg.role === 'user' ? 'bg-emerald-600 text-white rounded-br-none' : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none backdrop-blur-md'}`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {loading && <div className="text-emerald-500 font-mono text-[9px] md:text-[10px] animate-pulse">SYSTEM_THINKING...</div>}
                <div ref={scrollRef} />
              </div>

              <div className="p-4 md:p-8 border-t border-white/10 bg-black/60 space-y-4 md:space-y-6">
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                  {SUGGESTIONS.map((s, i) => (
                    <button key={i} onClick={() => handleSend(s)} className="whitespace-nowrap text-[8px] md:text-[9px] uppercase font-black px-4 py-2 md:px-5 md:py-2.5 rounded-full border border-white/10 hover:border-emerald-500 text-slate-500 hover:text-emerald-400 transition-all bg-white/5">{s}</button>
                  ))}
                </div>
                <div className="flex gap-2 md:gap-4">
                  <input value={input} onChange={(e)=>setInput(e.target.value)} onKeyDown={(e)=>e.key==='Enter'&&handleSend()} placeholder="Brief your business requirements here..." className="flex-1 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-4 py-3 md:px-6 md:py-4 focus:outline-none focus:border-emerald-500 transition-all text-sm" />
                  <button onClick={()=>handleSend()} className="bg-emerald-500 text-black font-black px-6 md:px-10 rounded-xl md:rounded-2xl hover:scale-105 transition-transform active:scale-95 text-xs">SEND</button>
                </div>
                {chat.some(m => m.role === 'assistant') && (
                  <button onClick={openWhatsApp} className="w-full py-3 md:py-4 rounded-xl md:rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 text-[9px] md:text-xs font-black tracking-widest hover:bg-emerald-500 hover:text-black transition-all flex items-center justify-center gap-2 md:gap-3 animate-bounce shadow-lg shadow-emerald-500/20">
                    <span>SECURE THIS QUOTE ON WHATSAPP</span>
                    <span className="text-base md:text-lg">→</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* DETAILED WHATSAPP STORY SECTION */}
        <section className="mb-24 md:mb-44">
           <div className="bg-white/[0.02] border border-emerald-500/20 rounded-[3rem] p-8 md:p-20 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 text-emerald-500/10 text-9xl font-black italic select-none">WHATSAPP</div>
              <div className="max-w-4xl relative z-10">
                <h2 className="text-3xl md:text-6xl font-black text-white italic mb-8 uppercase tracking-tighter leading-none">The 100 DM Problem: <br/><span className="text-emerald-500 underline underline-offset-8 decoration-emerald-500/30">Solved.</span></h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
                   <div className="space-y-6">
                      <p className="text-red-400 font-black tracking-widest text-xs uppercase">The Nightmare Scenario</p>
                      <p className="text-slate-400 leading-relaxed italic">
                        "You wake up to 100 new WhatsApp messages. You spend 5 hours answering 'How much?' and 'Is it available?'. By the time you finish, only 10 people actually buy. You are exhausted, your back hurts, and you haven't even started your real work or deliveries yet."
                      </p>
                   </div>
                   <div className="space-y-6">
                      <p className="text-emerald-400 font-black tracking-widest text-xs uppercase">The Princewill.AI Solution</p>
                      <p className="text-slate-200 leading-relaxed font-bold">
                        My AI Agent handles all 100 DMs simultaneously. It answers questions, checks your price list, qualifies the serious buyers, and even schedules the delivery details. 
                      </p>
                   </div>
                </div>

                <div className="mt-16 p-8 bg-emerald-500/10 border border-emerald-500/30 rounded-3xl">
                   <h4 className="text-white font-black text-xl mb-4 italic uppercase">Zero Website. Zero Stress.</h4>
                   <p className="text-slate-300 mb-6">You don't need a website to automate your business. You just need a system that works as hard as you do. Focus on your growth and your deliveries—let the AI handle the talk.</p>
                   <button onClick={scrollToContact} className="text-emerald-500 font-black text-sm tracking-widest hover:underline uppercase">Get Started for 100k →</button>
                </div>
              </div>
           </div>
        </section>

        {/* SERVICE CATALOG */}
        <section className="mb-24 md:mb-44">
          <div className="mb-12 md:mb-16 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-black text-white italic uppercase tracking-tighter">Service Catalog</h2>
            <p className="text-slate-500 mt-2 text-sm md:text-base">Transparent pricing for premium digital infrastructure.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              { title: "WhatsApp AI (Small Biz)", price: "100k - 200k", desc: "For boutiques/local shops. A 24/7 AI employee that talks to customers, shares prices, and captures orders on WhatsApp. No website needed." },
              { title: "AI Agent Integration", price: "500k+", desc: "High-end LLM agents with custom personalities and deep business logic for corporate sales." },
              { title: "Workflow Automation", price: "350k+", desc: "Automate your entire backend. Connect WhatsApp to CRMs, Google Sheets, and Invoicing software." },
              { title: "School Management", price: "800k+", desc: "Full-scale portal for schools: Result processing, fee tracking, and student database management." },
              { title: "E-Commerce System", price: "450k+", desc: "Professional online storefront with inventory tracking and automated payment confirmation." },
              { title: "Corporate/NGO", price: "250k+", desc: "Premium high-performance websites optimized for credibility and global reach." }
            ].map((item, i) => (
              <div key={i} className="p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-all text-center md:text-left">
                <h3 className="text-emerald-500 font-black text-xs md:text-sm uppercase tracking-widest mb-2">{item.title}</h3>
                <p className="text-2xl md:text-3xl font-bold text-white mb-4 italic">{item.price}</p>
                <p className="text-slate-500 text-xs md:text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* DEEP EXPLANATIONS - SECTION 1 */}
        <section className="mb-12 md:mb-20 grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20 bg-emerald-500/[0.02] p-8 md:p-16 rounded-[2.5rem] md:rounded-[4rem] border border-white/5">
          <div className="space-y-6 md:space-y-8">
            <div className="w-10 md:w-12 h-10 md:h-12 bg-emerald-500/20 rounded-xl md:rounded-2xl flex items-center justify-center text-xl md:text-2xl">⚡</div>
            <h3 className="text-3xl md:text-5xl font-black text-white italic leading-tight uppercase tracking-tighter">The Power Of <br/> Automation.</h3>
            <p className="text-slate-400 text-base md:text-lg leading-relaxed">
               Workflow automation isn't just software; it's a **Digital Employee**. Imagine every time a lead chats with you on WhatsApp, their name is saved, a follow-up is scheduled, and an invoice is prepared—instantly. 
               <br/><br/>
               I connect your favorite tools so you can stop doing "admin work" and start growing your business.
            </p>
          </div>
          <div className="space-y-6 md:space-y-8 lg:border-l lg:border-white/10 lg:pl-20">
            <div className="w-10 md:w-12 h-10 md:h-12 bg-blue-500/20 rounded-xl md:rounded-2xl flex items-center justify-center text-xl md:text-2xl">🧠</div>
            <h3 className="text-3xl md:text-5xl font-black text-white italic leading-tight uppercase tracking-tighter">AI For <br/> Real Business.</h3>
            <p className="text-slate-400 text-base md:text-lg leading-relaxed">
               We move past simple "Chatbots." I build AI Systems that understand your business logic. 
               <br/><br/>
               Your AI system can analyze your sales data, draft professional emails, and handle complex customer inquiries using the same technology behind ChatGPT, but customized 100% for your brand.
            </p>
          </div>
        </section>

        {/* DEEP EXPLANATIONS - SECTION 2 (WHATSAPP SPECIFIC) */}
        <section className="mb-24 md:mb-44 grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20 bg-blue-500/[0.02] p-8 md:p-16 rounded-[2.5rem] md:rounded-[4rem] border border-white/5">
          <div className="space-y-6 md:space-y-8">
            <div className="w-10 md:w-12 h-10 md:h-12 bg-emerald-500/20 rounded-xl md:rounded-2xl flex items-center justify-center text-xl md:text-2xl">⚡</div>
            <h3 className="text-3xl md:text-5xl font-black text-white italic leading-tight uppercase tracking-tighter">WhatsApp <br/> Automation.</h3>
            <p className="text-slate-400 text-base md:text-lg leading-relaxed">
               Stop losing customers because you were driving or sleeping. I build **WhatsApp Employees** that reply to messages instantly. 
               <br/><br/>
               Whether you run a boutique or a school, your AI assistant will handle price inquiries and save lead details to your records automatically. This saves you 10+ hours a week and ensures no customer is ever ignored.
            </p>
          </div>
          <div className="space-y-6 md:space-y-8 lg:border-l lg:border-white/10 lg:pl-20">
            <div className="w-10 md:w-12 h-10 md:h-12 bg-blue-500/20 rounded-xl md:rounded-2xl flex items-center justify-center text-xl md:text-2xl">🧠</div>
            <h3 className="text-3xl md:text-5xl font-black text-white italic leading-tight uppercase tracking-tighter">Smart <br/> Business.</h3>
            <p className="text-slate-400 text-base md:text-lg leading-relaxed">
               I move your business from manual struggle to automated growth.
               <br/><br/>
               By connecting your WhatsApp to your business data, your AI can check if a product is in stock or tell a parent if their child's result is ready. High-tech results without you needing to learn any tech.
            </p>
          </div>
        </section>

        {/* PORTFOLIO */}
        <section className="mb-24 md:mb-44">
          <div className="flex items-center gap-4 md:gap-8 mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter">Portfolio</h2>
            <div className="h-[1px] flex-1 bg-white/10" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <ProjectCard icon="🔍" tag="AI Intelligence" title="AI CV Screening Agent" desc="Custom NLP engine that ranks thousands of applicants based on job context." />
            <ProjectCard icon="🏦" tag="Fintech" title="SecureBank Dashboard" desc="High-security banking UI with real-time transaction tracking and state management." />
            <ProjectCard icon="⚙️" tag="Systems" title="Focus Grid Dashboard" desc="Precision-engineered productivity dashboard for high-load task management." />
            <ProjectCard icon="📚" tag="Content" title="WisdomStack Blog" desc="Minimalist philosophical content engine optimized for performance and SEO." />
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="mb-24 md:mb-44 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-12 md:mb-20 italic uppercase tracking-tighter">Testimonials</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              { q: "Reduced our customer support response time by 90%.", a: "Lagos Tech Hub" },
              { q: "The School Management system is the best investment we've made.", a: "Lead Academy" },
              { q: "Automated our entire real estate lead funnel perfectly.", a: "Luxe Properties" },
              { q: "Princewill understands the bridge between AI and Business.", a: "Sarah (NGO Director)" },
              { q: "High-quality code and beautiful UI design.", a: "Swift Logistics CEO" },
              { q: "A visionary developer who thinks about ROI.", a: "Fintech Startup Founder" }
            ].map((t, i) => (
              <div key={i} className="p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] bg-white/[0.03] border border-white/5 italic">
                <p className="text-slate-300 text-base md:text-lg">"{t.q}"</p>
                <p className="mt-4 md:mt-6 not-italic font-black text-emerald-500 uppercase tracking-widest text-[10px] md:text-xs">— {t.a}</p>
              </div>
            ))}
          </div>
        </section>

        <ContactForm />

        <footer className="py-12 md:py-20 border-t border-white/5 text-center">
          <h2 className="text-xl md:text-2xl font-black text-white italic mb-6 uppercase tracking-tighter">PRINCEWILL<span className="text-emerald-500">.AI</span></h2>
          <p className="text-slate-600 text-[8px] md:text-[10px] mb-8 md:mb-10 tracking-[0.3em] md:tracking-[0.5em] uppercase font-black">Built for 2026 and Beyond</p>
          <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-[9px] md:text-[10px] font-black tracking-widest text-slate-400 uppercase">
            <a href="https://github.com/nwafor-princewill" target="_blank" className="hover:text-emerald-500 transition-colors">GITHUB</a>
            <a href="https://x.com/fanciitech?s=11" target="_blank" className="hover:text-emerald-500 transition-colors">TWITTER</a>
            <a href="https://wa.me/2349032650856" target="_blank" className="hover:text-emerald-500 transition-colors">WHATSAPP</a>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;