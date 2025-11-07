import { Bell, Settings, Users } from 'lucide-react';
import { Menu } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface HeaderProps {
  onMenuClick?: () => void;
  userType?: 'admin' | 'normal';
  onUserTypeToggle?: () => void;
}

export function Header({ onMenuClick, userType = 'admin', onUserTypeToggle }: HeaderProps) {
  return (
    <header className="border-b bg-white px-4 md:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5 text-[#64748b]" />
          </Button>
          
          <div>
            <h1 className="text-[#1e293b] text-base md:text-lg">Valencia Assisted Living of Cottonwood</h1>
            <p className="text-xs md:text-sm text-[#64748b]">
              {userType === 'admin' ? 'Cottonwood, AZ' : 'Family Portal'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          {/* Demo Toggle Button */}
          {onUserTypeToggle && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={onUserTypeToggle}
              className="hidden sm:flex items-center gap-2 text-xs"
            >
              <Users className="h-4 w-4" />
              {userType === 'admin' ? 'Switch to User View' : 'Switch to Admin View'}
            </Button>
          )}
          
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5 text-[#64748b]" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#dc2626] p-0 flex items-center justify-center text-xs">
              3
            </Badge>
          </Button>
          
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Settings className="h-5 w-5 text-[#64748b]" />
          </Button>
          
          <div className="hidden md:flex items-center gap-3 border-l pl-4">
            <div className="text-right">
              <p className="text-sm text-[#1e293b]">
                {userType === 'admin' ? 'Dr. Sarah Johnson' : 'Jane Anderson'}
              </p>
              <p className="text-xs text-[#64748b]">
                {userType === 'admin' ? 'Administrator' : 'Family Member'}
              </p>
            </div>
            <Avatar>
              <AvatarImage src="" />
              <AvatarFallback className="bg-[#2563eb] text-white">
                {userType === 'admin' ? 'SJ' : 'JA'}
              </AvatarFallback>
            </Avatar>
          </div>
          
          {/* Mobile avatar only */}
          <Avatar className="md:hidden h-8 w-8">
            <AvatarImage src="" />
            <AvatarFallback className="bg-[#2563eb] text-white text-xs">
              {userType === 'admin' ? 'SJ' : 'JA'}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
