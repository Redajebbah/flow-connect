import { Check, Circle, Clock, ChevronRight, Loader2 } from 'lucide-react';
import { DossierStatus } from '@/hooks/useDossiers';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';

interface WorkflowStepsProps {
  currentStatus: DossierStatus;
  onValidateStep?: (nextStatus: DossierStatus) => void;
  isUpdating?: boolean;
  canEdit?: boolean;
}

export const statusLabels: Record<DossierStatus, string> = {
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

const workflowSteps: DossierStatus[] = [
  'DRAFT',
  'DOSSIER_COMPLETE',
  'TECHNICAL_REVIEW',
  'WORKS_REQUIRED',
  'WORKS_VALIDATED',
  'CONTRACT_SENT',
  'CONTRACT_SIGNED',
  'METER_SCHEDULED',
  'METER_INSTALLED',
  'INSTALLATION_REPORT_RECEIVED',
  'CUSTOMER_VALIDATED',
  'SUBSCRIPTION_ACTIVE',
];

export function WorkflowSteps({ 
  currentStatus, 
  onValidateStep,
  isUpdating = false,
  canEdit = false 
}: WorkflowStepsProps) {
  const currentIndex = workflowSteps.indexOf(currentStatus);
  const isTerminal = currentStatus === 'REJECTED' || currentStatus === 'CANCELLED';
  const isComplete = currentStatus === 'SUBSCRIPTION_ACTIVE';
  const [confirmStep, setConfirmStep] = useState<DossierStatus | null>(null);

  const nextStep = currentIndex < workflowSteps.length - 1 ? workflowSteps[currentIndex + 1] : null;

  const handleValidate = () => {
    if (nextStep && onValidateStep) {
      onValidateStep(nextStep);
      setConfirmStep(null);
    }
  };

  return (
    <div className="rounded-xl bg-card border border-border p-6 shadow-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-card-foreground">
          Progression du dossier
        </h3>
        {!isTerminal && !isComplete && (
          <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
            Étape {currentIndex + 1}/{workflowSteps.length}
          </span>
        )}
      </div>
      
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute left-[18px] top-4 bottom-4 w-0.5 bg-border" />
        
        {/* Completed Progress */}
        {currentIndex > 0 && (
          <div 
            className="absolute left-[18px] top-4 w-0.5 bg-primary transition-all duration-500"
            style={{ 
              height: `calc(${(currentIndex / (workflowSteps.length - 1)) * 100}% - 16px)` 
            }}
          />
        )}

        <div className="space-y-1">
          {workflowSteps.map((step, index) => {
            const isCompleted = index < currentIndex;
            const isCurrent = step === currentStatus;
            const isPending = index > currentIndex;
            const isNext = index === currentIndex + 1;

            return (
              <div 
                key={step} 
                className={cn(
                  "flex items-center gap-4 py-2.5 transition-all duration-200 rounded-lg",
                  isCurrent && "scale-[1.02] bg-primary/5 -mx-2 px-2",
                  isNext && canEdit && "hover:bg-muted/50 -mx-2 px-2 cursor-pointer"
                )}
              >
                <div className={cn(
                  "relative z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all duration-300 shrink-0",
                  isCompleted && "bg-primary border-primary",
                  isCurrent && "bg-primary border-primary animate-pulse-soft",
                  isPending && "bg-background border-border"
                )}>
                  {isCompleted ? (
                    <Check className="h-4 w-4 text-primary-foreground" />
                  ) : isCurrent ? (
                    <Clock className="h-4 w-4 text-primary-foreground" />
                  ) : (
                    <Circle className="h-3 w-3 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "text-sm font-medium transition-colors truncate",
                    isCompleted && "text-primary",
                    isCurrent && "text-primary",
                    isPending && "text-muted-foreground"
                  )}>
                    {statusLabels[step]}
                  </p>
                  {isCurrent && !isComplete && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      En cours
                    </p>
                  )}
                  {isCompleted && (
                    <p className="text-xs text-primary/70 mt-0.5">
                      Validé ✓
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {isTerminal && (
          <div className="mt-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
            <p className="text-sm font-medium text-destructive">
              Dossier {currentStatus === 'REJECTED' ? 'rejeté' : 'annulé'}
            </p>
          </div>
        )}

        {isComplete && (
          <div className="mt-4 p-4 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-sm font-medium text-primary">
              ✓ Abonnement activé avec succès
            </p>
          </div>
        )}
      </div>

      {/* Validate Next Step Button */}
      {canEdit && nextStep && !isTerminal && (
        <div className="mt-6 pt-4 border-t border-border">
          <AlertDialog open={confirmStep !== null} onOpenChange={(open) => !open && setConfirmStep(null)}>
            <AlertDialogTrigger asChild>
              <Button 
                className="w-full" 
                onClick={() => setConfirmStep(nextStep)}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <ChevronRight className="h-4 w-4 mr-2" />
                )}
                Valider: {statusLabels[nextStep]}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmer la validation</AlertDialogTitle>
                <AlertDialogDescription>
                  Voulez-vous vraiment passer le dossier à l'étape "{statusLabels[nextStep]}"?
                  <br /><br />
                  <span className="text-xs text-muted-foreground">
                    Étape actuelle: <strong>{statusLabels[currentStatus]}</strong>
                    <br />
                    Prochaine étape: <strong>{statusLabels[nextStep]}</strong>
                  </span>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={handleValidate}>
                  Confirmer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
}
