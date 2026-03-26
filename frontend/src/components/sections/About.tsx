import { motion } from "framer-motion";
import { User, Heart, Globe, GraduationCap } from "lucide-react";

export function About() {
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
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">My</span> Journey
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6 text-lg text-white/80 leading-relaxed font-medium"
          >
            <p>
              My name is Saumarghya Ray, a 24-year-old navigating the maze of life with intellect, curiosity, and an adaptive spirit.
            </p>
            <p>
              I was born on 21st January 2002 into a warm Bengali joint family in Agartala, Tripura, to my parents Debasis Ray and Mridula DebRoy. Growing up, I was surrounded by love — from my parents, grandparents, uncle, aunt, and my caring younger cousin sister, who is three years my junior. My early schooling began at Maharshi VidyaMandir, Ramnagar, before I moved to Holy Cross School, where I spent the rest of my school life. I secured the 4th position in the ICSE 2018 Board Exams.
            </p>
            <p>
              Beyond academics, I was deeply involved in co-curricular pursuits — Vocal Music, Painting, and Recitation — nurtured by parents who always ensured I had access to the best opportunities. During my 4th Standard I was enrolled at Aloha (Abacus learning centre) which has been a real asset in my life in terms of my enhanced interpretation of numerology and calculations, where I have tasted success across both State-level as well as National-level competitions. During Class 12, I appeared for JEE Mains & Advanced, securing 98.49 percentile and AIR 12261 respectively, while also scoring 93.75% in ISC Science.
            </p>
            <p>
              Since childhood, I have had a strong passion for quizzing and knowledge across diverse domains — Physics, Chemistry, Biology, Computer Science, Mathematics, History, Geography, Geopolitics, Economics, Mythology, and Sports (particularly Cricket, Kabaddi, Field Hockey, Lawn Tennis, Badminton, WWE, and major events like the Olympics, Commonwealth Games, and Asian Games). Travelling across India has further enriched my understanding of diverse ethnicities, multilingual cultures, and this beautiful land we call home.
            </p>
            <p>
              My values have been shaped by my upbringing — my parents instilled in me a commitment to honesty, integrity, and a disciplined, high-quality way of living, with a genuine desire to contribute to society and add value to the lives of those around me.
            </p>
            <p>
              For my undergraduate education, I pursued B.E. in Computer Science at PSG College of Technology, Coimbatore. Adapting to South Indian culture — its lifestyle, food, and language — was initially a challenge after growing up in a Bengali household, but it turned out to be one of the most enriching experiences of my life. I found my footing with the help of wonderful friends, particularly my close-knit group, the "5 Gandus", who were my lifeline through college.
            </p>
            <p>
              At PSG, I continued to push boundaries. In 2023, I appeared for the GATE CSE exam, securing an AIR of 590 — ranking 1st in my college, remarkably while still in my 3rd year, outscoring several final-year seniors. I also won the college IPL Auction for two consecutive years alongside my teammates — a competition where I take particular pride in my stats-driven, analytical approach to the game.
            </p>
            <p>
              Academically and professionally, Chemistry remains my favourite subject — and I am equally comfortable teaching Quants/LRDI for CAT, OS/DBMS/Networks/C for GATE, and guiding students through competitive syllabi.
            </p>
            <p>
              I was placed at Hewlett Packard Enterprise (HPE), Bengaluru, as an Intern + Full-Time Graduate, and relocated there in February 2024. Life in Bengaluru has been a rollercoaster — professionally fulfilling and personally testing in equal measure. At HPE, I have worked as a Systems Software QA Engineer, demonstrating competence in collaboration, innovation, and strong work ethics, for which I have been recognised with multiple Starpoints awards.
            </p>
            <p>
              Looking ahead, I am preparing for a 2-year MBA programme through CAT/XAT, with my sights set on the top 7 IIMs, XLRI Jamshedpur, and SPJIMR Mumbai. I also plan to appear for SSC-CGL and UPSC — less for the destination and more for the joy of continuous learning, self-testing, and broadening my understanding of the world.
            </p>
            <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent pt-4">
              Life so far has been a remarkable journey — and I'm only just getting started.
            </p>
          </motion.div>

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
                      <p className="text-sm font-bold text-white">Ambitious</p>
                      <p className="text-xs text-white/60">MBA Aspirant</p>
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
                      <p className="text-sm font-bold text-white">Explorer</p>
                      <p className="text-xs text-white/60">Curious & Adaptive</p>
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
