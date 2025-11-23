import React from 'react';
import { ResumeData, TemplateType } from '../types';
import { MapPin, Mail, Phone, Globe } from 'lucide-react';

interface ResumePreviewProps {
  data: ResumeData;
  template: TemplateType;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ data, template }) => {
  // A4 Dimensions aspect ratio
  const containerClass = "bg-white w-full shadow-2xl mx-auto overflow-hidden print:shadow-none transition-all duration-500";
  // Roughly A4 ratio for web viewing, but in print media it expands
  const aspectClass = "aspect-[210/297] max-w-[21cm] min-h-[29.7cm]";
  
  const themeColor = data.themeColor || '#ea580c';
  const fontFamily = data.fontFamily || 'Inter, sans-serif';

  // Helper for RGB background with opacity
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '234, 88, 12';
  };

  const rgbColor = hexToRgb(themeColor);

  // --- MODERN LAYOUT ---
  if (template === TemplateType.MODERN) {
    return (
      <div id="resume-preview" className={`${containerClass} ${aspectClass} flex flex-col`} style={{ fontFamily }}>
        {/* Header */}
        <div className="text-white p-8 flex items-center gap-6" style={{ backgroundColor: '#0f172a' }}>
          {data.photoUrl && (
            <img 
              src={data.photoUrl} 
              alt="Profil" 
              className="w-24 h-24 rounded-full object-cover border-2"
              style={{ borderColor: themeColor }}
            />
          )}
          <div className="flex-1">
            <h1 className="text-4xl font-bold uppercase tracking-wider mb-2">{data.fullName || 'Votre Nom'}</h1>
            <p className="font-medium text-lg mb-4" style={{ color: themeColor }}>{data.experience[0]?.role || 'Titre Professionnel'}</p>
            
            <div className="flex flex-wrap gap-4 text-sm text-slate-300">
              {data.email && <div className="flex items-center gap-1"><Mail size={14} /> {data.email}</div>}
              {data.phone && <div className="flex items-center gap-1"><Phone size={14} /> {data.phone}</div>}
              {data.location && <div className="flex items-center gap-1"><MapPin size={14} /> {data.location}</div>}
              {data.website && <div className="flex items-center gap-1"><Globe size={14} /> {data.website}</div>}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 flex-1 grid grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="col-span-2 space-y-8">
            {data.summary && (
              <section>
                <h3 className="text-slate-900 font-bold uppercase tracking-wider border-b-2 pb-1 mb-3 text-sm" style={{ borderColor: themeColor }}>Profil</h3>
                <p className="text-slate-700 text-sm leading-relaxed">{data.summary}</p>
              </section>
            )}

            <section>
              <h3 className="text-slate-900 font-bold uppercase tracking-wider border-b-2 pb-1 mb-4 text-sm" style={{ borderColor: themeColor }}>Expérience</h3>
              <div className="space-y-6">
                {data.experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-bold text-slate-800">{exp.role}</h4>
                      <span className="text-xs text-slate-500 font-medium">{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <p className="font-medium text-sm mb-2" style={{ color: themeColor }}>{exp.company}</p>
                    <p className="text-slate-600 text-sm whitespace-pre-line">{exp.description}</p>
                  </div>
                ))}
                {data.experience.length === 0 && <p className="text-slate-400 italic text-sm">Ajoutez votre expérience professionnelle...</p>}
              </div>
            </section>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
             <section>
              <h3 className="text-slate-900 font-bold uppercase tracking-wider border-b-2 pb-1 mb-3 text-sm" style={{ borderColor: themeColor }}>Formation</h3>
              <div className="space-y-4">
                {data.education.map((edu) => (
                  <div key={edu.id}>
                    <h4 className="font-bold text-slate-800 text-sm">{edu.school}</h4>
                    <p className="text-slate-600 text-xs">{edu.degree}</p>
                    <p className="text-slate-400 text-xs">{edu.year}</p>
                  </div>
                ))}
                 {data.education.length === 0 && <p className="text-slate-400 italic text-sm">Ajoutez une formation...</p>}
              </div>
            </section>

            <section>
              <h3 className="text-slate-900 font-bold uppercase tracking-wider border-b-2 pb-1 mb-3 text-sm" style={{ borderColor: themeColor }}>Compétences</h3>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, idx) => (
                  <span key={idx} className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-medium">
                    {skill}
                  </span>
                ))}
                 {data.skills.length === 0 && <p className="text-slate-400 italic text-sm">Listez vos compétences...</p>}
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }

  // --- CREATIVE LAYOUT ---
  if (template === TemplateType.CREATIVE) {
    return (
      <div id="resume-preview" className={`${containerClass} ${aspectClass} grid grid-cols-12`} style={{ fontFamily }}>
        {/* Sidebar */}
        <div className="col-span-4 text-white p-6 flex flex-col h-full" style={{ backgroundColor: '#1e1b4b' }}>
          <div className="flex flex-col items-center text-center mb-8">
            {data.photoUrl ? (
              <img 
                src={data.photoUrl} 
                alt="Profil" 
                className="w-32 h-32 rounded-full object-cover border-4 mb-4 shadow-lg"
                style={{ borderColor: themeColor }}
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-slate-800 mb-4 flex items-center justify-center text-slate-400">
                Photo
              </div>
            )}
            <h1 className="text-xl font-bold leading-tight mb-1">{data.fullName || 'Votre Nom'}</h1>
            <p className="text-slate-300 text-sm" style={{ color: themeColor }}>{data.experience[0]?.role || 'Rôle'}</p>
          </div>

          <div className="space-y-6 text-sm">
             <div>
               <h3 className="font-bold text-slate-300 uppercase tracking-widest text-xs mb-3 border-b border-slate-700 pb-1">Contact</h3>
               <div className="space-y-2 text-slate-100">
                  {data.email && <div className="break-all">{data.email}</div>}
                  {data.phone && <div>{data.phone}</div>}
                  {data.location && <div>{data.location}</div>}
                  {data.website && <div className="break-all">{data.website}</div>}
               </div>
             </div>

             <div>
               <h3 className="font-bold text-slate-300 uppercase tracking-widest text-xs mb-3 border-b border-slate-700 pb-1">Compétences</h3>
               <div className="flex flex-wrap gap-1.5">
                  {data.skills.map((skill, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded text-xs text-white" style={{ backgroundColor: themeColor }}>
                      {skill}
                    </span>
                  ))}
               </div>
             </div>

             <div>
               <h3 className="font-bold text-slate-300 uppercase tracking-widest text-xs mb-3 border-b border-slate-700 pb-1">Formation</h3>
               <div className="space-y-3">
                  {data.education.map((edu) => (
                    <div key={edu.id}>
                      <div className="font-bold text-slate-100">{edu.school}</div>
                      <div className="text-slate-400 text-xs">{edu.degree}</div>
                      <div className="text-slate-500 text-xs">{edu.year}</div>
                    </div>
                  ))}
               </div>
             </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-8 p-8 bg-slate-50">
           {data.summary && (
             <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-slate-100">
                <h3 className="text-slate-900 font-bold uppercase tracking-wider text-sm mb-3 flex items-center gap-2">
                   <span className="w-8 h-1 rounded-full" style={{ backgroundColor: themeColor }}></span> À propos de moi
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">{data.summary}</p>
             </div>
           )}

           <div>
              <h3 className="text-slate-900 font-bold uppercase tracking-wider text-sm mb-6 flex items-center gap-2">
                 <span className="w-8 h-1 rounded-full" style={{ backgroundColor: themeColor }}></span> Historique professionnel
              </h3>
              <div className="space-y-6">
                 {data.experience.map((exp) => (
                    <div key={exp.id} className="relative pl-6 border-l-2 border-slate-200 pb-6 last:pb-0">
                       <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full border-4 border-slate-100" style={{ backgroundColor: themeColor }}></div>
                       <div className="flex justify-between items-start mb-2">
                          <div>
                             <h4 className="text-lg font-bold text-slate-800 leading-none">{exp.role}</h4>
                             <div className="font-medium text-sm mt-1" style={{ color: themeColor }}>{exp.company}</div>
                          </div>
                          <span className="text-xs font-bold text-slate-400 bg-slate-200 px-2 py-1 rounded">{exp.startDate} - {exp.endDate}</span>
                       </div>
                       <p className="text-slate-600 text-sm mt-2">{exp.description}</p>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    );
  }

  // --- MINIMAL LAYOUT ---
  if (template === TemplateType.MINIMAL) {
    return (
      <div id="resume-preview" className={`${containerClass} ${aspectClass} p-12 bg-white text-neutral-800 flex flex-col items-center text-center`} style={{ fontFamily }}>
        {data.photoUrl && (
          <img 
            src={data.photoUrl} 
            alt="Profil" 
            className="w-28 h-28 rounded-full object-cover mb-6 shadow-sm"
          />
        )}
        
        <h1 className="text-3xl font-light uppercase tracking-[0.2em] mb-2" style={{ color: themeColor }}>{data.fullName || 'Votre Nom'}</h1>
        <p className="text-neutral-500 text-sm tracking-widest uppercase mb-6">{data.experience[0]?.role}</p>

        <div className="flex justify-center gap-4 text-xs text-neutral-400 mb-10 border-t border-b border-neutral-100 py-4 w-full max-w-lg">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>{data.phone}</span>}
          {data.location && <span>{data.location}</span>}
          {data.website && <span>{data.website}</span>}
        </div>

        <div className="w-full text-left max-w-3xl space-y-10">
           {data.summary && (
             <div className="text-center max-w-xl mx-auto">
               <p className="text-sm leading-7 text-neutral-600">{data.summary}</p>
             </div>
           )}

           <div className="grid grid-cols-12 gap-8">
              <div className="col-span-12">
                 <h3 className="text-xs font-bold uppercase tracking-widest mb-6 text-center" style={{ color: themeColor }}>Expérience</h3>
                 <div className="space-y-8">
                    {data.experience.map((exp) => (
                      <div key={exp.id} className="grid grid-cols-4 gap-4">
                         <div className="col-span-1 text-right text-xs text-neutral-400 pt-1">
                            {exp.startDate} — {exp.endDate}
                         </div>
                         <div className="col-span-3">
                            <h4 className="font-semibold text-sm text-neutral-800">{exp.role}</h4>
                            <p className="text-xs italic text-neutral-500 mb-2" style={{ color: themeColor }}>{exp.company}</p>
                            <p className="text-sm text-neutral-600 font-light">{exp.description}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-12 pt-8 border-t border-neutral-100">
              <div>
                 <h3 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: themeColor }}>Formation</h3>
                 <div className="space-y-4">
                    {data.education.map((edu) => (
                       <div key={edu.id}>
                          <h4 className="font-medium text-sm">{edu.school}</h4>
                          <p className="text-xs text-neutral-500">{edu.degree}, {edu.year}</p>
                       </div>
                    ))}
                 </div>
              </div>
              <div>
                 <h3 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: themeColor }}>Compétences</h3>
                 <div className="flex flex-wrap gap-x-4 gap-y-2">
                    {data.skills.map((skill, idx) => (
                       <span key={idx} className="text-sm text-neutral-600 font-light">{skill}</span>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </div>
    );
  }

  // --- ELEGANT LAYOUT ---
  if (template === TemplateType.ELEGANT) {
    return (
      <div id="resume-preview" className={`${containerClass} ${aspectClass} grid grid-cols-3 bg-[#f8f9fa]`} style={{ fontFamily }}>
        <div className="col-span-1 text-white p-8 flex flex-col h-full" style={{ backgroundColor: themeColor }}>
           {data.photoUrl && (
              <img src={data.photoUrl} alt="Profil" className="w-32 h-32 rounded-lg object-cover mx-auto mb-8 border-4 border-white/10" />
           )}
           
           <div className="space-y-8">
              <div>
                 <h3 className="text-white/80 uppercase tracking-widest text-xs font-bold mb-4">Contact</h3>
                 <div className="space-y-3 text-sm font-light text-white/80">
                    {data.email && <div className="flex items-center gap-2"><Mail size={12} /> <span className="break-all">{data.email}</span></div>}
                    {data.phone && <div className="flex items-center gap-2"><Phone size={12} /> {data.phone}</div>}
                    {data.location && <div className="flex items-center gap-2"><MapPin size={12} /> {data.location}</div>}
                    {data.website && <div className="flex items-center gap-2"><Globe size={12} /> <span className="break-all">{data.website}</span></div>}
                 </div>
              </div>

              <div>
                 <h3 className="text-white/80 uppercase tracking-widest text-xs font-bold mb-4">Formation</h3>
                 <div className="space-y-4">
                    {data.education.map((edu) => (
                       <div key={edu.id}>
                          <div className="font-medium text-sm">{edu.school}</div>
                          <div className="text-white/70 text-xs">{edu.degree}</div>
                          <div className="text-white/60 text-xs italic">{edu.year}</div>
                       </div>
                    ))}
                 </div>
              </div>

              <div>
                 <h3 className="text-white/80 uppercase tracking-widest text-xs font-bold mb-4">Expertise</h3>
                 <ul className="space-y-2">
                    {data.skills.map((skill, idx) => (
                       <li key={idx} className="text-sm font-light text-white/80 border-b border-white/10 pb-1">{skill}</li>
                    ))}
                 </ul>
              </div>
           </div>
        </div>

        <div className="col-span-2 p-10">
           <div className="border-b-2 pb-6 mb-8" style={{ borderColor: themeColor }}>
              <h1 className="text-4xl font-bold mb-2" style={{ color: '#2c3e50' }}>{data.fullName || 'VOTRE NOM'}</h1>
              <p className="text-lg text-gray-500 tracking-wide uppercase">{data.experience[0]?.role}</p>
           </div>

           {data.summary && (
              <div className="mb-10">
                 <h3 className="font-bold uppercase tracking-widest text-sm mb-4" style={{ color: themeColor }}>Profil</h3>
                 <p className="text-gray-600 leading-relaxed">{data.summary}</p>
              </div>
           )}

           <div>
              <h3 className="font-bold uppercase tracking-widest text-sm mb-6" style={{ color: themeColor }}>Expérience Professionnelle</h3>
              <div className="space-y-8">
                 {data.experience.map((exp) => (
                    <div key={exp.id}>
                       <div className="flex justify-between items-baseline mb-2">
                          <h4 className="text-lg font-bold text-gray-800">{exp.role}</h4>
                          <span className="text-sm text-gray-500 italic">{exp.startDate} – {exp.endDate}</span>
                       </div>
                       <div className="font-medium text-sm mb-2" style={{ color: themeColor }}>{exp.company}</div>
                       <p className="text-gray-600 text-sm leading-relaxed">{exp.description}</p>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    );
  }

  // Default Classic Layout
  return (
    <div id="resume-preview" className={`${containerClass} ${aspectClass} bg-white p-12 text-slate-800`} style={{ fontFamily }}>
      <div className="text-center border-b border-slate-300 pb-8 mb-8">
        <h1 className="text-3xl font-bold mb-2">{data.fullName || 'Votre Nom'}</h1>
        <div className="flex justify-center gap-4 text-sm text-slate-600">
           {data.email && <span>{data.email}</span>}
           {data.phone && <span>• {data.phone}</span>}
           {data.location && <span>• {data.location}</span>}
        </div>
      </div>

      {data.summary && (
        <div className="mb-8">
          <h3 className="font-bold text-lg mb-3 uppercase text-sm tracking-widest" style={{ color: themeColor }}>Résumé</h3>
          <p className="text-sm leading-relaxed text-slate-700">{data.summary}</p>
        </div>
      )}

      <div className="mb-8">
        <h3 className="font-bold text-lg mb-4 uppercase text-sm tracking-widest" style={{ color: themeColor }}>Expérience</h3>
        <div className="space-y-6">
          {data.experience.map((exp) => (
            <div key={exp.id}>
              <div className="flex justify-between mb-1">
                <h4 className="font-bold text-slate-900">{exp.company}</h4>
                <span className="text-sm text-slate-600 italic">{exp.startDate} – {exp.endDate}</span>
              </div>
              <p className="text-sm font-semibold mb-2" style={{ color: themeColor }}>{exp.role}</p>
              <p className="text-sm text-slate-600 leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-8">
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-4 uppercase text-sm tracking-widest" style={{ color: themeColor }}>Formation</h3>
          <div className="space-y-4">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <h4 className="font-bold text-slate-900 text-sm">{edu.school}</h4>
                <p className="text-sm text-slate-700">{edu.degree}</p>
                <span className="text-xs text-slate-500">{edu.year}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1">
           <h3 className="font-bold text-lg mb-4 uppercase text-sm tracking-widest" style={{ color: themeColor }}>Compétences</h3>
           <p className="text-sm text-slate-700 leading-relaxed">
             {data.skills.join(', ')}
           </p>
        </div>
      </div>
    </div>
  );
};