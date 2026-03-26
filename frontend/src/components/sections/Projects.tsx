import { motion } from "framer-motion";
import { Github, ExternalLink, Code, Star, GitFork, Users, BookOpen, Activity, Search, X } from "lucide-react";
import { useState, useEffect, useMemo } from "react";

const projectsData = [
  {
    title: "Personal Finance Copilot",
    tech: ["React", "FastAPI", "Ollama LLM", "Playwright", "GitHub Actions"],
    desc: "Full-stack finance analytics app with React frontend, FastAPI backend, and JWT authentication. Integrated Ollama LLM for AI-powered chat and financial insights with PDF/CSV report generation. Built 130 end-to-end Playwright tests with a GitHub Actions CI/CD pipeline achieving 100% pass rate.",
    github: "https://github.com/SaumRay/personal_finance_Tests",
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Movie Review API Automation",
    tech: ["Java", "REST Assured", "TestNG", "Maven"],
    desc: "Built a REST API test suite simulating a Movie Review app, automating GET, POST, PUT, PATCH, and DELETE operations with status code validation, response body assertions, JSON extraction, and negative test cases.",
    github: "https://github.com/SaumRay/RestAssured-API-Testing",
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Playwright E-Commerce Suite",
    tech: ["Playwright", "JavaScript", "GitHub Actions"],
    desc: "Built a 92-test end-to-end automation framework using Playwright with the Page Object Model pattern, covering login, cart, checkout, and full user journey flows across Chromium and Firefox with pixel-level visual regression testing. GitHub Actions CI/CD pipeline auto-triggers on every push.",
    github: "https://github.com/SaumRay/Playwright_ecommerce_Tests",
    color: "from-emerald-500 to-teal-500",
  },
];

const GITHUB_USERNAME = "SaumRay";

interface GitHubProfile {
  public_repos: number;
  followers: number;
  following: number;
  public_gists: number;
}

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  language: string | null;
  topics: string[];
  updated_at: string;
  fork: boolean;
}

const langColors: Record<string, string> = {
  Python: "#3572A5",
  JavaScript: "#f1e05a",
  TypeScript: "#2b7489",
  Java: "#b07219",
  Kotlin: "#A97BFF",
  C: "#555555",
  Shell: "#89e051",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Default: "#8b949e",
};

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="flex flex-col items-center gap-2 bg-foreground/5 border border-foreground/10 rounded-2xl p-5 hover:border-cyan-500/40 transition-all duration-300"
    >
      <div className="text-cyan-400">{icon}</div>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      <div className="text-xs text-foreground/50 uppercase tracking-wider">{label}</div>
    </motion.div>
  );
}

