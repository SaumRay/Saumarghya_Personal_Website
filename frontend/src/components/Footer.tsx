export function Footer() {
  return (
    <footer className="py-8 border-t border-white/10 bg-black/40 text-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-white/50 text-sm">
          &copy; {new Date().getFullYear()} Saumarghya Ray. All rights reserved.
        </p>
        <p className="text-white/30 text-xs mt-2">
          Designed with intent and built with React.
        </p>
      </div>
    </footer>
  );
}
