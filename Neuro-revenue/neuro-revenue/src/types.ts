export enum PatientType {
  NEW = 'new',
  FOLLOW_UP = 'followup',
  IP_CONSULT = 'ip'
}

export interface ConsultationRecord {
  id: string;
  type: PatientType;
  amount: number;
  timestamp: number;
}
