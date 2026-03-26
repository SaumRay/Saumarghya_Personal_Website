import { useState } from "react";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import {
  LayoutDashboard, FolderKanban, Mail, Images, BookOpen,
  User, LogOut, Menu, X, ChevronRight
} from "lucide-react";

export type AdminTab = "overview" | "projects" | "messages" | "gallery" | "notes" | "profile";

interface AdminLayoutProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  children: React.ReactNode;
}

const navItems: { id: AdminTab; label: string; icon: React.ReactNode; badge?: number }[] = [
  { id: "overview", label: "Overview", icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: "projects", label: "Projects", icon: <FolderKanban className="w-5 h-5" /> },
  { id: "gallery", label: "Gallery", icon: <Images className="w-5 h-5" /> },
  { id: "notes", label: "Notes & Posts", icon: <BookOpen className="w-5 h-5" /> },
  { id: "messages", label: "Messages", icon: <Mail className="w-5 h-5" /> },
  { id: "profile", label: "Profile", icon: <User className="w-5 h-5" /> },
];

export function AdminLayout({ activeTab, onTabChange, children }: AdminLayoutProps) {
  const { logout } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 glass-card border-r border-white/10 flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-background font-bold text-sm">SR</span>
            </div>
            <div>
              <p className="font-bold text-foreground text-sm">Admin Panel</p>
              <p className="text-foreground/40 text-xs">saumarghya.dev</p>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { onTabChange(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === item.id
                  ? "bg-primary/20 text-primary border border-primary/20"
                  : "text-foreground/60 hover:text-foreground hover:bg-foreground/5"
              }`}
            >
              {item.icon}
              <span className="flex-1 text-left">{item.label}</span>
              {activeTab === item.id && <ChevronRight className="w-4 h-4" />}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 glass-card border-b border-white/10 px-6 py-4 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-foreground/60 hover:text-foreground">
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold text-foreground capitalize">
            {navItems.find((n) => n.id === activeTab)?.label}
          </h1>
          <div className="ml-auto flex items-center gap-2">
            <a href="/" target="_blank" rel="noreferrer" className="text-xs text-foreground/40 hover:text-primary transition-colors">
              View Site →
            </a>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
