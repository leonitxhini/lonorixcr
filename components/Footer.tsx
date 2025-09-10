export function Footer() {
  return (
    <footer className="glass-dark border-t border-blue-500/30 mt-20">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-yellow-500/20 rounded-lg blur-md -z-10"></div>
            <img 
              src="/crlogo.png" 
              alt="Lonorix CR Logo" 
              className="h-10 w-10 logo-glow logo-hover relative z-10"
            />
          </div>
          <p className="text-gray-300">
            © 2025 Lonorix CR. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}