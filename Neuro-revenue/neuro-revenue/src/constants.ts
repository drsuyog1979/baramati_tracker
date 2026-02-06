import { PatientType } from './types';

export const FEES = {
  [PatientType.NEW]: 700,
  [PatientType.FOLLOW_UP]: 500,
  [PatientType.IP_CONSULT]: 1000,
};

export const PATIENT_LABELS = {
  [PatientType.NEW]: 'New Patient',
  [PatientType.FOLLOW_UP]: 'Follow-up',
  [PatientType.IP_CONSULT]: 'IP Consult',
};

export const PATIENT_COLORS = {
  [PatientType.NEW]: 'bg-indigo-500',
  [PatientType.FOLLOW_UP]: 'bg-emerald-500',
  [PatientType.IP_CONSULT]: 'bg-amber-500',
};

export const STORAGE_KEY = 'neuro_revenue_records';
