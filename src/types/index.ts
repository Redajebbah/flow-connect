export type UserRole = 'admin' | 'commercial' | 'technical' | 'supervisor';

export type SubscriptionType = 'water' | 'electricity' | 'both';

export type DossierStatus = 
  | 'DRAFT'
  | 'DOSSIER_COMPLETE'
  | 'TECHNICAL_REVIEW'
  | 'WORKS_REQUIRED'
  | 'WORKS_VALIDATED'
  | 'CONTRACT_SENT'
  | 'CONTRACT_SIGNED'
  | 'METER_SCHEDULED'
  | 'METER_INSTALLED'
  | 'INSTALLATION_REPORT_RECEIVED'
  | 'CUSTOMER_VALIDATED'
  | 'SUBSCRIPTION_ACTIVE'
  | 'REJECTED'
  | 'CANCELLED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationalId: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    region: string;
  };
}

export interface Document {
  id: string;
  dossierId: string;
  type: 'national_id' | 'contract' | 'quotation' | 'installation_report' | 'other';
  name: string;
  url: string;
  uploadedAt: Date;
  uploadedBy: string;
  version: number;
}

export interface StatusHistory {
  id: string;
  status: DossierStatus;
  timestamp: Date;
  userId: string;
  userName: string;
  comment?: string;
}

export interface Dossier {
  id: string;
  reference: string;
  customer: Customer;
  subscriptionType: SubscriptionType;
  status: DossierStatus;
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string;
  documents: Document[];
  statusHistory: StatusHistory[];
  worksRequired: boolean;
  quotationAmount?: number;
  installationDate?: Date;
  meterNumber?: string;
  notes?: string;
}

export interface DashboardStats {
  totalDossiers: number;
  activeDossiers: number;
  pendingReview: number;
  completedThisMonth: number;
  averageProcessingDays: number;
  byStatus: Record<DossierStatus, number>;
  byType: Record<SubscriptionType, number>;
}
