import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Droplets, Zap, User, MapPin, FileText, Check, Loader2 } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useCreateDossier, SubscriptionType } from '@/hooks/useDossiers';

type Step = 'type' | 'customer' | 'address' | 'documents' | 'review';

const steps: { id: Step; label: string; icon: any }[] = [
  { id: 'type', label: 'Type', icon: Zap },
  { id: 'customer', label: 'Client', icon: User },
  { id: 'address', label: 'Adresse', icon: MapPin },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'review', label: 'Validation', icon: Check },
];

export default function NewDossier() {
  const navigate = useNavigate();
  const createDossier = useCreateDossier();
  const [currentStep, setCurrentStep] = useState<Step>('type');
  const [formData, setFormData] = useState({
    subscriptionType: '' as SubscriptionType | '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    nationalId: '',
    street: '',
    city: '',
    postalCode: '',
    region: '',
    notes: '',
  });

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id);
    }
  };

  const handlePrev = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id);
    }
  };

  const handleSubmit = async () => {
    if (!formData.subscriptionType) return;
    
    await createDossier.mutateAsync({
      subscriptionType: formData.subscriptionType as SubscriptionType,
      customer: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        nationalId: formData.nationalId,
        street: formData.street,
        city: formData.city,
        postalCode: formData.postalCode,
        region: formData.region,
      },
      notes: formData.notes || undefined,
    });
    
    navigate('/dossiers');
  };

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <MainLayout 
      title="Nouveau dossier" 
      subtitle="Créer une nouvelle demande d'abonnement"
    >
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/dossiers" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Annuler
          </Link>
        </Button>

        {/* Steps Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div 
                  className={cn(
                    "flex items-center gap-3 px-4 py-2 rounded-lg transition-all",
                    index <= currentStepIndex 
                      ? "text-primary" 
                      : "text-muted-foreground"
                  )}
                >
                  <div className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all",
                    index < currentStepIndex && "bg-primary border-primary text-primary-foreground",
                    index === currentStepIndex && "border-primary text-primary",
                    index > currentStepIndex && "border-border text-muted-foreground"
                  )}>
                    {index < currentStepIndex ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <step.icon className="h-5 w-5" />
                    )}
                  </div>
                  <span className="text-sm font-medium hidden sm:block">
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    "w-12 h-0.5 mx-2",
                    index < currentStepIndex ? "bg-primary" : "bg-border"
                  )} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="rounded-xl bg-card border border-border p-8 shadow-card animate-fade-in">
          {/* Type Selection */}
          {currentStep === 'type' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Type d'abonnement
                </h2>
                <p className="text-muted-foreground">
                  Sélectionnez le type de service souhaité
                </p>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { value: 'water', label: 'Eau', icon: Droplets, color: 'blue' },
                  { value: 'electricity', label: 'Électricité', icon: Zap, color: 'amber' },
                  { value: 'both', label: 'Eau & Électricité', icon: null, color: 'purple' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateFormData('subscriptionType', option.value)}
                    className={cn(
                      "relative flex flex-col items-center gap-4 p-6 rounded-xl border-2 transition-all",
                      formData.subscriptionType === option.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <div className={cn(
                      "flex h-16 w-16 items-center justify-center rounded-xl",
                      option.color === 'blue' && "bg-blue-100 text-blue-600",
                      option.color === 'amber' && "bg-amber-100 text-amber-600",
                      option.color === 'purple' && "bg-purple-100 text-purple-600",
                    )}>
                      {option.value === 'both' ? (
                        <div className="flex">
                          <Droplets className="h-6 w-6" />
                          <Zap className="h-6 w-6 -ml-2" />
                        </div>
                      ) : (
                        option.icon && <option.icon className="h-8 w-8" />
                      )}
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {option.label}
                    </span>
                    {formData.subscriptionType === option.value && (
                      <div className="absolute top-3 right-3 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Customer Information */}
          {currentStep === 'customer' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Informations client
                </h2>
                <p className="text-muted-foreground">
                  Renseignez les coordonnées du demandeur
                </p>
              </div>
              
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => updateFormData('firstName', e.target.value)}
                    placeholder="Jean"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => updateFormData('lastName', e.target.value)}
                    placeholder="Dupont"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    placeholder="jean.dupont@email.fr"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => updateFormData('phone', e.target.value)}
                    placeholder="06 12 34 56 78"
                    required
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="nationalId">Numéro d'identité nationale *</Label>
                  <Input
                    id="nationalId"
                    value={formData.nationalId}
                    onChange={(e) => updateFormData('nationalId', e.target.value)}
                    placeholder="1234567890123"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Address */}
          {currentStep === 'address' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Adresse de connexion
                </h2>
                <p className="text-muted-foreground">
                  Lieu d'installation du compteur
                </p>
              </div>
              
              <div className="grid gap-6">
                <div className="space-y-2">
                  <Label htmlFor="street">Adresse *</Label>
                  <Input
                    id="street"
                    value={formData.street}
                    onChange={(e) => updateFormData('street', e.target.value)}
                    placeholder="15 Rue de la République"
                    required
                  />
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Code postal *</Label>
                    <Input
                      id="postalCode"
                      value={formData.postalCode}
                      onChange={(e) => updateFormData('postalCode', e.target.value)}
                      placeholder="69001"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Ville *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => updateFormData('city', e.target.value)}
                      placeholder="Lyon"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">Région *</Label>
                  <Input
                    id="region"
                    value={formData.region}
                    onChange={(e) => updateFormData('region', e.target.value)}
                    placeholder="Auvergne-Rhône-Alpes"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Documents */}
          {currentStep === 'documents' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Documents requis
                </h2>
                <p className="text-muted-foreground">
                  Les documents pourront être ajoutés après la création du dossier
                </p>
              </div>
              
              <div className="space-y-4">
                {[
                  { label: 'Pièce d\'identité', required: true },
                  { label: 'Justificatif de domicile', required: true },
                  { label: 'Autre document', required: false },
                ].map((doc) => (
                  <div 
                    key={doc.label}
                    className="flex items-center justify-between p-4 rounded-lg border border-dashed border-border"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {doc.label}
                          {doc.required && (
                            <span className="text-destructive ml-1">*</span>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          À ajouter après création
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes additionnelles</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => updateFormData('notes', e.target.value)}
                  placeholder="Informations complémentaires..."
                  rows={4}
                />
              </div>
            </div>
          )}

          {/* Review */}
          {currentStep === 'review' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Récapitulatif
                </h2>
                <p className="text-muted-foreground">
                  Vérifiez les informations avant de créer le dossier
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">
                    Type d'abonnement
                  </h4>
                  <p className="text-foreground capitalize">
                    {formData.subscriptionType === 'both' 
                      ? 'Eau & Électricité' 
                      : formData.subscriptionType === 'water' 
                        ? 'Eau' 
                        : 'Électricité'}
                  </p>
                </div>
                
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">
                    Client
                  </h4>
                  <p className="text-foreground">
                    {formData.firstName} {formData.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formData.email} • {formData.phone}
                  </p>
                </div>
                
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">
                    Adresse
                  </h4>
                  <p className="text-foreground">{formData.street}</p>
                  <p className="text-sm text-muted-foreground">
                    {formData.postalCode} {formData.city}, {formData.region}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
            >
              Précédent
            </Button>
            
            {currentStep === 'review' ? (
              <Button 
                onClick={handleSubmit}
                disabled={createDossier.isPending}
              >
                {createDossier.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Créer le dossier
              </Button>
            ) : (
              <Button 
                onClick={handleNext}
                disabled={currentStep === 'type' && !formData.subscriptionType}
              >
                Suivant
              </Button>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
