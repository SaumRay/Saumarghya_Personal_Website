import { motion } from "framer-motion";
import { Dumbbell, MapPin, Music, Brain, Flame, BookOpen, Users } from "lucide-react";
import { useLocation } from "wouter";

export function Interests() {
  const [_, setLocation] = useLocation();

  return (
    <section id="interests" className="py-24 relative bg-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Beyond the <span className="text-primary">Screen</span>
          </h2>
          <p className="text-white/60">What fuels me when I'm not writing code or building test suites.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
          
          {/* Gym Block - Large */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:col-span-2 lg:col-span-2 row-span-2 rounded-3xl overflow-hidden relative group cursor-pointer"
            onClick={() => setLocation("/interests?category=fitness")}
          >
            <img 
              src={`${import.meta.env.BASE_URL}photo-gym.png`} 
              alt="Fitness & Gym" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center gap-3 mb-2">
                <Dumbbell className="text-primary w-6 h-6" />
                <h3 className="text-2xl font-bold text-white">Fitness & Gym</h3>
              </div>
              <p className="text-white/80 font-medium">Dedicated gym enthusiast, consistent about maintaining physical health and discipline.</p>
            </div>
          </motion.div>

          {/* Quizzing & Knowledge Block */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-3xl p-6 flex flex-col justify-end border-white/10 hover:bg-white/10 transition-colors"
          >
            <Brain className="text-accent w-8 h-8 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Quizzing & Trivia</h3>
            <p className="text-sm text-white/70">Passionate about physics, history, geopolitics, mythology, and economics.</p>
          </motion.div>

          {/* Travel Block - Large Portrait */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:col-span-1 lg:col-span-2 row-span-2 rounded-3xl overflow-hidden relative group cursor-pointer"
            onClick={() => setLocation("/interests?category=traveller")}
          >
            <img 
              src={`${import.meta.env.BASE_URL}photo-travel.png`} 
              alt="Travelling" 
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="text-secondary w-6 h-6" />
                <h3 className="text-2xl font-bold text-white">Travelling</h3>
              </div>
              <p className="text-white/80 font-medium">Explored diverse cultures and regions across India, broadening my worldview.</p>
            </div>
          </motion.div>

          {/* Sports Block */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-3xl p-6 flex flex-col justify-end border-white/10 hover:bg-white/10 transition-colors md:col-span-2 lg:col-span-1"
          >
            <Flame className="text-orange-400 w-8 h-8 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Sports & Analytics</h3>
            <p className="text-sm text-white/70">Cricket, Kabaddi, Tennis, WWE. Obsessed with sports statistics and major global events.</p>
          </motion.div>

          {/* Music Block */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-3xl p-6 flex flex-col justify-end border-white/10 hover:bg-white/10 transition-colors"
          >
            <Music className="text-pink-400 w-8 h-8 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Vocal Music</h3>
            <p className="text-sm text-white/70">Trained in vocal music since childhood, a creative outlet for expression.</p>
          </motion.div>

          {/* Family Block */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="glass-card rounded-3xl p-6 flex flex-col justify-end border-white/10 hover:bg-white/10 transition-colors lg:col-span-2 cursor-pointer"
            onClick={() => setLocation("/family-friends")}
          >
            <Users className="text-blue-400 w-8 h-8 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Family & Friends</h3>
            <p className="text-sm text-white/70">Valuing close relationships deeply, staying grounded through the love of my family and my college squad.</p>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}