import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Mail, Github, Linkedin, Download } from "lucide-react";
import { useState, useEffect } from "react";

const rotatingTitles = [
  { label: "Automation Expert", color: "text-primary" },
  { label: "MBA Aspirant", color: "text-secondary" },
  { label: "Quiz Enthusiast", color: "text-accent" },
  { label: "Avid Traveller", color: "text-primary" },
  { label: "Chemistry Mentor", color: "text-secondary" },
  { label: "Cricket Analyst", color: "text-accent" },
  { label: "Lifelong Learner", color: "text-primary" },
];

export function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % rotatingTitles.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-accent/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000" />
      <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-secondary/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-4000" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col space-y-6 text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-block"
            >
              <span className="px-4 py-2 rounded-full border border-foreground/10 bg-foreground/5 backdrop-blur-md text-primary font-medium text-sm">
                Available for new opportunities
              </span>
            </motion.div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight text-foreground">
              Hi, I'm <br />
              <span className="text-gradient">Saumarghya Ray</span>
            </h1>

            {/* Rotating headline */}
            <div className="flex items-center justify-center lg:justify-start h-10 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentIndex}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -30, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className={`text-xl md:text-2xl font-semibold ${rotatingTitles[currentIndex].color}`}
                >
                  {rotatingTitles[currentIndex].label}
                </motion.p>
              </AnimatePresence>
            </div>

            <p className="text-lg text-foreground/60 max-w-xl mx-auto lg:mx-0">
              Navigating the maze of life with intellect, curiosity, and an adaptive spirit. I build robust automation frameworks and strive for continuous growth.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              <a
                href="#projects"
                className="px-8 py-4 rounded-xl font-bold text-background bg-gradient-to-r from-primary to-secondary hover:shadow-[0_0_30px_rgba(0,240,255,0.4)] hover:-translate-y-1 transition-all duration-300 flex items-center group w-full sm:w-auto justify-center"
              >
                View My Work
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href={`${import.meta.env.BASE_URL}Saumarghya_QA_Resume.pdf`}
                download="Saumarghya_QA_Resume.pdf"
                className="px-8 py-4 rounded-xl font-bold text-foreground border border-foreground/20 hover:bg-foreground/10 hover:-translate-y-1 transition-all duration-300 flex items-center w-full sm:w-auto justify-center group"
              >
                <Download className="mr-2 w-5 h-5 group-hover:animate-bounce" />
                Download Resume
              </a>
              <a
                href="#contact"
                className="px-8 py-4 rounded-xl font-bold text-foreground border border-foreground/20 hover:bg-foreground/10 hover:-translate-y-1 transition-all duration-300 flex items-center w-full sm:w-auto justify-center"
              >
                <Mail className="mr-2 w-5 h-5" />
                Contact Me
              </a>
            </div>

            <div className="flex items-center justify-center lg:justify-start space-x-6 pt-6">
              <a href="https://github.com/SaumRay" target="_blank" rel="noreferrer" className="text-foreground/60 hover:text-primary transition-colors hover:scale-110 transform duration-200">
                <Github className="w-7 h-7" />
              </a>
              <a href="https://www.linkedin.com/in/saumarghya-ray-9b2098252/" target="_blank" rel="noreferrer" className="text-foreground/60 hover:text-primary transition-colors hover:scale-110 transform duration-200">
                <Linkedin className="w-7 h-7" />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="relative mx-auto w-full max-w-md lg:max-w-lg"
          >
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden border border-foreground/10 shadow-2xl group">
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent z-10" />
              <img
                src={`${import.meta.env.BASE_URL}photo-professional.png`}
                alt="Saumarghya Ray Professional"
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute bottom-6 left-6 right-6 z-20 glass-card p-4 rounded-xl flex justify-between items-center transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <div>
                  <p className="text-foreground font-bold text-sm">HPE Bengaluru</p>
                  <p className="text-foreground/60 text-xs">Systems Software QA</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-primary animate-ping" />
                </div>
              </div>
            </div>

            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-8 -right-8 w-24 h-24 glass-card rounded-2xl flex items-center justify-center rotate-12"
            >
              <span className="text-3xl font-display font-bold text-accent">QA</span>
            </motion.div>
            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-8 -left-8 w-28 h-28 glass-card rounded-full flex items-center justify-center -rotate-12"
            >
              <span className="text-2xl font-display font-bold text-primary">MBA</span>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
