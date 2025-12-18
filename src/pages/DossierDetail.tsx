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
  ChevronRight
} from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/dossier/StatusBadge';
import { WorkflowSteps } from '@/components/dossier/WorkflowSteps';
import { Badge } from '@/components/ui/badge';
import { mockDossiers, statusLabels, subscriptionTypeLabels } from '@/lib/mockData';
import { cn } from '@/lib/utils';

export default function DossierDetail() {
  const { id } = useParams();
  const dossier = mockDossiers.find((d) => d.id === id);

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
      subtitle={subscriptionTypeLabels[dossier.subscriptionType]}
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
            <Button variant="outline">Modifier</Button>
            <Button>Avancer le statut</Button>
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
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Nom complet</p>
                    <p className="text-sm font-medium text-foreground">
                      {dossier.customer.firstName} {dossier.customer.lastName}
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
                      {dossier.customer.nationalId}
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
                      {dossier.customer.address.street}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {dossier.customer.address.postalCode} {dossier.customer.address.city}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {dossier.customer.address.region}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="rounded-xl bg-card border border-border p-6 shadow-card animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-card-foreground">
                  Documents
                </h3>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Ajouter
                </Button>
              </div>
              
              {dossier.documents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground/50 mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Aucun document ajouté
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {/* Document list would go here */}
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
              <div className="space-y-4">
                {dossier.statusHistory.map((entry, index) => (
                  <div 
                    key={entry.id} 
                    className={cn(
                      "flex items-start gap-4 pb-4",
                      index < dossier.statusHistory.length - 1 && "border-b border-border"
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
                          {entry.userName}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(entry.timestamp).toLocaleString('fr-FR')}
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
                    {new Date(dossier.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Dernière mise à jour</span>
                  <span className="font-medium text-foreground">
                    {new Date(dossier.updatedAt).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Travaux requis</span>
                  <span className="font-medium text-foreground">
                    {dossier.worksRequired ? 'Oui' : 'Non'}
                  </span>
                </div>
                {dossier.quotationAmount && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Montant devis</span>
                    <span className="font-medium text-foreground">
                      {dossier.quotationAmount.toLocaleString('fr-FR')} €
                    </span>
                  </div>
                )}
                {dossier.meterNumber && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">N° Compteur</span>
                    <span className="font-medium text-foreground">
                      {dossier.meterNumber}
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
