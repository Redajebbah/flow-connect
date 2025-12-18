import { Link } from 'react-router-dom';
import { ArrowRight, Droplets, Zap } from 'lucide-react';
import { Dossier } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { statusLabels } from '@/lib/mockData';
import { cn } from '@/lib/utils';

interface RecentDossiersProps {
  dossiers: Dossier[];
}

const statusVariants: Record<string, "draft" | "pending" | "review" | "works" | "contract" | "active" | "rejected"> = {
  DRAFT: 'draft',
  DOSSIER_COMPLETE: 'pending',
  TECHNICAL_REVIEW: 'review',
  WORKS_REQUIRED: 'works',
  WORKS_VALIDATED: 'works',
  CONTRACT_SENT: 'contract',
  CONTRACT_SIGNED: 'contract',
  METER_SCHEDULED: 'pending',
  METER_INSTALLED: 'pending',
  INSTALLATION_REPORT_RECEIVED: 'pending',
  CUSTOMER_VALIDATED: 'pending',
  SUBSCRIPTION_ACTIVE: 'active',
  REJECTED: 'rejected',
  CANCELLED: 'rejected',
};

export function RecentDossiers({ dossiers }: RecentDossiersProps) {
  return (
    <div className="rounded-xl bg-card border border-border shadow-card animate-fade-in">
      <div className="flex items-center justify-between p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-card-foreground">
          Dossiers récents
        </h3>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/dossiers" className="flex items-center gap-1">
            Voir tout
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
      <div className="divide-y divide-border">
        {dossiers.map((dossier, index) => (
          <Link
            key={dossier.id}
            to={`/dossiers/${dossier.id}`}
            className={cn(
              "flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors",
              index === 0 && "animate-slide-up"
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg",
              dossier.subscriptionType === 'water' && "bg-blue-100 text-blue-600",
              dossier.subscriptionType === 'electricity' && "bg-amber-100 text-amber-600",
              dossier.subscriptionType === 'both' && "bg-purple-100 text-purple-600",
            )}>
              {dossier.subscriptionType === 'water' && <Droplets className="h-5 w-5" />}
              {dossier.subscriptionType === 'electricity' && <Zap className="h-5 w-5" />}
              {dossier.subscriptionType === 'both' && (
                <div className="flex">
                  <Droplets className="h-4 w-4" />
                  <Zap className="h-4 w-4 -ml-1" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-foreground truncate">
                  {dossier.reference}
                </p>
                <Badge variant={statusVariants[dossier.status]}>
                  {statusLabels[dossier.status]}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground truncate">
                {dossier.customer.firstName} {dossier.customer.lastName} • {dossier.customer.address.city}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">
                {new Date(dossier.updatedAt).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
