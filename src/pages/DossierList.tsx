import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Loader2 } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { DossierCard } from '@/components/dossier/DossierCard';
import { DossierFilters } from '@/components/dossier/DossierFilters';
import { Button } from '@/components/ui/button';
import { useDossiers } from '@/hooks/useDossiers';

export default function DossierList() {
  const { data: dossiers, isLoading, error } = useDossiers();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredDossiers = useMemo(() => {
    if (!dossiers) return [];
    
    return dossiers.filter((dossier) => {
      const matchesSearch = 
        dossier.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dossier.customer?.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dossier.customer?.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dossier.customer?.city.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || dossier.status === statusFilter;
      const matchesType = typeFilter === 'all' || dossier.subscription_type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [dossiers, searchQuery, statusFilter, typeFilter]);

  // Transform data for DossierCard compatibility
  const transformedDossiers = filteredDossiers.map(d => ({
    id: d.id,
    reference: d.reference,
    subscriptionType: d.subscription_type,
    status: d.status,
    createdAt: new Date(d.created_at),
    assignedTo: d.assigned_to || undefined,
    customer: d.customer ? {
      firstName: d.customer.first_name,
      lastName: d.customer.last_name,
      address: { city: d.customer.city },
    } : { firstName: '', lastName: '', address: { city: '' } },
  }));

  if (isLoading) {
    return (
      <MainLayout title="Dossiers" subtitle="Chargement...">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout title="Dossiers" subtitle="Erreur">
        <div className="text-center py-20">
          <p className="text-destructive">Erreur lors du chargement des dossiers</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout 
      title="Dossiers" 
      subtitle={`${dossiers?.length || 0} dossiers au total`}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <DossierFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            typeFilter={typeFilter}
            onTypeChange={setTypeFilter}
          />
          <Button asChild className="ml-4">
            <Link to="/dossiers/new">
              <Plus className="h-4 w-4 mr-2" />
              Nouveau dossier
            </Link>
          </Button>
        </div>

        {filteredDossiers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 rounded-xl bg-card border border-border">
            <p className="text-lg font-medium text-foreground mb-2">
              {dossiers?.length === 0 ? 'Aucun dossier' : 'Aucun dossier trouvé'}
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              {dossiers?.length === 0 
                ? 'Créez votre premier dossier pour commencer'
                : 'Modifiez vos critères de recherche'}
            </p>
            <Button asChild>
              <Link to="/dossiers/new">
                <Plus className="h-4 w-4 mr-2" />
                Créer un dossier
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {transformedDossiers.map((dossier, index) => (
              <DossierCard key={dossier.id} dossier={dossier as any} index={index} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
