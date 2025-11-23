import React, { useState, useCallback, useEffect } from 'react';
import { ResumeData, TemplateType, Experience, Education } from '../types';
import { ResumePreview } from './ResumePreview';
import { Button } from './ui/Button';
import { generateResumeSummary, improveJobDescription } from '../services/gemini';
import { Wand2, Plus, Trash2, ChevronLeft, Download, Printer, Upload, Lock, CreditCard, Check, Smartphone, Loader2, Palette, Type as TypeIcon, FileDown, Cloud, RotateCcw, AlertCircle } from 'lucide-react';

const initialData: ResumeData = {
  fullName: '',
  email: '',
  phone: '',
  location: '',
  website: '',
  summary: '',
  photoUrl: '',
  experience: [],
  education: [],
  skills: [],
  themeColor: '#ea580c', // Orange default
  fontFamily: 'Inter, sans-serif'
};

const COLORS = [
  '#ea580c', // Orange (Default)
  '#f59e0b', // Amber
  '#4f46e5', // Indigo
  '#2563eb', // Blue
  '#0891b2', // Cyan
  '#059669', // Emerald
  '#db2777', // Pink
  '#e11d48', // Rose
  '#1e293b', // Slate
];

const FONTS = [
  { name: 'Moderne (Inter)', value: 'Inter, sans-serif' },
  { name: 'Sérif (Merriweather)', value: 'Merriweather, serif' },
  { name: 'Humaniste (Lato)', value: 'Lato, sans-serif' },
  { name: 'Classique (Playfair)', value: '"Playfair Display", serif' },
  { name: 'Neutre (Roboto)', value: 'Roboto, sans-serif' },
  { name: 'Ouvert (Open Sans)', value: '"Open Sans", sans-serif' },
  { name: 'Pro (Montserrat)', value: 'Montserrat, sans-serif' },
  { name: 'Manuscrit (Dancing Script)', value: '"Dancing Script", cursive' },
];

