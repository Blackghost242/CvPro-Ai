import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { TemplateGallery } from './components/TemplateGallery';
import { ResumeBuilder } from './components/ResumeBuilder';
import { FadeIn } from './components/ui/FadeIn';

const LandingPage: React.FC = () => (
  <div className="min-h-screen bg-slate-50">
    <Header />
    <Hero />
    <TemplateGallery />
    <footer className="bg-white border-t border-slate-200 py-12">
      <FadeIn>
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500">
          <p>&copy; {new Date().getFullYear()} CVPro AI by Akiradesign242. Tous droits réservés.</p>
        </div>
      </FadeIn>
    </footer>
  </div>
);

const App: React.FC = () => {
  const [route, setRoute] = useState(window.location.hash);

  useEffect(() => {
    const onHashChange = () => setRoute(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return route === '#/builder' ? <ResumeBuilder /> : <LandingPage />;
};

export default App;