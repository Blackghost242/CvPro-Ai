import React from 'react';
import { CheckCircle, ArrowRight, Star, Wand2 } from 'lucide-react';
import { FadeIn } from './ui/FadeIn';

export const Hero: React.FC = () => {
  return (
    <div className="relative bg-white overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-y-0 right-0 w-1/2 bg-slate-50 rounded-l-3xl transform translate-x-1/4" />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
            <FadeIn direction="up">
               <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-sm font-semibold mb-6">
                 <Star size={14} className="mr-1 fill-orange-600" />
                 Classé N°1 Créateur de CV IA
               </div>
            </FadeIn>
            
            <FadeIn direction="up" delay={100}>
              <h1 className="text-4xl tracking-tight font-extrabold text-slate-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
                <span className="block">Créez un CV pour</span>
                <span className="block text-primary">vous faire embaucher</span>
              </h1>
            </FadeIn>

            <FadeIn direction="up" delay={200}>
              <p className="mt-3 text-base text-slate-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Créez un CV professionnel en quelques minutes avec notre générateur IA. 
                Laissez Gemini rédiger vos descriptions pendant que vous vous concentrez sur votre carrière.
              </p>
            </FadeIn>

            <FadeIn direction="up" delay={300}>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <div className="space-y-4 sm:space-y-0 sm:flex sm:gap-4">
                  <a href="#/builder" className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary hover:bg-orange-700 md:py-4 md:text-lg md:px-10 shadow-lg shadow-orange-500/30 transition-all">
                    Créer mon CV
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </a>
                   <a href="#" className="flex items-center justify-center px-8 py-3 border border-slate-200 text-base font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 md:py-4 md:text-lg md:px-10">
                    Voir les modèles
                  </a>
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="up" delay={400}>
              <div className="mt-8 border-t border-slate-200 pt-6">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Rédaction par IA
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Modèles compatibles ATS
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Aperçu en temps réel
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Export PDF
                    </div>
                 </div>
              </div>
            </FadeIn>
          </div>
          
          <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
             <FadeIn direction="left" delay={500} className="w-full">
               <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                  <div className="relative block w-full bg-white rounded-lg overflow-hidden">
                     <div className="bg-slate-100 p-2 border-b flex gap-1.5">
                       <div className="w-3 h-3 rounded-full bg-red-400"></div>
                       <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                       <div className="w-3 h-3 rounded-full bg-green-400"></div>
                     </div>
                     <div className="p-6 space-y-4 opacity-50 blur-[1px]">
                        <div className="h-8 bg-slate-200 w-3/4 rounded"></div>
                        <div className="h-4 bg-slate-200 w-1/2 rounded"></div>
                        <div className="space-y-2 pt-4">
                          <div className="h-3 bg-slate-200 rounded"></div>
                          <div className="h-3 bg-slate-200 rounded"></div>
                          <div className="h-3 bg-slate-200 w-5/6 rounded"></div>
                        </div>
                     </div>
                     {/* Floating Card */}
                     <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-6 w-64 border border-orange-100">
                        <div className="flex items-start gap-3">
                          <div className="bg-orange-100 p-2 rounded-lg">
                             <Wand2 className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                             <p className="text-sm font-semibold text-slate-900">Assistant IA</p>
                             <p className="text-xs text-slate-500 mt-1">"Améliore ce point pour qu'il soit plus percutant..."</p>
                          </div>
                        </div>
                        <div className="mt-3 h-1.5 w-full bg-orange-100 rounded-full overflow-hidden">
                           <div className="h-full bg-primary w-2/3 rounded-full animate-pulse"></div>
                        </div>
                     </div>
                  </div>
               </div>
             </FadeIn>
          </div>
        </div>
      </div>
    </div>
  );
};