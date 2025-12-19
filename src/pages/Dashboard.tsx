import { 
  FolderOpen, 
  TrendingUp, 
  Clock, 
  CheckCircle2,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { StatusChart } from '@/components/dashboard/StatusChart';
import { RecentDossiers } from '@/components/dashboard/RecentDossiers';
import { TypeDistribution } from '@/components/dashboard/TypeDistribution';
import { useDashboardStats, useDossiers, DossierStatus, SubscriptionType } from '@/hooks/useDossiers';

const emptyStatusData: Record<DossierStatus, number> = {
  DRAFT: 0, DOSSIER_COMPLETE: 0, TECHNICAL_REVIEW: 0, WORKS_REQUIRED: 0,
  WORKS_VALIDATED: 0, CONTRACT_SENT: 0, CONTRACT_SIGNED: 0, METER_SCHEDULED: 0,
  METER_INSTALLED: 0, INSTALLATION_REPORT_RECEIVED: 0, CUSTOMER_VALIDATED: 0,
  SUBSCRIPTION_ACTIVE: 0, REJECTED: 0, CANCELLED: 0,
};

const emptyTypeData: Record<SubscriptionType, number> = { water: 0, electricity: 0, both: 0 };

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: dossiers, isLoading: dossiersLoading } = useDossiers();

  if (statsLoading || dossiersLoading) {
    return (
      <MainLayout title="Tableau de bord" subtitle="Vue d'ensemble de l'activité">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  const recentDossiers = (dossiers || []).slice(0, 5).map(d => ({
    id: d.id,
    reference: d.reference,
    subscriptionType: d.subscription_type,
    status: d.status,
    customer: {
      firstName: d.customer?.first_name || '',
      lastName: d.customer?.last_name || '',
      city: d.customer?.city || '',
    },
    updatedAt: new Date(d.updated_at),
  }));

  return (
    <MainLayout title="Tableau de bord" subtitle="Vue d'ensemble de l'activité">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard title="Total des dossiers" value={stats?.totalDossiers || 0} icon={FolderOpen} variant="primary" />
        <StatsCard title="Dossiers actifs" value={stats?.activeDossiers || 0} subtitle="En cours" icon={TrendingUp} />
        <StatsCard title="En attente" value={stats?.pendingReview || 0} subtitle="Requiert une action" icon={Clock} />
        <StatsCard title="Complétés ce mois" value={stats?.completedThisMonth || 0} icon={CheckCircle2} variant="secondary" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <RecentDossiers dossiers={recentDossiers} />
          <StatusChart data={stats?.byStatus || emptyStatusData} />
        </div>
        <div className="space-y-6">
          <TypeDistribution data={stats?.byType || emptyTypeData} />
          <div className="rounded-xl bg-card border border-border p-6 shadow-card">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Alertes</h3>
            {stats?.pendingReview && stats.pendingReview > 0 ? (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-900">{stats.pendingReview} dossiers en attente</p>
                  <p className="text-xs text-amber-700">Requièrent une action</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">Aucune alerte</p>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
