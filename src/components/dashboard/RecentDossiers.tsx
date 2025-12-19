import { Link } from 'react-router-dom';
import { ArrowRight, Droplets, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DossierStatus, SubscriptionType } from '@/hooks/useDossiers';

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

interface SimpleDossier {
  id: string;
  reference: string;
  subscriptionType: SubscriptionType;
  status: DossierStatus;
  customer: { firstName: string; lastName: string; city: string };
  updatedAt: Date;
}

interface RecentDossiersProps {
  dossiers: SimpleDossier[];
}

const statusVariants: Record<string, "draft" | "pending" | "review" | "works" | "contract" | "active" | "rejected"> = {
  DRAFT: 'draft',
  DOSSIER_COMPLETE: 'pending',
  TECHNICAL_REVIEW: 'review',
  WORKS_REQUIRED: 'works',
  CONTRACT_SENT: 'contract',
  CONTRACT_SIGNED: 'contract',
  SUBSCRIPTION_ACTIVE: 'active',
  REJECTED: 'rejected',
  CANCELLED: 'rejected',
};

export function RecentDossiers({ dossiers }: RecentDossiersProps) {
  return (
    <div className="rounded-xl bg-card border border-border shadow-card animate-fade-in">
      <div className="flex items-center justify-between p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-card-foreground">Dossiers récents</h3>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/dossiers" className="flex items-center gap-1">
            Voir tout
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
      <div className="divide-y divide-border">
        {dossiers.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">Aucun dossier</div>
        ) : (
          dossiers.map((dossier) => (
            <Link
              key={dossier.id}
              to={`/dossiers/${dossier.id}`}
              className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                dossier.subscriptionType === 'water' ? 'bg-blue-100 text-blue-600' :
                dossier.subscriptionType === 'electricity' ? 'bg-amber-100 text-amber-600' :
                'bg-purple-100 text-purple-600'
              }`}>
                {dossier.subscriptionType === 'water' ? <Droplets className="h-5 w-5" /> :
                 dossier.subscriptionType === 'electricity' ? <Zap className="h-5 w-5" /> :
                 <><Droplets className="h-4 w-4" /><Zap className="h-4 w-4 -ml-1" /></>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground truncate">{dossier.reference}</p>
                  <Badge variant={statusVariants[dossier.status] || 'draft'}>{statusLabels[dossier.status]}</Badge>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {dossier.customer.firstName} {dossier.customer.lastName} • {dossier.customer.city}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">{dossier.updatedAt.toLocaleDateString('fr-FR')}</p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