export function Projects() {
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  // Derive all unique tech tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    projectsData.forEach((p) => p.tech.forEach((t) => tags.add(t)));
    return ["All", ...Array.from(tags).sort()];
  }, []);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return projectsData.filter((p) => {
      const matchesFilter = activeFilter === "All" || p.tech.includes(activeFilter);
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q) ||
        p.tech.some((t) => t.toLowerCase().includes(q));
      return matchesFilter && matchesSearch;
    });
  }, [searchQuery, activeFilter]);

  useEffect(() => {
    async function fetchGitHub() {
      try {
        const [profileRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}`),
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6&type=owner`),
        ]);
        if (profileRes.ok) setProfile(await profileRes.json());
        if (reposRes.ok) {
          const data: GitHubRepo[] = await reposRes.json();
          setRepos(data.filter((r) => !r.fork).slice(0, 6));
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    fetchGitHub();
  }, []);

  return (
    <section id="projects" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">
            Featured <span className="text-accent">Projects</span>
          </h2>
          <p className="text-foreground/60 max-w-2xl mx-auto">
            A showcase of my full-stack capabilities, automation frameworks, and problem-solving implementations.
          </p>
        </motion.div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6 max-w-xl mx-auto"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects by name, tech, or description..."
              className="w-full pl-11 pr-10 py-3 rounded-full bg-foreground/5 border border-foreground/10 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>

        {/* Filter tags */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 flex flex-wrap gap-2 justify-center"
        >
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveFilter(tag)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
                activeFilter === tag
                  ? "bg-primary text-background border-primary shadow-[0_0_12px_rgba(0,240,255,0.4)]"
                  : "bg-foreground/5 border-foreground/10 text-foreground/70 hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {tag}
            </button>
          ))}
        </motion.div>

        {/* Project Cards */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
            {filteredProjects.map((project, idx) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass-card rounded-3xl flex flex-col overflow-hidden group border-foreground/10 hover:border-foreground/30 transition-all duration-500"
              >
                <div className={`h-2 w-full bg-gradient-to-r ${project.color}`} />
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${project.color} bg-opacity-20 backdrop-blur-md`}>
                      <Code className="w-6 h-6 text-white" />
                    </div>
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-full bg-foreground/5 hover:bg-foreground/20 transition-colors text-foreground"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-foreground group-hover:to-foreground/50 transition-all">
                    {project.title}
                  </h3>
                  <p className="text-foreground/70 mb-6 flex-grow leading-relaxed">{project.desc}</p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {project.tech.map((t) => (
                      <button
                        key={t}
                        onClick={() => { setActiveFilter(t); setSearchQuery(""); }}
                        className="px-3 py-1 rounded-md text-xs font-medium bg-foreground/5 text-foreground/80 border border-foreground/10 hover:border-primary/40 hover:text-primary transition-colors cursor-pointer"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 mb-32"
          >
            <p className="text-foreground/40 text-lg">No projects found for <span className="text-primary">"{searchQuery || activeFilter}"</span></p>
            <button
              onClick={() => { setSearchQuery(""); setActiveFilter("All"); }}
              className="mt-4 px-6 py-2 rounded-full text-sm border border-foreground/10 text-foreground/60 hover:text-foreground hover:border-primary/40 transition-all"
            >
              Clear filters
            </button>
          </motion.div>
        )}

        {/* GitHub Stats Section */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 bg-foreground/5 border border-foreground/10 rounded-full px-6 py-2 mb-6">
              <Github className="w-5 h-5 text-cyan-400" />
              <span className="text-foreground/70 text-sm font-medium">Open Source Activity</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">
              GitHub <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Stats</span>
            </h2>
            <p className="text-foreground/50 max-w-xl mx-auto text-sm">Live data pulled directly from GitHub — repos, contributions, and coding streaks.</p>
          </div>

          {profile && (
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
              <StatCard icon={<BookOpen className="w-6 h-6" />} label="Public Repos" value={profile.public_repos} />
              <StatCard icon={<Users className="w-6 h-6" />} label="Followers" value={profile.followers} />
              <StatCard icon={<Activity className="w-6 h-6" />} label="Following" value={profile.following} />
              <StatCard icon={<Star className="w-6 h-6" />} label="Public Gists" value={profile.public_gists} />
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="rounded-2xl overflow-hidden border border-foreground/10 bg-foreground/5 p-4 flex items-center justify-center">
              <img src={`https://github-readme-stats.vercel.app/api?username=${GITHUB_USERNAME}&show_icons=true&theme=radical&hide_border=true&bg_color=00000000&title_color=22d3ee&icon_color=a855f7&text_color=ffffff&rank_icon=github`} alt="GitHub Stats" className="w-full max-w-md" loading="lazy" />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="rounded-2xl overflow-hidden border border-foreground/10 bg-foreground/5 p-4 flex items-center justify-center">
              <img src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${GITHUB_USERNAME}&layout=compact&theme=radical&hide_border=true&bg_color=00000000&title_color=22d3ee&text_color=ffffff&langs_count=8`} alt="Top Languages" className="w-full max-w-md" loading="lazy" />
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-2xl overflow-hidden border border-foreground/10 bg-foreground/5 p-4 flex items-center justify-center mb-12">
            <img src={`https://github-readme-streak-stats.herokuapp.com/?user=${GITHUB_USERNAME}&theme=radical&hide_border=true&background=00000000&stroke=ffffff10&ring=22d3ee&fire=a855f7&currStreakLabel=22d3ee&sideLabels=ffffff80&dates=ffffff60&currStreakNum=ffffff&sideNums=ffffff`} alt="GitHub Streak" className="w-full max-w-2xl" loading="lazy" />
          </motion.div>

          {!loading && repos.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Github className="w-5 h-5 text-cyan-400" /> Recent Repositories
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {repos.map((repo, idx) => (
                  <motion.a
                    key={repo.id}
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    className="group block bg-foreground/5 border border-foreground/10 rounded-2xl p-5 hover:border-cyan-500/40 hover:bg-foreground/8 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span className="font-semibold text-foreground text-sm truncate group-hover:text-cyan-400 transition-colors">{repo.name}</span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-foreground/30 group-hover:text-foreground/70 transition-colors shrink-0 ml-2" />
                    </div>
                    {repo.description && <p className="text-foreground/50 text-xs mb-4 leading-relaxed line-clamp-2">{repo.description}</p>}
                    <div className="flex items-center gap-4 text-xs text-foreground/40">
                      {repo.language && (
                        <span className="flex items-center gap-1">
                          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: langColors[repo.language] ?? langColors.Default }} />
                          {repo.language}
                        </span>
                      )}
                      {repo.stargazers_count > 0 && <span className="flex items-center gap-1"><Star className="w-3 h-3" /> {repo.stargazers_count}</span>}
                      {repo.forks_count > 0 && <span className="flex items-center gap-1"><GitFork className="w-3 h-3" /> {repo.forks_count}</span>}
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>
          )}

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mt-10">
            <a
              href={`https://github.com/${GITHUB_USERNAME}?tab=repositories`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground/5 border border-foreground/10 text-foreground/70 hover:text-foreground hover:border-cyan-500/40 hover:bg-foreground/10 transition-all duration-300 text-sm font-medium"
            >
              <Github className="w-4 h-4" /> View All Repositories on GitHub
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
