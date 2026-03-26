import { motion } from "framer-motion";
import { Code2, Settings, Database, Gavel  } from "lucide-react";

const skillCategories = [
  {
    title: "Programming Languages",
    icon: <Code2 className="w-6 h-6" />,
    color: "from-blue-400 to-cyan-400",
    skills: ["Python", "Java", "JavaScript", "C", "Bash Shell", "Kotlin"]
  },
  {
    title: "Automation & Frameworks",
    icon: <Settings className="w-6 h-6" />,
    color: "from-pink-400 to-rose-400",
    skills: ["Selenium", "Playwright", "RestAssured", "Pytest", "TestNG", "Postman", "Jenkins", "Spring Boot", "Node.js", "Express", "React"]
  },
  {
    title: "Databases",
    icon: <Database className="w-6 h-6" />,
    color: "from-emerald-400 to-teal-400",
    skills: ["SQL", "MongoDB", "Cassandra"]
  },
  {
    title: "Tools & Platforms",
    icon: <Gavel className="w-6 h-6" />,
    color: "from-purple-400 to-indigo-400",
    skills: ["JIRA", "TestRail", "GitHub", "Linux", "Docker", "Katalon Studio", "Confluence", "JMeter", "Grafana"]
  }
];

export function Skills() {
  return (
    <section id="skills" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Technical <span className="text-gradient">Arsenal</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            A comprehensive toolkit built for scalable automation, software quality, and robust development.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skillCategories.map((category, idx) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass-card p-8 rounded-3xl border border-white/5 hover:border-white/20 transition-all duration-300 group"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${category.color} text-background shadow-lg`}>
                  {category.icon}
                </div>
                <h3 className="text-2xl font-bold">{category.title}</h3>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {category.skills.map((skill, sIdx) => (
                  <motion.span
                    key={skill}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/90 font-medium hover:bg-white/10 hover:border-white/30 transition-all cursor-default"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
