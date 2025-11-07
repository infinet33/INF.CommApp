import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

interface Notification {
  id: number;
  type: 'critical' | 'warning' | 'success' | 'info';
  title: string;
  message: string;
  time: string;
}

export function NotificationPanel() {
  const notifications: Notification[] = [
    {
      id: 1,
      type: 'critical',
      title: 'Critical Alert',
      message: 'Patient vitals abnormal in Room 302',
      time: '2 min ago'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Medication Due',
      message: '5 patients require medication within 30 minutes',
      time: '15 min ago'
    },
    {
      id: 3,
      type: 'success',
      title: 'Discharge Complete',
      message: 'Patient John Doe successfully discharged',
      time: '1 hour ago'
    },
    {
      id: 4,
      type: 'info',
      title: 'Staff Schedule',
      message: 'Night shift assignments updated',
      time: '2 hours ago'
    }
  ];

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'critical':
        return <AlertCircle className="h-5 w-5 text-[#dc2626]" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-[#d97706]" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-[#16a34a]" />;
      case 'info':
        return <Info className="h-5 w-5 text-[#2563eb]" />;
    }
  };

  const getBadgeColor = (type: Notification['type']) => {
    switch (type) {
      case 'critical':
        return 'bg-[#fef2f2] text-[#dc2626] border-[#dc2626]';
      case 'warning':
        return 'bg-[#fffbeb] text-[#d97706] border-[#d97706]';
      case 'success':
        return 'bg-[#f0fdf4] text-[#16a34a] border-[#16a34a]';
      case 'info':
        return 'bg-[#eff6ff] text-[#2563eb] border-[#2563eb]';
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-[#1e293b] mb-4">Recent Notifications</h3>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="flex gap-3 p-3 rounded-lg bg-[#f9fafb] hover:bg-[#f1f5f9] transition-colors"
          >
            <div className="mt-0.5">
              {getNotificationIcon(notification.type)}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-1">
                <p className="text-sm text-[#1e293b]">{notification.title}</p>
                <Badge variant="outline" className={`text-xs ${getBadgeColor(notification.type)}`}>
                  {notification.type}
                </Badge>
              </div>
              <p className="text-sm text-[#64748b] mb-1">{notification.message}</p>
              <p className="text-xs text-[#94a3b8]">{notification.time}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
