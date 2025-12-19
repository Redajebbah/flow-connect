import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

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

export type SubscriptionType = 'water' | 'electricity' | 'both';

export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  national_id: string;
  street: string;
  city: string;
  postal_code: string;
  region: string;
}

export interface Dossier {
  id: string;
  reference: string;
  customer_id: string;
  subscription_type: SubscriptionType;
  status: DossierStatus;
  assigned_to: string | null;
  works_required: boolean;
  quotation_amount: number | null;
  installation_date: string | null;
  meter_number: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  created_by: string;
  customer?: Customer;
}

export interface DossierDocument {
  id: string;
  dossier_id: string;
  type: 'national_id' | 'contract' | 'quotation' | 'installation_report' | 'other';
  name: string;
  file_path: string;
  file_size: number | null;
  mime_type: string | null;
  version: number;
  uploaded_at: string;
  uploaded_by: string;
}

export interface StatusHistoryEntry {
  id: string;
  dossier_id: string;
  status: DossierStatus;
  previous_status: DossierStatus | null;
  comment: string | null;
  created_at: string;
  user_id: string;
}

// Fetch all dossiers
export function useDossiers() {
  return useQuery({
    queryKey: ['dossiers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dossiers')
        .select(`*, customer:customers(*)`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Dossier[];
    },
  });
}

// Fetch a single dossier
export function useDossier(id: string | undefined) {
  return useQuery({
    queryKey: ['dossier', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('dossiers')
        .select(`*, customer:customers(*)`)
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data as Dossier | null;
    },
    enabled: !!id,
  });
}

// Fetch dossier documents
export function useDossierDocuments(dossierId: string | undefined) {
  return useQuery({
    queryKey: ['dossier-documents', dossierId],
    queryFn: async () => {
      if (!dossierId) return [];
      
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('dossier_id', dossierId)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      return data as DossierDocument[];
    },
    enabled: !!dossierId,
  });
}

// Fetch dossier status history
export function useDossierHistory(dossierId: string | undefined) {
  return useQuery({
    queryKey: ['dossier-history', dossierId],
    queryFn: async () => {
      if (!dossierId) return [];
      
      const { data, error } = await supabase
        .from('status_history')
        .select('*')
        .eq('dossier_id', dossierId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as StatusHistoryEntry[];
    },
    enabled: !!dossierId,
  });
}

// Create a new dossier
export function useCreateDossier() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: {
      subscriptionType: SubscriptionType;
      customer: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        nationalId: string;
        street: string;
        city: string;
        postalCode: string;
        region: string;
      };
      notes?: string;
    }) => {
      if (!user) throw new Error('Not authenticated');

      // First create the customer
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .insert({
          first_name: data.customer.firstName,
          last_name: data.customer.lastName,
          email: data.customer.email,
          phone: data.customer.phone,
          national_id: data.customer.nationalId,
          street: data.customer.street,
          city: data.customer.city,
          postal_code: data.customer.postalCode,
          region: data.customer.region,
          created_by: user.id,
        })
        .select()
        .single();

      if (customerError) throw customerError;

      // Generate a temp reference (will be replaced by trigger)
      const tempReference = `TEMP-${Date.now()}`;
      
      // Then create the dossier (reference is auto-generated by trigger)
      const { data: dossier, error: dossierError } = await supabase
        .from('dossiers')
        .insert({
          reference: tempReference,
          customer_id: customer.id,
          subscription_type: data.subscriptionType,
          notes: data.notes || null,
          created_by: user.id,
        })
        .select()
        .single();

      if (dossierError) throw dossierError;

      // Create initial status history
      await supabase.from('status_history').insert({
        dossier_id: dossier.id,
        status: 'DRAFT',
        user_id: user.id,
      });

      return dossier;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dossiers'] });
      toast.success('Dossier créé avec succès!');
    },
    onError: (error) => {
      toast.error('Erreur lors de la création', { description: error.message });
    },
  });
}

// Update dossier status
export function useUpdateDossierStatus() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ dossierId, newStatus }: { dossierId: string; newStatus: DossierStatus }) => {
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('dossiers')
        .update({ status: newStatus })
        .eq('id', dossierId);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['dossiers'] });
      queryClient.invalidateQueries({ queryKey: ['dossier', variables.dossierId] });
      toast.success('Statut mis à jour');
    },
    onError: (error) => {
      toast.error('Erreur', { description: error.message });
    },
  });
}

// Upload document
export function useUploadDocument() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ dossierId, file, type }: { dossierId: string; file: File; type: DossierDocument['type'] }) => {
      if (!user) throw new Error('Not authenticated');

      const filePath = `${dossierId}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage.from('dossier-documents').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { error: docError } = await supabase.from('documents').insert({
        dossier_id: dossierId,
        type,
        name: file.name,
        file_path: filePath,
        file_size: file.size,
        mime_type: file.type,
        uploaded_by: user.id,
      });
      if (docError) throw docError;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['dossier-documents', variables.dossierId] });
      toast.success('Document téléversé');
    },
    onError: (error) => {
      toast.error('Erreur', { description: error.message });
    },
  });
}

export async function getDocumentUrl(filePath: string): Promise<string | null> {
  const { data } = await supabase.storage.from('dossier-documents').createSignedUrl(filePath, 3600);
  return data?.signedUrl || null;
}

// Dashboard stats
export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data: dossiers, error } = await supabase.from('dossiers').select('status, subscription_type, created_at');
      if (error) throw error;

      const stats = {
        totalDossiers: dossiers.length,
        activeDossiers: dossiers.filter(d => !['SUBSCRIPTION_ACTIVE', 'REJECTED', 'CANCELLED'].includes(d.status)).length,
        pendingReview: dossiers.filter(d => ['TECHNICAL_REVIEW', 'WORKS_REQUIRED'].includes(d.status)).length,
        completedThisMonth: 0,
        byStatus: {} as Record<DossierStatus, number>,
        byType: { water: 0, electricity: 0, both: 0 } as Record<SubscriptionType, number>,
      };

      dossiers.forEach(d => {
        stats.byStatus[d.status as DossierStatus] = (stats.byStatus[d.status as DossierStatus] || 0) + 1;
        stats.byType[d.subscription_type as SubscriptionType]++;
      });

      return stats;
    },
  });
}
