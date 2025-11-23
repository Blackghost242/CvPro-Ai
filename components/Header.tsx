import React, { useState, useEffect } from 'react';
import { FileText, User, Sun, Moon } from 'lucide-react';

export const Header: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 no-print transition-colors duration-300">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <a href="#/" className="flex items-center gap-2 group">
          <div className="bg-primary p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-yellow-500">
            CVPro AI
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-6">
          <a href="#/" className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-medium text-sm transition-colors">Modèles</a>
          <a href="#/builder" className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-medium text-sm transition-colors">Créateur</a>
          <a href="#" className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-medium text-sm transition-colors">Tarifs</a>
        </nav>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsDark(!isDark)}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle Dark Mode"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <a href="#/builder" className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-slate-900 dark:bg-primary rounded-full hover:bg-slate-800 dark:hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40">
            Créer un CV
          </a>
          <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};