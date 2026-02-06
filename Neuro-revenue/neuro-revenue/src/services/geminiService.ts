import { ConsultationRecord } from '../types';
import { PATIENT_LABELS } from '../constants';

export const getClinicInsights = async (records: ConsultationRecord[]): Promise<string> => {
  if (records.length === 0) return '';

  // Calculate basic stats
  const total = records.reduce((sum, r) => sum + r.amount, 0);
  const patientCounts = records.reduce((acc, r) => {
    acc[r.type] = (acc[r.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Generate insights based on data
  const insights: string[] = [];

  // Revenue insight
  insights.push(`Total revenue: ₹${total.toLocaleString('en-IN')} from ${records.length} consultations.`);

  // Patient distribution
  const distribution = Object.entries(patientCounts)
    .map(([type, count]) => `${PATIENT_LABELS[type]}: ${count}`)
    .join(', ');
  insights.push(`Patient distribution - ${distribution}.`);

  // Average per consultation
  const avg = Math.round(total / records.length);
  insights.push(`Average per visit: ₹${avg.toLocaleString('en-IN')}.`);

  // Time-based insight
  const firstRecord = records[records.length - 1];
  const lastRecord = records[0];
  const daysDiff = Math.ceil((lastRecord.timestamp - firstRecord.timestamp) / (1000 * 60 * 60 * 24));
  
  if (daysDiff > 0) {
    const dailyAvg = Math.round(total / (daysDiff + 1));
    insights.push(`Daily average: ₹${dailyAvg.toLocaleString('en-IN')} over ${daysDiff + 1} day(s).`);
  }

  // Simple recommendations
  const newPatientRatio = (patientCounts['new'] || 0) / records.length;
  if (newPatientRatio < 0.2) {
    insights.push(`Consider marketing efforts - only ${Math.round(newPatientRatio * 100)}% new patients.`);
  }

  return insights.join('\n\n');
};
