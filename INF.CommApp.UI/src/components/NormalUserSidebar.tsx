import { MessageSquare, Calendar, FileText, Heart, Home, X } from 'lucide-react';
import { cn } from './ui/utils';
import { useFacility } from '../contexts/FacilityContext';

interface NavItem {
  icon: React.ElementType;
  label: string;
  id: string;
}

interface NormalUserSidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function NormalUserSidebar({ activePage, onNavigate, isOpen, onClose }: NormalUserSidebarProps) {
  const { facility } = useFacility();
  
  const navItems: NavItem[] = [
    { icon: MessageSquare, label: 'Messages', id: 'messages' },
    { icon: Calendar, label: 'Calendar', id: 'calendar' },
    { icon: FileText, label: 'Documents', id: 'documents' },
    { icon: Heart, label: 'Health', id: 'health' },
    { icon: Home, label: 'Home', id: 'home' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-[#e2e8f0] transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo and Close Button */}
        <div className="p-6 border-b border-[#e2e8f0] flex flex-col items-center relative">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-lg bg-[#2563eb] flex items-center justify-center">
              <span className="text-white font-bold text-lg">ALC</span>
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium text-[#1e293b]">{facility.name}</div>
            <div className="text-xs text-[#64748b]">{facility.address.city}, {facility.address.state}</div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-[#f9fafb] rounded-lg transition-colors absolute right-4 top-4"
          >
            <X className="h-5 w-5 text-[#64748b]" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => onNavigate(item.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left",
                      isActive
                        ? "bg-[#eff6ff] text-[#2563eb]"
                        : "text-[#64748b] hover:bg-[#f9fafb] hover:text-[#2563eb]"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-sm">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[#e2e8f0]">
          <div className="text-center">
            <p className="text-xs text-[#64748b]">Need help?</p>
            <p className="text-xs text-[#2563eb] cursor-pointer hover:underline">Contact Support</p>
          </div>
        </div>
      </aside>
    </>
  );
}
