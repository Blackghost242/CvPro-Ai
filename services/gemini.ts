import { GoogleGenAI } from "@google/genai";

// Accès sécurisé à la clé API pour éviter les crashs si process n'est pas défini
const apiKey = (typeof process !== 'undefined' && process.env && process.env.API_KEY) ? process.env.API_KEY : '';
const ai = new GoogleGenAI({ apiKey });

export interface AIResult {
  success: boolean;
  data?: string;
  error?: string;
}

/**
 * Analyse l'erreur brute retournée par l'API ou le réseau et retourne un message convivial en français.
 */
const getErrorMessage = (error: any): string => {
  console.error("AI Service Error Details:", error);
  
  if (!apiKey) {
    return "La clé API n'est pas configurée. Veuillez vérifier votre fichier d'environnement.";
  }

  const msg = error.message?.toLowerCase() || '';
  const status = error.status || 0;

  // Erreurs liées à la clé API
  if (msg.includes('api key') || status === 400) {
    return "La clé API utilisée est invalide ou a expiré. Veuillez vérifier votre configuration.";
  }

  // Erreurs de quota (429)
  if (status === 429 || msg.includes('429') || msg.includes('quota') || msg.includes('resource exhausted')) {
    return "Le quota de l'IA est temporairement dépassé. Veuillez réessayer dans une minute.";
  }

  // Erreurs de réseau
  if (msg.includes('fetch failed') || msg.includes('network') || msg.includes('connection')) {
    return "Problème de connexion internet. Veuillez vérifier votre réseau et réessayer.";
  }

  // Erreurs de sécurité (Contenu bloqué)
  if (msg.includes('safety') || msg.includes('blocked')) {
    return "Le contenu généré a été bloqué par les filtres de sécurité. Essayez de reformuler votre demande de manière plus professionnelle.";
  }

  // Erreurs serveur (500, 503)
  if (status >= 500) {
    return "Les services de Google AI rencontrent actuellement des difficultés. Veuillez réessayer plus tard.";
  }

  return "Une erreur inattendue est survenue. Veuillez réessayer.";
};

/**
 * Génère un résumé professionnel pour le CV.
 */
export const generateResumeSummary = async (jobTitle: string, skills: string): Promise<AIResult> => {
  if (!apiKey) {
    return { success: false, error: "Clé API manquante. Impossible de contacter l'IA." };
  }
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a professional resume writer. Write a concise, impactful professional summary (max 50 words) in French for a ${jobTitle} who is skilled in ${skills}. Focus on value and expertise. Do not use markdown formatting like bolding.`,
      config: {
        // Paramètres pour réduire les blocages trop stricts sur des termes professionnels
        safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' }
        ]
      }
    });
    
    // Vérification explicite du texte retourné
    const text = response.text;
    
    if (!text) {
      // Si text est undefined mais pas d'erreur levée, c'est souvent un filtre de sécurité silencieux ou une réponse vide
      if (response.candidates && response.candidates.length > 0 && response.candidates[0].finishReason !== 'STOP') {
         return { success: false, error: `La génération a été interrompue (Raison: ${response.candidates[0].finishReason}). Veuillez reformuler.` };
      }
      return { success: false, error: "L'IA n'a retourné aucun contenu exploitable." };
    }

    return { success: true, data: text.trim() };
  } catch (error) {
    return { success: false, error: getErrorMessage(error) };
  }
};

/**
 * Améliore une description de poste existante.
 */
export const improveJobDescription = async (role: string, currentDesc: string): Promise<AIResult> => {
  if (!apiKey) {
    return { success: false, error: "Clé API manquante. Impossible de contacter l'IA." };
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an expert career coach. Rewrite the following job description bullet points for a "${role}" role to be more result-oriented, professional, and impactful in French. Use strong action verbs. \n\nCurrent Text: "${currentDesc}"\n\nOutput only the improved text as a plain paragraph or bullet points (using dashes).`,
      config: {
        safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' }
        ]
      }
    });

    const text = response.text;
    
    if (!text) {
      if (response.candidates && response.candidates.length > 0 && response.candidates[0].finishReason !== 'STOP') {
         return { success: false, error: `La génération a été interrompue (Raison: ${response.candidates[0].finishReason}).` };
      }
      return { success: false, error: "L'IA n'a pas pu améliorer le texte. Veuillez vérifier votre entrée." };
    }

    return { success: true, data: text.trim() };
  } catch (error) {
    return { success: false, error: getErrorMessage(error) };
  }
};