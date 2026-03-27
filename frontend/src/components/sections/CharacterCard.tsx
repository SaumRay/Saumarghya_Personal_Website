import { motion } from "framer-motion";
import { RPGCard } from "@/components/sections/RPGCard";

export function CharacterCard() {
  return (
    <section id="character" className="py-24 relative overflow-hidden">
      {/* Ambient background blobs to match site style */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-500/5 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-primary/10 rounded-full filter blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Character <span className="text-gradient">Card</span>
          </h2>
          <p className="text-foreground/60 max-w-2xl mx-auto">
            Life as an RPG — every skill grinded, every badge earned.
          </p>
        </motion.div>

        {/* The card */}
        <RPGCard />
      </div>
    </section>
  );
}