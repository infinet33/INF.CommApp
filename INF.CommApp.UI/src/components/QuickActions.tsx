import { Card } from './ui/card';
import { Button } from './ui/button';
import { AlertTriangle, UserPlus, Stethoscope, FileText } from 'lucide-react';

export function QuickActions() {
  const actions = [
    {
      icon: AlertTriangle,
      label: 'Emergency Alert',
      variant: 'destructive' as const,
      color: 'bg-[#dc2626]'
    },
    {
      icon: UserPlus,
      label: 'Admit Patient',
      variant: 'default' as const,
      color: 'bg-[#2563eb]'
    },
    {
      icon: Stethoscope,
      label: 'Staff Check-In',
      variant: 'default' as const,
      color: 'bg-[#16a34a]'
    },
    {
      icon: FileText,
      label: 'Generate Report',
      variant: 'outline' as const,
      color: 'border-[#64748b]'
    }
  ];

  return (
    <Card className="p-6">
      <h3 className="text-[#1e293b] mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.label}
              variant={action.variant}
              className="h-auto py-4 flex flex-col gap-2"
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{action.label}</span>
            </Button>
          );
        })}
      </div>
    </Card>
  );
}
