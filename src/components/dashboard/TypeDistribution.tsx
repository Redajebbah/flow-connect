import { Droplets, Zap, Combine } from 'lucide-react';
import { SubscriptionType } from '@/types';
import { subscriptionTypeLabels } from '@/lib/mockData';

interface TypeDistributionProps {
  data: Record<SubscriptionType, number>;
}

export function TypeDistribution({ data }: TypeDistributionProps) {
  const total = Object.values(data).reduce((sum, count) => sum + count, 0);
  
  const items = [
    { type: 'water' as SubscriptionType, icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-100' },
    { type: 'electricity' as SubscriptionType, icon: Zap, color: 'text-amber-500', bg: 'bg-amber-100' },
    { type: 'both' as SubscriptionType, icon: Combine, color: 'text-purple-500', bg: 'bg-purple-100' },
  ];

  return (
    <div className="rounded-xl bg-card border border-border p-6 shadow-card animate-fade-in">
      <h3 className="text-lg font-semibold text-card-foreground mb-6">
        Types d'abonnement
      </h3>
      
      {/* Pie Chart Visualization */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative h-32 w-32">
          <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
            {items.reduce((acc, item, index) => {
              const percentage = (data[item.type] / total) * 100;
              const offset = acc.offset;
              const colors = ['#3B82F6', '#F59E0B', '#8B5CF6'];
              
              acc.elements.push(
                <circle
                  key={item.type}
                  cx="18"
                  cy="18"
                  r="15.9"
                  fill="transparent"
                  stroke={colors[index]}
                  strokeWidth="3.5"
                  strokeDasharray={`${percentage} ${100 - percentage}`}
                  strokeDashoffset={-offset}
                  className="transition-all duration-500"
                />
              );
              
              acc.offset += percentage;
              return acc;
            }, { elements: [] as JSX.Element[], offset: 0 }).elements}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{total}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {items.map(({ type, icon: Icon, color, bg }) => (
          <div key={type} className="flex items-center gap-3">
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${bg}`}>
              <Icon className={`h-4 w-4 ${color}`} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                {subscriptionTypeLabels[type]}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-foreground">{data[type]}</p>
              <p className="text-xs text-muted-foreground">
                {Math.round((data[type] / total) * 100)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
