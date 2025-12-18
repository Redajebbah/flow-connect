import { DossierStatus } from '@/types';
import { Badge } from '@/components/ui/badge';
import { statusLabels } from '@/lib/mockData';

interface StatusBadgeProps {
  status: DossierStatus;
  className?: string;
}

const statusVariants: Record<DossierStatus, "draft" | "pending" | "review" | "works" | "contract" | "active" | "rejected"> = {
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

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge variant={statusVariants[status]} className={className}>
      {statusLabels[status]}
    </Badge>
  );
}
