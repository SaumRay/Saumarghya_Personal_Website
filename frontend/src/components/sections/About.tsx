import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Globe } from "lucide-react";
import { API_BASE } from "@/hooks/use-admin-auth";

const FALLBACK_BIO = `My name is Saumarghya Ray — a 24-year-old QA Engineer at Hewlett Packard Enterprise, Bengaluru, navigating life with intellect, curiosity, and an adaptive spirit.

Born on 21st January 2002 into a warm Bengali joint family in Agartala, Tripura, I grew up surrounded by love and encouragement. I schooled at Holy Cross School, securing 4th position in ICSE 2018. Beyond academics, I pursued Vocal Music, Painting, and Recitation, and won State & National-level Abacus competitions. In Class 12, I scored 93.75% in ISC Science and secured 98.49 percentile in JEE Mains.

I pursued B.E. in Computer Science at PSG College of Technology, Coimbatore — an experience that shaped me deeply, both academically and personally. In 2023, I cracked GATE CSE with AIR 590, ranking 1st in my college while still in my 3rd year.

At HPE, I work as a Systems Software QA Engineer and have been recognised with multiple Starpoints awards for collaboration, innovation, and work ethics.

Looking ahead, I am preparing for MBA through CAT/XAT — targeting the top IIMs, XLRI, and SPJIMR — and also plan to appear for UPSC and SSC-CGL, driven more by the joy of learning than the destination.

Life so far has been a remarkable journey — and I'm only just getting started.`;

export function About() {
  const [bio, setBio] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/profile`)
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data?.aboutBio) {
          setBio(d.data.aboutBio);
        } else if (d.success && d.data?.bio) {
          setBio(d.data.bio);
        } else {
          setBio(FALLBACK_BIO);
        }
      })
      .catch(() => setBio(FALLBACK_BIO))
      .finally(() => setLoading(false));
  }, []);

  const paragraphs = bio.split("\n").filter(p => p.trim().length > 0);

  return (
    <section id="about" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/50">My</span> Journey
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Bio text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6 text-lg text-foreground/80 leading-relaxed font-medium"
          >
            {loading ? (
              <div className="space-y-4 animate-pulse">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-4 bg-foreground/10 rounded-full" style={{ width: `${85 + Math.random() * 15}%` }} />
                ))}
              </div>
            ) : (
              <>
                {paragraphs.map((para, index) => {
                  const isLast = index === paragraphs.length - 1;
                  return (
                    <p
                      key={index}
                      className={isLast
                        ? "text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent pt-4"
                        : ""
                      }
                    >
                      {para}
                    </p>
                  );
                })}
              </>
            )}
          </motion.div>

          {/* Photos */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="sticky top-32 grid gap-6">
              <div className="glass-card rounded-3xl p-2 rotate-2 hover:rotate-0 transition-transform duration-500 shadow-xl shadow-primary/10">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden relative">
                  <img
                    src={`${import.meta.env.BASE_URL}photo-suit.png`}
                    alt="Saumarghya Formal"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute bottom-4 left-4 right-4 glass-card p-3 rounded-xl flex items-center space-x-3">
                    <div className="bg-primary/20 p-2 rounded-lg">
                      <GraduationCap className="text-primary w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">Ambitious</p>
                      <p className="text-xs text-muted-foreground">MBA Aspirant</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-3xl p-2 -rotate-2 hover:rotate-0 transition-transform duration-500 shadow-xl shadow-accent/10 translate-x-4 lg:-translate-y-12">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden relative">
                  <img
                    src={`${import.meta.env.BASE_URL}photo-casual.png`}
                    alt="Saumarghya Casual"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute bottom-4 left-4 right-4 glass-card p-3 rounded-xl flex items-center space-x-3">
                    <div className="bg-accent/20 p-2 rounded-lg">
                      <Globe className="text-accent w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">Explorer</p>
                      <p className="text-xs text-muted-foreground">Curious & Adaptive</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}