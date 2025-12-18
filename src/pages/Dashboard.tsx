import { 
  FolderOpen, 
  TrendingUp, 
  Clock, 
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { StatusChart } from '@/components/dashboard/StatusChart';
import { RecentDossiers } from '@/components/dashboard/RecentDossiers';
import { TypeDistribution } from '@/components/dashboard/TypeDistribution';
import { mockStats, mockDossiers } from '@/lib/mockData';

export default function Dashboard() {
  return (
    <MainLayout 
      title="Tableau de bord" 
      subtitle="Vue d'ensemble de l'activité"
    >
      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard
          title="Total des dossiers"
          value={mockStats.totalDossiers}
          icon={FolderOpen}
          trend={{ value: 12, isPositive: true }}
          variant="primary"
        />
        <StatsCard
          title="Dossiers actifs"
          value={mockStats.activeDossiers}
          subtitle="En cours de traitement"
          icon={TrendingUp}
        />
        <StatsCard
          title="En attente de validation"
          value={mockStats.pendingReview}
          subtitle="Requiert une action"
          icon={Clock}
        />
        <StatsCard
          title="Complétés ce mois"
          value={mockStats.completedThisMonth}
          icon={CheckCircle2}
          trend={{ value: 8, isPositive: true }}
          variant="secondary"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Charts */}
        <div className="lg:col-span-2 space-y-6">
          <RecentDossiers dossiers={mockDossiers.slice(0, 5)} />
          <StatusChart data={mockStats.byStatus} />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <TypeDistribution data={mockStats.byType} />
          
          {/* Alerts Card */}
          <div className="rounded-xl bg-card border border-border p-6 shadow-card">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">
              Alertes
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-900">
                    5 dossiers en attente
                  </p>
                  <p className="text-xs text-amber-700">
                    Depuis plus de 7 jours
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    3 installations planifiées
                  </p>
                  <p className="text-xs text-blue-700">
                    Cette semaine
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="rounded-xl bg-card border border-border p-6 shadow-card">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">
              Performance
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Délai moyen de traitement
                </span>
                <span className="text-lg font-semibold text-foreground">
                  {mockStats.averageProcessingDays} jours
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div 
                  className="h-full rounded-full bg-secondary transition-all duration-500"
                  style={{ width: '65%' }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Objectif: 10 jours
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
