import { Link } from 'react-router-dom';
import { Droplets, Zap, Calendar, User, MapPin, ChevronRight } from 'lucide-react';
import { Dossier } from '@/types';
import { StatusBadge } from './StatusBadge';
import { subscriptionTypeLabels } from '@/lib/mockData';
import { cn } from '@/lib/utils';

interface DossierCardProps {
  dossier: Dossier;
  index?: number;
}

export function DossierCard({ dossier, index = 0 }: DossierCardProps) {
  return (
    <Link
      to={`/dossiers/${dossier.id}`}
      className="group block rounded-xl bg-card border border-border shadow-card hover:shadow-elevated transition-all duration-200 animate-slide-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex h-11 w-11 items-center justify-center rounded-lg",
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
            <div>
              <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                {dossier.reference}
              </h3>
              <p className="text-xs text-muted-foreground">
                {subscriptionTypeLabels[dossier.subscriptionType]}
              </p>
            </div>
          </div>
          <StatusBadge status={dossier.status} />
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{dossier.customer.firstName} {dossier.customer.lastName}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="truncate">{dossier.customer.address.city}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Créé le {new Date(dossier.createdAt).toLocaleDateString('fr-FR')}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          {dossier.assignedTo ? (
            <p className="text-xs text-muted-foreground">
              Assigné à <span className="font-medium text-foreground">{dossier.assignedTo}</span>
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">Non assigné</p>
          )}
          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </Link>
  );
}
