import { motion } from "framer-motion";
import { BookOpen, Trophy, Award, Target, Calculator } from "lucide-react";

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
    // ✅ was: text-white, bg-white/10, border-white/20
    color: "text-foreground",
    bgColor: "bg-foreground/10",
    borderColor: "border-foreground/20"
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
    highlight: "1st Rank in Board in Tripura",
    icon: <BookOpen className="w-5 h-5" />,
    color: "text-accent",
    bgColor: "bg-accent/10",
    borderColor: "border-accent/20"
  },
  {
    title: "ICSE 2018",
    subtitle: "Holy Cross School, Agartala",
    value: "95.8%",
    highlight: "4th Rank in Board in Tripura",
    icon: <Trophy className="w-5 h-5" />,
    color: "text-yellow-400",
    bgColor: "bg-yellow-400/10",
    borderColor: "border-yellow-400/20"
  },
  {
    title: "ALOHA Mental Arithmetic",
    subtitle: "2012 – 2014",
    value: "5 Championships",
    icon: <Calculator className="w-5 h-5" />,
    color: "text-orange-400",
    bgColor: "bg-orange-400/10",
    borderColor: "border-orange-400/20",
    alohaAchievements: [
      { year: "2012", level: "Level 1", state: "State Champion", national: "National 1st Runner-up" },
      { year: "2013", level: "Level 4", state: "State Champion", national: "National 3rd Runner-up" },
      { year: "2014", level: "Level 8", state: "State Champion", national: null },
    ]
  }
];

export function Education() {
  return (
    // ✅ was: bg-black/20
    <section id="education" className="py-24 relative bg-foreground/5">
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
          {/* ✅ was: text-white/60 */}
          <p className="text-muted-foreground">A timeline of competitive and academic achievements</p>
        </motion.div>

        {/* ✅ was: border-white/10 */}
        <div className="relative border-l-2 border-foreground/10 ml-6 md:ml-12 space-y-12">
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

                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      {/* ✅ was: text-white */}
                      <h3 className="text-xl md:text-2xl font-bold text-foreground mb-1 flex items-center gap-2">
                        <span className={item.color}>{item.icon}</span>
                        {item.title}
                      </h3>
                      {/* ✅ was: text-white/60 */}
                      {item.subtitle && <p className="text-muted-foreground mb-2">{item.subtitle}</p>}
                      {/* ✅ was: text-white/40 */}
                      {item.date && <p className="text-sm text-foreground/40 mb-2">{item.date}</p>}
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

                  {'alohaAchievements' in item && item.alohaAchievements && (
                    <div className="mt-2 rounded-xl overflow-hidden border border-orange-400/20">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-orange-400/10 text-orange-400">
                            <th className="px-4 py-2 text-left font-semibold">Year</th>
                            <th className="px-4 py-2 text-left font-semibold">Level</th>
                            <th className="px-4 py-2 text-left font-semibold">State</th>
                            <th className="px-4 py-2 text-left font-semibold">National</th>
                          </tr>
                        </thead>
                        <tbody>
                          {item.alohaAchievements.map((a, i) => (
                            <tr
                              key={i}
                              className="border-t border-orange-400/10 hover:bg-orange-400/5 transition-colors"
                            >
                              {/* ✅ was: text-white/80 */}
                              <td className="px-4 py-2 text-foreground/80 font-medium">{a.year}</td>
                              {/* ✅ was: text-white/60 */}
                              <td className="px-4 py-2 text-muted-foreground">{a.level}</td>
                              <td className="px-4 py-2">
                                <span className="inline-flex items-center gap-1 text-yellow-400 font-semibold">
                                  🏆 {a.state}
                                </span>
                              </td>
                              <td className="px-4 py-2">
                                {a.national ? (
                                  <span className="inline-flex items-center gap-1 text-orange-300 font-medium">
                                    🥈 {a.national}
                                  </span>
                                ) : (
                                  // ✅ was: text-white/30
                                  <span className="text-foreground/30">—</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}