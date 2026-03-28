import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";

const navItems = [
  { name: "Home", href: "home" },
  { name: "About", href: "about" },
  { name: "Education", href: "education" },
  { name: "Skills", href: "skills" },
  { name: "Experience", href: "experience" },
  { name: "Projects", href: "projects" },
  { name: "Interests", href: "interests" },
  { name: "Contact", href: "contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        const offset = 80; // navbar height
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }, 100); // small delay lets mobile menu close first
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "py-4 glass-card border-b border-white/10 shadow-lg shadow-black/50" : "py-6 bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <button
            onClick={() => scrollToSection("home")}
            className="text-2xl font-display font-bold text-foreground relative group"
          >
            SR<span className="text-primary">.</span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full"></span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground rounded-lg hover:bg-foreground/5 transition-colors"
              >
                {item.name}
              </button>
            ))}

            {/* Dark/Light Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="ml-2 w-10 h-10 rounded-full flex items-center justify-center bg-foreground/5 border border-foreground/10 hover:bg-foreground/10 transition-all duration-300 hover:scale-110"
            >
              <AnimatePresence mode="wait" initial={false}>
                {theme === "dark" ? (
                  <motion.span
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="w-4 h-4 text-yellow-400" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="w-4 h-4 text-primary" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <button
              onClick={() => scrollToSection("contact")}
              className="ml-2 px-5 py-2 rounded-full font-semibold text-sm bg-foreground/10 hover:bg-foreground/20 border border-foreground/20 text-foreground transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:-translate-y-0.5"
            >
              Let's Talk
            </button>
          </div>

          {/* Mobile: toggle + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="w-9 h-9 rounded-full flex items-center justify-center bg-foreground/5 border border-foreground/10"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-yellow-400" />
              ) : (
                <Moon className="w-4 h-4 text-primary" />
              )}
            </button>
            <button
              className="p-2 text-foreground/80 hover:text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-card border-t border-foreground/10 overflow-hidden"
          >
            <div className="px-4 py-6 flex flex-col space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="text-left text-lg font-medium text-foreground/80 hover:text-primary transition-colors"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}