import { motion } from "framer-motion";
import { BookOpen, Trophy, Award, Target } from "lucide-react";

const educationData = [
  {
    title: "XAT 2026",
    value: "98.79 percentile",
    icon: <Target className="w-5 h-5" />,
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/20"
  },
  {
    title: "CAT 2025",
    value: "94.11 percentile",
    icon: <Target className="w-5 h-5" />,
    color: "text-secondary",
    bgColor: "bg-secondary/10",
    borderColor: "border-secondary/20"
  },
  {
    title: "GATE CSE 2023",
    value: "61 Marks (AIR 590)",
    subtitle: "Rank 1 in College (Achieved in 3rd year)",
    icon: <Trophy className="w-5 h-5" />,
    color: "text-accent",
    bgColor: "bg-accent/10",
    borderColor: "border-accent/20"
  },
  {
    title: "B.E. Computer Science Engineering",
    subtitle: "PSG College of Technology, Coimbatore",
    date: "Nov 2020 – May 2024",
    value: "GPA: 8.58/10",
    icon: <BookOpen className="w-5 h-5" />,
    color: "text-white",
    bgColor: "bg-white/10",
    borderColor: "border-white/20"
  },
  {
    title: "JEE Advanced 2020",
    value: "108 Marks (AIR 12,261)",
    icon: <Award className="w-5 h-5" />,
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/20"
  },
  {
    title: "JEE Mains 2020",
    value: "98.49 percentile (AIR 16,843)",
    icon: <Award className="w-5 h-5" />,
    color: "text-secondary",
    bgColor: "bg-secondary/10",
    borderColor: "border-secondary/20"
  },
  {
    title: "ISC Science 2020",
    subtitle: "Holy Cross School, Agartala",
    value: "93.75%",
    icon: <BookOpen className="w-5 h-5" />,
    color: "text-accent",
    bgColor: "bg-accent/10",
    borderColor: "border-accent/20"
  },
  {
    title: "ICSE 2018",
    subtitle: "Holy Cross School, Agartala",
    value: "95.8%",
    highlight: "4th Rank in Board",
    icon: <Trophy className="w-5 h-5" />,
    color: "text-yellow-400",
    bgColor: "bg-yellow-400/10",
    borderColor: "border-yellow-400/20"
  }
];

export function Education() {
  return (
    <section id="education" className="py-24 relative bg-black/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Academic <span className="text-primary">Excellence</span>
          </h2>
          <p className="text-white/60">A timeline of competitive and academic achievements</p>
        </motion.div>

        <div className="relative border-l-2 border-white/10 ml-6 md:ml-12 space-y-12">
          {educationData.map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative pl-8 md:pl-12"
            >
              <div className={`absolute -left-[17px] top-1 w-8 h-8 rounded-full border-4 border-background ${item.bgColor} flex items-center justify-center`}>
                <div className={`w-2 h-2 rounded-full ${item.color.replace('text-', 'bg-')}`} />
              </div>
              
              <div className={`glass-card p-6 md:p-8 rounded-2xl border ${item.borderColor} hover:scale-[1.02] transition-transform duration-300 relative overflow-hidden group`}>
                <div className={`absolute top-0 right-0 w-32 h-32 ${item.bgColor} rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-500`} />
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-1 flex items-center gap-2">
                      <span className={item.color}>{item.icon}</span>
                      {item.title}
                    </h3>
                    {item.subtitle && <p className="text-white/60 mb-2">{item.subtitle}</p>}
                    {item.date && <p className="text-sm text-white/40 mb-2">{item.date}</p>}
                  </div>
                  
                  <div className="text-left md:text-right">
                    <span className={`inline-block px-4 py-2 rounded-xl font-bold text-lg ${item.bgColor} ${item.color}`}>
                      {item.value}
                    </span>
                    {item.highlight && (
                      <p className="mt-2 text-sm font-bold text-yellow-400 bg-yellow-400/10 inline-block px-3 py-1 rounded-full">
                        {item.highlight}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