export const ResumeBuilder: React.FC = () => {
  // Initialize state from localStorage if available
  const [data, setData] = useState<ResumeData>(() => {
    const saved = localStorage.getItem('resume-data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved resume data", e);
        return initialData;
      }
    }
    return initialData;
  });

  const [activeTab, setActiveTab] = useState<'personnel' | 'expérience' | 'formation' | 'compétences' | 'design'>('personnel');
  const [loadingAI, setLoadingAI] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>(TemplateType.MODERN);
  const [isSaved, setIsSaved] = useState(true);
  
  // Payment & Download State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'input' | 'processing' | 'success'>('input');
  const [userPhone, setUserPhone] = useState('');
  const [provider, setProvider] = useState<'MTN' | 'AIRTEL'>('MTN');
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  // --- Auto-Save Effect ---
  useEffect(() => {
    const saveData = () => {
      localStorage.setItem('resume-data', JSON.stringify(data));
      setIsSaved(true);
    };

    setIsSaved(false);
    const timeoutId = setTimeout(saveData, 500); // Debounce save

    return () => clearTimeout(timeoutId);
  }, [data]);

  // --- Handlers ---

  const handleReset = () => {
    if (window.confirm("Êtes-vous sûr de vouloir réinitialiser tout le CV ? Cette action est irréversible.")) {
      setData(initialData);
      localStorage.removeItem('resume-data');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const updateField = (field: keyof ResumeData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateField('photoUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addExperience = () => {
    const newExp: Experience = {
      id: crypto.randomUUID(),
      company: 'Nom de l\'entreprise',
      role: 'Intitulé du poste',
      startDate: '',
      endDate: '',
      description: ''
    };
    setData(prev => ({ ...prev, experience: [...prev.experience, newExp] }));
  };

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    setData(prev => ({
      ...prev,
      experience: prev.experience.map(e => e.id === id ? { ...e, [field]: value } : e)
    }));
  };

  const removeExperience = (id: string) => {
    setData(prev => ({
      ...prev,
      experience: prev.experience.filter(e => e.id !== id)
    }));
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: crypto.randomUUID(),
      school: 'Nom de l\'établissement',
      degree: 'Diplôme',
      year: '2024'
    };
    setData(prev => ({ ...prev, education: [...prev.education, newEdu] }));
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setData(prev => ({
      ...prev,
      education: prev.education.map(e => e.id === id ? { ...e, [field]: value } : e)
    }));
  };

  const removeEducation = (id: string) => {
    setData(prev => ({
      ...prev,
      education: prev.education.filter(e => e.id !== id)
    }));
  };

  // --- AI Features ---

  const handleGenerateSummary = async () => {
    if (data.experience.length === 0 || !data.experience[0].role) {
      alert("Veuillez d'abord ajouter au moins un rôle dans votre expérience pour que l'IA puisse générer un contexte.");
      return;
    }
    setLoadingAI('summary');
    try {
      const skillsStr = data.skills.join(', ');
      const result = await generateResumeSummary(data.experience[0].role, skillsStr || 'compétences générales');
      
      if (result.success && result.data) {
        updateField('summary', result.data);
      } else {
        alert(result.error || "Impossible de générer le résumé. Veuillez réessayer.");
      }
    } catch (err) {
      alert("Une erreur inattendue s'est produite. Veuillez vérifier votre connexion.");
    } finally {
      setLoadingAI(null);
    }
  };

  const handleImproveDescription = async (id: string, role: string, desc: string) => {
    if (!desc.trim()) {
      alert("Veuillez écrire quelques points clés ou une ébauche pour que l'IA puisse l'améliorer.");
      return;
    }
    setLoadingAI(`exp-${id}`);
    try {
      const result = await improveJobDescription(role, desc);
      
      if (result.success && result.data) {
        updateExperience(id, 'description', result.data);
      } else {
        alert(result.error || "L'amélioration du texte a échoué. Veuillez réessayer.");
      }
    } catch (err) {
      alert("Une erreur inattendue s'est produite. Veuillez vérifier votre connexion.");
    } finally {
      setLoadingAI(null);
    }
  };

  // --- Payment & Download Logic ---

  const initiateDownload = (format: 'pdf' | 'word') => {
    if (!hasPaid) {
      setPaymentStep('input');
      setShowPaymentModal(true);
      return;
    }

    if (format === 'pdf') {
      window.print();
    } else if (format === 'word') {
      exportToWord();
    }
    setShowDownloadMenu(false);
  };

  const exportToWord = () => {
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Resume</title></head><body>";
    const footer = "</body></html>";
    const previewElement = document.getElementById("resume-preview");
    const sourceHTML = header + (previewElement ? previewElement.innerHTML : "") + footer;
    
    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
    const fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = `${data.fullName.replace(/\s+/g, '_') || 'CV'}.doc`;
    fileDownload.click();
    document.body.removeChild(fileDownload);
  };

  const processPayment = () => {
    if (userPhone.length < 9) {
      alert("Veuillez entrer un numéro de téléphone valide.");
      return;
    }

    setPaymentStep('processing');
    
    // Simulate API Payment Processing
    setTimeout(() => {
      setPaymentStep('success');
      setTimeout(() => {
        setHasPaid(true);
        setShowPaymentModal(false);
        // If user was trying to download, maybe prompt them to click again or auto-open
      }, 1500);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col relative transition-colors duration-300">
      
      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden relative">
            
            {/* Modal Header */}
            <div className="bg-slate-900 p-6 text-white text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500"></div>
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/20">
                {paymentStep === 'success' ? (
                  <Check className="w-6 h-6 text-green-400" />
                ) : (
                  <Lock className="w-6 h-6 text-white" />
                )}
              </div>
              <h2 className="text-xl font-bold">
                {paymentStep === 'success' ? 'Paiement Réussi' : 'Paiement Sécurisé'}
              </h2>
              <p className="text-slate-300 text-sm mt-1">
                {paymentStep === 'success' ? 'Téléchargement débloqué...' : 'Débloquez le téléchargement (PDF & Word)'}
              </p>
            </div>
            
            <div className="p-8">
              {paymentStep === 'input' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <p className="text-slate-500 text-sm uppercase tracking-wider font-semibold">Montant à payer</p>
                    <span className="text-4xl font-bold text-slate-900">550 FCFA</span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Choisissez l'opérateur</label>
                      <div className="grid grid-cols-2 gap-4">
                        <button 
                          onClick={() => setProvider('MTN')}
                          className={`p-3 rounded-lg border-2 flex flex-col items-center justify-center transition-all ${provider === 'MTN' ? 'border-yellow-400 bg-yellow-50' : 'border-slate-100 hover:border-slate-200'}`}
                        >
                          <span className="font-bold text-slate-900">MTN</span>
                          <span className="text-[10px] text-slate-500">Mobile Money</span>
                        </button>
                        <button 
                          onClick={() => setProvider('AIRTEL')}
                          className={`p-3 rounded-lg border-2 flex flex-col items-center justify-center transition-all ${provider === 'AIRTEL' ? 'border-red-500 bg-red-50' : 'border-slate-100 hover:border-slate-200'}`}
                        >
                          <span className="font-bold text-slate-900">Airtel</span>
                          <span className="text-[10px] text-slate-500">Money</span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Votre Numéro de téléphone</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Smartphone className="h-4 w-4 text-slate-400" />
                        </div>
                        <input
                          type="tel"
                          value={userPhone}
                          onChange={(e) => setUserPhone(e.target.value.replace(/[^0-9+]/g, ''))}
                          className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-shadow"
                          placeholder="+242 ..."
                          autoFocus
                        />
                      </div>
                      <p className="text-xs text-slate-400 mt-2 text-center">
                        Un message de confirmation sera envoyé à ce numéro.
                      </p>
                    </div>
                  </div>

                  <Button 
                    className="w-full py-3 text-lg shadow-lg shadow-orange-500/20" 
                    onClick={processPayment}
                    disabled={!userPhone}
                  >
                    Payer maintenant
                  </Button>
                  
                  <button 
                    onClick={() => setShowPaymentModal(false)}
                    className="w-full text-center text-sm text-slate-400 hover:text-slate-600"
                  >
                    Annuler
                  </button>
                </div>
              )}

              {paymentStep === 'processing' && (
                <div className="text-center py-8 space-y-6">
                  <div className="relative w-20 h-20 mx-auto">
                     <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
                     <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                     <div className="absolute inset-0 flex items-center justify-center">
                        <Smartphone className="w-8 h-8 text-slate-300 animate-pulse" />
                     </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Veuillez confirmer sur votre mobile</h3>
                    <p className="text-slate-500 text-sm max-w-xs mx-auto">
                      Une demande de paiement de <span className="font-bold text-slate-900">550 FCFA</span> a été envoyée au {userPhone}.
                    </p>
                    <p className="text-xs text-slate-400 mt-4">En attente de validation...</p>
                  </div>
                </div>
              )}

              {paymentStep === 'success' && (
                <div className="text-center py-8 space-y-4">
                   <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 animate-in zoom-in duration-300">
                      <Check className="w-10 h-10 text-green-600" />
                   </div>
                   <h3 className="text-xl font-bold text-slate-900">Paiement Confirmé !</h3>
                   <p className="text-slate-500">Vous pouvez maintenant télécharger votre CV.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Builder Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex flex-col sm:flex-row items-center justify-between no-print sticky top-0 z-40 shadow-sm transition-colors duration-300 gap-4 sm:gap-0">
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-4">
            <a href="#/" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-500 dark:text-slate-400 transition-colors">
              <ChevronLeft size={20} />
            </a>
            <div>
               <h1 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">Créateur de CV</h1>
               <div className="flex items-center gap-2">
                 {isSaved ? (
                   <span className="text-xs text-green-600 flex items-center gap-1 font-medium">
                     <Cloud size={10} /> Sauvegardé
                   </span>
                 ) : (
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                     <Loader2 size={10} className="animate-spin" /> Enregistrement...
                   </span>
                 )}
               </div>
            </div>
          </div>
          
          <button 
             onClick={handleReset}
             className="sm:hidden p-2 text-slate-400 hover:text-red-500 transition-colors"
             title="Réinitialiser"
          >
             <RotateCcw size={18} />
          </button>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
           {/* Desktop Reset Button */}
           <button 
             onClick={handleReset}
             className="hidden sm:flex items-center gap-1 px-3 py-2 text-xs font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors mr-2"
             title="Tout effacer et recommencer"
          >
             <RotateCcw size={14} />
             Réinitialiser
          </button>

          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Modèle:</span>
            <select 
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value as TemplateType)}
              className="bg-transparent text-sm font-semibold text-slate-900 dark:text-white outline-none cursor-pointer"
            >
              <option value={TemplateType.MODERN}>Moderne</option>
              <option value={TemplateType.CLASSIC}>Classique</option>
              <option value={TemplateType.CREATIVE}>Créatif</option>
              <option value={TemplateType.MINIMAL}>Minimaliste</option>
              <option value={TemplateType.ELEGANT}>Élégant</option>
            </select>
          </div>

          <div className="relative flex-1 sm:flex-none">
            <Button 
              onClick={() => setShowDownloadMenu(!showDownloadMenu)}
              className={`w-full sm:w-auto shadow-lg transition-all ${hasPaid ? 'bg-green-600 hover:bg-green-700' : 'bg-slate-900 hover:bg-slate-800 dark:bg-orange-600 dark:hover:bg-orange-700'}`}
              icon={hasPaid ? <Download size={18} /> : <Lock size={18} />}
            >
              Télécharger
            </Button>
            
            {showDownloadMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowDownloadMenu(false)}></div>
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-20 py-1 animate-in fade-in zoom-in-95 duration-200">
                  <button 
                    onClick={() => initiateDownload('pdf')}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                  >
                    <Printer size={16} className="text-slate-400" /> PDF (Haute Qualité)
                  </button>
                  <button 
                    onClick={() => initiateDownload('word')}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                  >
                    <FileDown size={16} className="text-blue-500" /> Word (.doc)
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Form Controls */}
        <div className="w-full md:w-[500px] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col overflow-y-auto no-print z-30 transition-colors duration-300">
          {/* Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-10 overflow-x-auto">
            {['personnel', 'expérience', 'formation', 'compétences', 'design'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 px-3 py-4 text-xs sm:text-sm font-medium border-b-2 transition-colors capitalize whitespace-nowrap ${
                  activeTab === tab 
                    ? 'border-primary text-primary bg-orange-50/50 dark:bg-orange-900/20' 
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-6 pb-20">
            
            {activeTab === 'design' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                    <Palette size={20} className="text-primary" />
                    Couleur principale
                  </h2>
                  <div className="grid grid-cols-5 gap-3">
                    {COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => updateField('themeColor', color)}
                        className={`w-full aspect-square rounded-full shadow-sm transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${
                          data.themeColor === color ? 'ring-2 ring-offset-2 ring-primary scale-110' : ''
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}

                    {/* Custom Color Picker */}
                    <div className="relative w-full aspect-square rounded-full shadow-sm transition-transform hover:scale-110 group">
                        <input
                          type="color"
                          value={data.themeColor}
                          onChange={(e) => updateField('themeColor', e.target.value)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 rounded-full"
                          title="Couleur personnalisée"
                        />
                        <div 
                          className={`w-full h-full rounded-full flex items-center justify-center ${!COLORS.includes(data.themeColor) ? 'ring-2 ring-offset-2 ring-primary' : 'bg-white dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600'}`}
                          style={{ backgroundColor: !COLORS.includes(data.themeColor) ? data.themeColor : undefined }}
                        >
                          {COLORS.includes(data.themeColor) && (
                            <Plus className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                          )}
                        </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                    <TypeIcon size={20} className="text-primary" />
                    Typographie
                  </h2>
                  <div className="grid grid-cols-1 gap-3">
                    {FONTS.map((font) => (
                      <button
                        key={font.value}
                        onClick={() => updateField('fontFamily', font.value)}
                        className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                          data.fontFamily === font.value
                            ? 'border-primary bg-orange-50 dark:bg-orange-900/20 text-primary dark:text-orange-300'
                            : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                        style={{ fontFamily: font.value }}
                      >
                        <span className="text-lg block mb-1">Abc</span>
                        <span className="text-xs opacity-70">{font.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'personnel' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Informations Personnelles</h2>
                
                {/* Photo Upload */}
                <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex items-center justify-center border border-slate-300 dark:border-slate-600 shrink-0">
                    {data.photoUrl ? (
                      <img src={data.photoUrl} alt="Aperçu" className="w-full h-full object-cover" />
                    ) : (
                      <Upload className="text-slate-400" size={24} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Photo de Profil</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="block w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-orange-50 dark:file:bg-orange-900/50 file:text-orange-700 dark:file:text-orange-300 hover:file:bg-orange-100 dark:hover:file:bg-orange-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 col-span-2">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Nom Complet</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-md focus:ring-2 focus:ring-primary outline-none transition-shadow"
                      value={data.fullName}
                      onChange={(e) => updateField('fullName', e.target.value)}
                      placeholder="Jean Dupont"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Email</label>
                    <input 
                      type="email" 
                      className="w-full p-2 border dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-md focus:ring-2 focus:ring-primary outline-none transition-shadow"
                      value={data.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      placeholder="jean@exemple.com"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Téléphone</label>
                    <input 
                      type="tel" 
                      className="w-full p-2 border dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-md focus:ring-2 focus:ring-primary outline-none transition-shadow"
                      value={data.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      placeholder="+242 06 123 4567"
                    />
                  </div>
                   <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Ville / Pays</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-md focus:ring-2 focus:ring-primary outline-none transition-shadow"
                      value={data.location}
                      onChange={(e) => updateField('location', e.target.value)}
                      placeholder="Brazzaville, Congo"
                    />
                  </div>
                   <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Site Web / LinkedIn</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-md focus:ring-2 focus:ring-primary outline-none transition-shadow"
                      value={data.website}
                      onChange={(e) => updateField('website', e.target.value)}
                      placeholder="linkedin.com/in/jeandupont"
                    />
                  </div>
                </div>

                <div className="space-y-1 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Résumé Professionnel</label>
                    <button 
                      onClick={handleGenerateSummary}
                      disabled={loadingAI === 'summary'}
                      className="text-xs flex items-center gap-1 text-primary hover:text-orange-700 dark:hover:text-orange-400 disabled:opacity-50 font-medium transition-colors"
                    >
                      {loadingAI === 'summary' ? <span className="animate-pulse">Génération...</span> : <><Wand2 size={12} /> Rédiger avec IA</>}
                    </button>
                  </div>
                  <textarea 
                    className="w-full p-3 border dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-md h-32 focus:ring-2 focus:ring-primary outline-none text-sm leading-relaxed transition-shadow"
                    value={data.summary}
                    onChange={(e) => updateField('summary', e.target.value)}
                    placeholder="Un bref aperçu de votre carrière et de ce que vous apportez..."
                  />
                </div>
              </div>
            )}

            {activeTab === 'expérience' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Expérience Professionnelle</h2>
                  <Button size="sm" variant="outline" onClick={addExperience} icon={<Plus size={14}/>}>Ajouter</Button>
                </div>
                
                {data.experience.map((exp, index) => (
                  <div key={exp.id} className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 space-y-3 relative group hover:border-orange-200 dark:hover:border-orange-700 transition-colors">
                    <button 
                      onClick={() => removeExperience(exp.id)}
                      className="absolute top-2 right-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                       <input 
                        className="p-2 border dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded text-sm font-medium focus:ring-2 focus:ring-primary outline-none"
                        placeholder="Intitulé du poste"
                        value={exp.role}
                        onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                      />
                      <input 
                        className="p-2 border dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded text-sm focus:ring-2 focus:ring-primary outline-none"
                        placeholder="Entreprise"
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                      />
                      <input 
                        className="p-2 border dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded text-sm focus:ring-2 focus:ring-primary outline-none"
                        placeholder="Date de début"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                      />
                      <input 
                        className="p-2 border dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded text-sm focus:ring-2 focus:ring-primary outline-none"
                        placeholder="Date de fin"
                        value={exp.endDate}
                        onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                      />
                    </div>
                    <div className="relative">
                      <div className="flex justify-end mb-1">
                        <button 
                          onClick={() => handleImproveDescription(exp.id, exp.role, exp.description)}
                          disabled={loadingAI === `exp-${exp.id}`}
                          className="text-xs flex items-center gap-1 text-primary hover:text-orange-700 dark:hover:text-orange-400 disabled:opacity-50 font-medium"
                        >
                          {loadingAI === `exp-${exp.id}` ? "Amélioration..." : <><Wand2 size={12} /> Améliorer avec IA</>}
                        </button>
                      </div>
                      <textarea 
                        className="w-full p-2 border dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded text-sm h-24 resize-none focus:ring-2 focus:ring-primary outline-none"
                        placeholder="Décrivez vos responsabilités et réalisations..."
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
                {data.experience.length === 0 && <p className="text-slate-500 dark:text-slate-400 text-sm text-center py-4 italic">Aucune expérience ajoutée pour le moment.</p>}
              </div>
            )}

            {activeTab === 'formation' && (
               <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Formation</h2>
                  <Button size="sm" variant="outline" onClick={addEducation} icon={<Plus size={14}/>}>Ajouter</Button>
                </div>
                 {data.education.map((edu) => (
                  <div key={edu.id} className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 space-y-3 relative group hover:border-orange-200 dark:hover:border-orange-700 transition-colors">
                     <button 
                      onClick={() => removeEducation(edu.id)}
                      className="absolute top-2 right-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className="grid grid-cols-1 gap-3">
                       <input 
                        className="p-2 border dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded text-sm font-medium focus:ring-2 focus:ring-primary outline-none"
                        placeholder="École / Université"
                        value={edu.school}
                        onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input 
                          className="p-2 border dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded text-sm focus:ring-2 focus:ring-primary outline-none"
                          placeholder="Diplôme"
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                        />
                        <input 
                          className="p-2 border dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded text-sm focus:ring-2 focus:ring-primary outline-none"
                          placeholder="Année"
                          value={edu.year}
                          onChange={(e) => updateEducation(edu.id, 'year', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                 ))}
                 {data.education.length === 0 && <p className="text-slate-500 dark:text-slate-400 text-sm text-center py-4 italic">Aucune formation ajoutée pour le moment.</p>}
              </div>
            )}

            {activeTab === 'compétences' && (
               <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                 <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Compétences</h2>
                 <p className="text-sm text-slate-500 dark:text-slate-400">Séparez les compétences par des virgules.</p>
                 <textarea 
                    className="w-full p-3 border dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-md h-32 focus:ring-2 focus:ring-primary outline-none"
                    value={data.skills.join(', ')}
                    onChange={(e) => updateField('skills', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                    placeholder="Gestion de projet, React, Leadership, Prise de parole..."
                  />
               </div>
            )}

          </div>
        </div>

        {/* Right Preview Area */}
        <div className="flex-1 bg-slate-200/50 dark:bg-black/20 p-8 overflow-auto flex items-start justify-center print-only scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent transition-colors duration-300">
           <div className="transform origin-top scale-[0.6] sm:scale-[0.7] md:scale-[0.65] lg:scale-[0.8] xl:scale-[0.9] 2xl:scale-100 transition-transform duration-300 print:scale-100 print:transform-none shadow-2xl dark:shadow-black/50">
             <ResumePreview data={data} template={selectedTemplate} />
           </div>
        </div>
      </div>
    </div>
  );
};