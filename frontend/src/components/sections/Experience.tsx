import { motion } from "framer-motion";
import { Briefcase, Building2, Calendar, Star } from "lucide-react";

export function Experience() {
  return (
    <section id="experience" className="py-24 relative bg-black/20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Professional <span className="text-secondary">Experience</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-3xl blur-xl opacity-20" />
          
          <div className="glass-card rounded-3xl p-8 md:p-12 relative overflow-hidden border border-white/20">
            {/* Corner Decorative Element */}
            <div className="absolute top-0 right-0 bg-gradient-to-bl from-white/10 to-transparent w-48 h-48 rounded-bl-full pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-4">
              <div>
                <h3 className="text-2xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
                  <Briefcase className="text-primary w-8 h-8" />
                  Systems Software QA Engineer
                </h3>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-white/70 font-medium">
                  <span className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Hewlett Packard Enterprise (HPE), Bengaluru
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Feb 2024 – Sep 2025
                  </span>
                </div>
              </div>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/30 text-accent font-bold text-sm whitespace-nowrap">
                <Star className="w-4 h-4 fill-accent" />
                HPE Starpoints Awardee
              </span>
            </div>

            <ul className="space-y-4 text-lg text-white/80 leading-relaxed list-none">
              {[
                "Developed and maintained automated test suites under DTAF for DMF, a storage management solution using Python frameworks and Shell, increasing automation coverage from 57% to 74%.",
                "Led performance and regression testing initiatives, reviewed test plans, upgraded test clusters, and configured environments using Ansible.",
                "Collaborated cross-functionally to identify, document, and track 30+ high-impact defects and recommended feature enhancements.",
                "Validated RESTful APIs using Postman and automated scripts, ensuring data integrity and enabling scheduled, event-driven test execution.",
                "Designed and implemented GUI test automation for ClusterStor using Pytest and Selenium, reducing full test suite execution time to under 5 minutes.",
                "Contributed to filesystem help tab and footer verification automation, mentoring team members and establishing best practices."
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-primary shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
