import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, Instagram, Linkedin, Github, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: "Message sent!", description: "Thanks for reaching out. I'll get back to you soon." });
        setForm({ name: "", email: "", message: "" });
      } else {
        toast({ title: "Failed to send", description: data.message || "Something went wrong.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Network error", description: "Could not reach the server. Please try again later.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Let's <span className="text-gradient">Connect</span></h2>
          <p className="text-white/60 max-w-2xl mx-auto">Whether it's an opportunity, a question, or just a quick hello, my inbox is always open.</p>
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-8">
            <div className="glass-card p-8 rounded-3xl border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>
              <div className="space-y-6">
                <a href="mailto:samray252102@gmail.com" className="flex items-center space-x-4 group">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Mail className="text-white group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm text-white/50">Email</p>
                    <p className="text-lg font-medium text-white group-hover:text-primary transition-colors">samray252102@gmail.com</p>
                  </div>
                </a>
                <div className="flex items-center space-x-4 group">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <Phone className="text-white group-hover:text-accent transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm text-white/50">Phone</p>
                    <p className="text-lg font-medium text-white">+91 6909042991 / +91 9092491081</p>
                  </div>
                </div>
              </div>
              <div className="mt-12 pt-8 border-t border-white/10">
                <h4 className="text-lg font-medium text-white mb-6">Social Profiles</h4>
                <div className="flex space-x-4">
                  <a href="https://www.linkedin.com/in/saumarghya-ray-9b2098252/" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-[#0077b5]/20 flex items-center justify-center hover:bg-[#0077b5] transition-colors group">
                    <Linkedin className="text-[#0077b5] group-hover:text-white transition-colors" />
                  </a>
                  <a href="https://github.com/SaumRay" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white transition-colors group">
                    <Github className="text-white group-hover:text-black transition-colors" />
                  </a>
                  <a href="https://www.instagram.com/sam_sr42" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 flex items-center justify-center hover:opacity-80 transition-opacity">
                    <Instagram className="text-white" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <form onSubmit={handleSubmit} className="glass-card p-8 rounded-3xl border border-white/10 space-y-6">
              <h3 className="text-2xl font-bold text-white mb-2">Send a Message</h3>
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-white/70">Name</label>
                <input type="text" id="name" required value={form.name} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-white/70">Email</label>
                <input type="email" id="email" required value={form.email} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" placeholder="john@example.com" />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-white/70">Message</label>
                <textarea id="message" rows={4} required value={form.message} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none" placeholder="How can we work together?" />
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full py-4 rounded-xl font-bold text-background bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity flex items-center justify-center disabled:opacity-50">
                {isSubmitting ? "Sending..." : <> Send Message <Send className="ml-2 w-5 h-5" /> </>}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
