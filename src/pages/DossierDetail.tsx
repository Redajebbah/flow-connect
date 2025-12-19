import { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard,
  Calendar,
  FileText,
  Upload,
  ChevronRight,
  Loader2,
  Download,
  Trash2
} from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/dossier/StatusBadge';
import { WorkflowSteps } from '@/components/dossier/WorkflowSteps';
import { Badge } from '@/components/ui/badge';
import { 
  useDossier, 
  useDossierDocuments, 
  useDossierHistory,
  useUploadDocument,
  useUpdateDossierStatus,
  getDocumentUrl,
  DossierStatus
} from '@/hooks/useDossiers';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const statusLabels: Record<DossierStatus, string> = {
  DRAFT: 'Brouillon',
  DOSSIER_COMPLETE: 'Dossier complet',
  TECHNICAL_REVIEW: 'Étude technique',
  WORKS_REQUIRED: 'Travaux requis',
  WORKS_VALIDATED: 'Travaux validés',
  CONTRACT_SENT: 'Contrat envoyé',
  CONTRACT_SIGNED: 'Contrat signé',
  METER_SCHEDULED: 'Installation planifiée',
  METER_INSTALLED: 'Compteur installé',
  INSTALLATION_REPORT_RECEIVED: 'PV reçu',
  CUSTOMER_VALIDATED: 'Client validé',
  SUBSCRIPTION_ACTIVE: 'Abonnement actif',
  REJECTED: 'Rejeté',
  CANCELLED: 'Annulé',
};

const subscriptionTypeLabels: Record<string, string> = {
  water: 'Eau',
  electricity: 'Électricité',
  both: 'Eau & Électricité',
};

const documentTypeLabels: Record<string, string> = {
  national_id: "Pièce d'identité",
  contract: 'Contrat',
  quotation: 'Devis',
  installation_report: "Rapport d'installation",
  other: 'Autre',
};

export default function DossierDetail() {
  const { id } = useParams();
  const { data: dossier, isLoading } = useDossier(id);
  const { data: documents } = useDossierDocuments(id);
  const { data: history } = useDossierHistory(id);
  const uploadDocument = useUploadDocument();
  const updateStatus = useUpdateDossierStatus();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedDocType, setSelectedDocType] = useState<string>('national_id');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !id) return;

    await uploadDocument.mutateAsync({
      dossierId: id,
      file,
      type: selectedDocType as any,
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownloadDocument = async (filePath: string, fileName: string) => {
    const url = await getDocumentUrl(filePath);
    if (url) {
      window.open(url, '_blank');
    }
  };

  const handleStatusChange = (newStatus: DossierStatus) => {
    if (!id) return;
    updateStatus.mutate({ dossierId: id, newStatus });
  };

  if (isLoading) {
    return (
      <MainLayout title="Chargement...">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  if (!dossier) {
    return (
      <MainLayout title="Dossier introuvable">
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-lg text-muted-foreground mb-4">
            Ce dossier n'existe pas
          </p>
          <Button asChild>
            <Link to="/dossiers">Retour à la liste</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout 
      title={dossier.reference}
      subtitle={subscriptionTypeLabels[dossier.subscription_type]}
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" asChild>
            <Link to="/dossiers" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <StatusBadge status={dossier.status} />
            <Select value={dossier.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Changer le statut" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Info */}
            <div className="rounded-xl bg-card border border-border p-6 shadow-card animate-fade-in">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">
                Informations client
              </h3>
              {dossier.customer && (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Nom complet</p>
                        <p className="text-sm font-medium text-foreground">
                          {dossier.customer.first_name} {dossier.customer.last_name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="text-sm font-medium text-foreground">
                          {dossier.customer.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Téléphone</p>
                        <p className="text-sm font-medium text-foreground">
                          {dossier.customer.phone}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <CreditCard className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">N° Identité</p>
                        <p className="text-sm font-medium text-foreground">
                          {dossier.customer.national_id}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Adresse de connexion</p>
                        <p className="text-sm font-medium text-foreground">
                          {dossier.customer.street}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {dossier.customer.postal_code} {dossier.customer.city}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {dossier.customer.region}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Documents */}
            <div className="rounded-xl bg-card border border-border p-6 shadow-card animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-card-foreground">
                  Documents
                </h3>
                <div className="flex items-center gap-2">
                  <Select value={selectedDocType} onValueChange={setSelectedDocType}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(documentTypeLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadDocument.isPending}
                  >
                    {uploadDocument.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Ajouter
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              {!documents || documents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground/50 mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Aucun document ajouté
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <div 
                      key={doc.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {documentTypeLabels[doc.type]} • v{doc.version}
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDownloadDocument(doc.file_path, doc.name)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-3">Documents requis:</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Pièce d'identité</Badge>
                  <Badge variant="outline">Justificatif de domicile</Badge>
                  <Badge variant="outline">Contrat signé</Badge>
                </div>
              </div>
            </div>

            {/* History */}
            <div className="rounded-xl bg-card border border-border p-6 shadow-card animate-fade-in">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">
                Historique
              </h3>
              {!history || history.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Aucun historique
                </p>
              ) : (
                <div className="space-y-4">
                  {history.map((entry, index) => (
                    <div 
                      key={entry.id} 
                      className={cn(
                        "flex items-start gap-4 pb-4",
                        index < history.length - 1 && "border-b border-border"
                      )}
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                        <Calendar className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-foreground">
                            {statusLabels[entry.status]}
                          </p>
                          <ChevronRight className="h-3 w-3 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">
                            Utilisateur
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(entry.created_at).toLocaleString('fr-FR')}
                        </p>
                        {entry.comment && (
                          <p className="text-sm text-foreground mt-2 p-2 rounded bg-muted">
                            {entry.comment}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <WorkflowSteps currentStatus={dossier.status} />

            {/* Quick Info */}
            <div className="rounded-xl bg-card border border-border p-6 shadow-card">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">
                Informations
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Créé le</span>
                  <span className="font-medium text-foreground">
                    {new Date(dossier.created_at).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Dernière mise à jour</span>
                  <span className="font-medium text-foreground">
                    {new Date(dossier.updated_at).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Travaux requis</span>
                  <span className="font-medium text-foreground">
                    {dossier.works_required ? 'Oui' : 'Non'}
                  </span>
                </div>
                {dossier.quotation_amount && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Montant devis</span>
                    <span className="font-medium text-foreground">
                      {Number(dossier.quotation_amount).toLocaleString('fr-FR')} €
                    </span>
                  </div>
                )}
                {dossier.meter_number && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">N° Compteur</span>
                    <span className="font-medium text-foreground">
                      {dossier.meter_number}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
