import React from 'react';
import { Template, TemplateType } from '../types';
import { FadeIn } from './ui/FadeIn';

const templates: Template[] = [
  {
    id: '1',
    name: 'Moderne Professionnel',
    type: TemplateType.MODERN,
    price: 550,
    isPremium: true,
    thumbnail: 'bg-slate-800',
  },
  {
    id: '2',
    name: 'Élégance Classique',
    type: TemplateType.CLASSIC,
    price: 550,
    isPremium: true,
    thumbnail: 'bg-white border border-slate-200',
  },
  {
    id: '3',
    name: 'Studio Créatif',
    type: TemplateType.CREATIVE,
    price: 550,
    isPremium: true,
    thumbnail: 'bg-orange-50',
  },
  {
    id: '4',
    name: 'Air Minimaliste',
    type: TemplateType.MINIMAL,
    price: 550,
    isPremium: true,
    thumbnail: 'bg-slate-50',
  },
  {
    id: '5',
    name: 'Suite Exécutive',
    type: TemplateType.ELEGANT,
    price: 550,
    isPremium: true,
    thumbnail: 'bg-[#2c3e50]',
  },
];

export const TemplateGallery: React.FC = () => {
  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-12">
            <h2 className="text-base font-semibold text-primary tracking-wide uppercase">Modèles</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Des designs éprouvés pour chaque carrière
            </p>
            <p className="mt-4 max-w-2xl text-xl text-slate-500 dark:text-slate-400 mx-auto">
              Choisissez parmi notre collection de modèles de CV compatibles ATS conçus par des professionnels RH.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template, index) => (
            <FadeIn key={template.id} delay={index * 100} direction="up">
              <div className="group relative bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 overflow-hidden border border-slate-200 dark:border-slate-700 h-full transform hover:-translate-y-1">
                <div className={`h-80 w-full ${template.thumbnail} flex items-center justify-center relative transition-colors duration-300`}>
                   {/* Mock visual of resume inside */}
                   <div className="w-32 h-44 bg-white shadow-lg transform group-hover:scale-110 group-hover:rotate-1 transition-all duration-500 flex flex-col p-2 gap-2 opacity-90">
                      <div className="h-2 bg-slate-300 w-full rounded-sm"></div>
                      <div className="h-2 bg-slate-200 w-1/2 rounded-sm mb-2"></div>
                      <div className="h-1 bg-slate-100 w-full rounded-sm"></div>
                      <div className="h-1 bg-slate-100 w-full rounded-sm"></div>
                      <div className="h-1 bg-slate-100 w-full rounded-sm"></div>
                      <div className="mt-auto h-8 bg-orange-50 w-full rounded-sm"></div>
                   </div>
                   
                   <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 backdrop-blur-[2px] transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <a href="#/builder" className="bg-white text-slate-900 px-6 py-3 rounded-full font-bold transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-primary hover:text-white shadow-lg">
                         Utiliser ce modèle
                      </a>
                   </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{template.name}</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                      {template.price} FCFA
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Parfait pour les rôles {template.type.toLowerCase()} et divers secteurs.
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};