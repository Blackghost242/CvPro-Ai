export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  year: string;
}

export interface ResumeData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  summary: string;
  photoUrl?: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  themeColor: string;
  fontFamily: string;
}

export enum TemplateType {
  MODERN = 'MODERN',
  CLASSIC = 'CLASSIC',
  CREATIVE = 'CREATIVE',
  MINIMAL = 'MINIMAL',
  ELEGANT = 'ELEGANT'
}

export interface Template {
  id: string;
  name: string;
  type: TemplateType;
  thumbnail: string;
  price: number;
  isPremium: boolean;
}