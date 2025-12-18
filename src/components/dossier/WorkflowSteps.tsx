import { Check, Circle, Clock } from 'lucide-react';
import { DossierStatus } from '@/types';
import { statusLabels } from '@/lib/mockData';
import { cn } from '@/lib/utils';

interface WorkflowStepsProps {
  currentStatus: DossierStatus;
}

const workflowSteps: DossierStatus[] = [
  'DRAFT',
  'DOSSIER_COMPLETE',
  'TECHNICAL_REVIEW',
  'WORKS_REQUIRED',
  'CONTRACT_SENT',
  'CONTRACT_SIGNED',
  'METER_INSTALLED',
  'INSTALLATION_REPORT_RECEIVED',
  'CUSTOMER_VALIDATED',
  'SUBSCRIPTION_ACTIVE',
];

export function WorkflowSteps({ currentStatus }: WorkflowStepsProps) {
  const currentIndex = workflowSteps.indexOf(currentStatus);
  const isTerminal = currentStatus === 'REJECTED' || currentStatus === 'CANCELLED';

  return (
    <div className="rounded-xl bg-card border border-border p-6 shadow-card">
      <h3 className="text-lg font-semibold text-card-foreground mb-6">
        Progression du dossier
      </h3>
      
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute left-[18px] top-4 bottom-4 w-0.5 bg-border" />
        
        {/* Completed Progress */}
        {currentIndex > 0 && (
          <div 
            className="absolute left-[18px] top-4 w-0.5 bg-status-active transition-all duration-500"
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

            return (
              <div 
                key={step} 
                className={cn(
                  "flex items-center gap-4 py-2.5 transition-all duration-200",
                  isCurrent && "scale-[1.02]"
                )}
              >
                <div className={cn(
                  "relative z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all duration-300",
                  isCompleted && "bg-status-active border-status-active",
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
                <div className="flex-1">
                  <p className={cn(
                    "text-sm font-medium transition-colors",
                    isCompleted && "text-status-active",
                    isCurrent && "text-primary",
                    isPending && "text-muted-foreground"
                  )}>
                    {statusLabels[step]}
                  </p>
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
      </div>
    </div>
  );
}
