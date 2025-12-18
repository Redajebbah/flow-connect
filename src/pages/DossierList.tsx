import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { DossierCard } from '@/components/dossier/DossierCard';
import { DossierFilters } from '@/components/dossier/DossierFilters';
import { Button } from '@/components/ui/button';
import { mockDossiers } from '@/lib/mockData';

export default function DossierList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredDossiers = useMemo(() => {
    return mockDossiers.filter((dossier) => {
      const matchesSearch = 
        dossier.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dossier.customer.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dossier.customer.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dossier.customer.address.city.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || dossier.status === statusFilter;
      const matchesType = typeFilter === 'all' || dossier.subscriptionType === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [searchQuery, statusFilter, typeFilter]);

  return (
    <MainLayout 
      title="Dossiers" 
      subtitle={`${mockDossiers.length} dossiers au total`}
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
              Aucun dossier trouvé
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Modifiez vos critères de recherche ou créez un nouveau dossier
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
            {filteredDossiers.map((dossier, index) => (
              <DossierCard key={dossier.id} dossier={dossier} index={index} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
