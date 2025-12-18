import { DossierStatus } from '@/types';
import { statusLabels } from '@/lib/mockData';

interface StatusChartProps {
  data: Record<DossierStatus, number>;
}

const statusColors: Record<string, string> = {
  DRAFT: 'bg-muted',
  DOSSIER_COMPLETE: 'bg-blue-400',
  TECHNICAL_REVIEW: 'bg-sky-500',
  WORKS_REQUIRED: 'bg-purple-500',
  WORKS_VALIDATED: 'bg-violet-500',
  CONTRACT_SENT: 'bg-teal-400',
  CONTRACT_SIGNED: 'bg-teal-500',
  METER_SCHEDULED: 'bg-emerald-400',
  METER_INSTALLED: 'bg-emerald-500',
  INSTALLATION_REPORT_RECEIVED: 'bg-green-400',
  CUSTOMER_VALIDATED: 'bg-green-500',
  SUBSCRIPTION_ACTIVE: 'bg-status-active',
  REJECTED: 'bg-destructive',
  CANCELLED: 'bg-muted-foreground',
};

export function StatusChart({ data }: StatusChartProps) {
  const activeStatuses = Object.entries(data)
    .filter(([_, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const maxCount = Math.max(...activeStatuses.map(([_, count]) => count));

  return (
    <div className="rounded-xl bg-card border border-border p-6 shadow-card animate-fade-in">
      <h3 className="text-lg font-semibold text-card-foreground mb-6">
        Répartition par statut
      </h3>
      <div className="space-y-4">
        {activeStatuses.map(([status, count]) => (
          <div key={status} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {statusLabels[status as DossierStatus]}
              </span>
              <span className="font-medium text-foreground">{count}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${statusColors[status]}`}
                style={{ width: `${(count / maxCount) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
