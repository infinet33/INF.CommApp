import { AlertTriangle, Pill, Utensils, MoreHorizontal } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Checkbox } from './ui/checkbox';
import { Resident } from './ResidentsPage';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';

interface ResidentCardProps {
  resident: Resident;
  isSelected: boolean;
  onSelect: (id: string, checked: boolean) => void;
  onViewDetails: (resident: Resident) => void;
}

export function ResidentCard({ resident, isSelected, onSelect, onViewDetails }: ResidentCardProps) {
  const careLevelColors = {
    Independent: 'bg-[#f1f5f9] text-[#16a34a] border-2 border-[#16a34a]',
    Assisted: 'bg-[#f1f5f9] text-[#d97706] border-2 border-[#d97706]',
    'Full Care': 'bg-[#f1f5f9] text-[#dc2626] border-2 border-[#dc2626]',
  };

  const initials = `${resident.firstName[0]}${resident.lastName[0]}`;
  const displayNickname = resident.preferredName || resident.firstName;
  
  // Check if there are any red (critical) medical alerts
  const hasRedAlerts = resident.medicalAlerts.fallRisk || 
                       resident.medicalAlerts.allergies || 
                       resident.medicalAlerts.medicationAlerts;

  return (
    <Card className="relative hover:shadow-lg transition-shadow h-[420px] flex flex-col">
      <CardContent className="p-4 flex flex-col h-full">
        {/* Selection Checkbox */}
        <div className="absolute top-4 left-4 z-10">
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => onSelect(resident.id, checked as boolean)}
          />
        </div>

        {/* Room Number Badge */}
        <div className="absolute top-4 right-4">
          <Badge className="bg-transparent text-[#1e293b] border-0 shadow-none px-0">
            <span className="font-bold text-base">Room {resident.roomNumber}</span>
          </Badge>
        </div>

        {/* Profile Section */}
        <div className="flex flex-col items-center mt-8 mb-4">
          <Avatar className="h-20 w-20 mb-3">
            <AvatarImage src={resident.photo} />
            <AvatarFallback className="bg-[#eff6ff] text-[#2563eb]">
              {initials}
            </AvatarFallback>
          </Avatar>
          <h3 className="text-[#1e293b] text-center">
            {resident.firstName} {resident.lastName}
          </h3>
          <p className="text-sm text-[#64748b] mt-1">
            "{displayNickname}"
          </p>
        </div>

        {/* Details */}
        <div className="space-y-3 flex-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#64748b]">Age:</span>
            <span className="text-[#1e293b]">{resident.age} years</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#64748b]">DOB:</span>
            <span className="text-[#1e293b]">
              {new Date(resident.dateOfBirth).toLocaleDateString()}
            </span>
          </div>

          {/* Care Level */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#64748b]">Care Level:</span>
            <Badge className={`${careLevelColors[resident.careLevel]} rounded-sm`}>
              {resident.careLevel}
            </Badge>
          </div>

          {/* Medical Alerts */}
          {(resident.medicalAlerts.fallRisk ||
            resident.medicalAlerts.allergies ||
            resident.medicalAlerts.dietaryRestrictions ||
            resident.medicalAlerts.medicationAlerts) && (
            <div className="pt-2 border-t">
              <div className="flex items-center justify-between">
                <p className="text-xs text-[#64748b]">Medical Alerts:</p>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`h-6 w-6 p-0 ${hasRedAlerts ? 'text-[#dc2626] hover:text-[#dc2626] hover:bg-[#fef2f2]' : 'text-[#64748b]'}`}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80" align="end">
                    <div className="space-y-3">
                      <h4 className="text-sm text-[#1e293b]">Medical Alerts</h4>
                      <div className="flex flex-col gap-2">
                        <TooltipProvider>
                          {resident.medicalAlerts.fallRisk && (
                            <div className="flex items-center gap-2 p-2 bg-[#fef2f2] rounded">
                              <AlertTriangle className="h-4 w-4 text-[#dc2626]" />
                              <div>
                                <p className="text-sm text-[#1e293b]">Fall Risk</p>
                                <p className="text-xs text-[#64748b]">Resident is at risk for falls</p>
                              </div>
                            </div>
                          )}
                          {resident.medicalAlerts.allergies && (
                            <div className="flex items-center gap-2 p-2 bg-[#fef2f2] rounded">
                              <Pill className="h-4 w-4 text-[#dc2626]" />
                              <div>
                                <p className="text-sm text-[#1e293b]">Allergies</p>
                                <p className="text-xs text-[#64748b]">{resident.allergies.join(', ')}</p>
                              </div>
                            </div>
                          )}
                          {resident.medicalAlerts.dietaryRestrictions && (
                            <div className="flex items-center gap-2 p-2 bg-[#fffbeb] rounded">
                              <Utensils className="h-4 w-4 text-[#d97706]" />
                              <div>
                                <p className="text-sm text-[#1e293b]">Dietary Restrictions</p>
                                <p className="text-xs text-[#64748b]">{resident.dietaryRestrictions.join(', ')}</p>
                              </div>
                            </div>
                          )}
                          {resident.medicalAlerts.medicationAlerts && (
                            <div className="flex items-center gap-2 p-2 bg-[#fef2f2] rounded">
                              <Pill className="h-4 w-4 text-[#dc2626]" />
                              <div>
                                <p className="text-sm text-[#1e293b]">Medication Alert</p>
                                <p className="text-xs text-[#64748b]">Special medication monitoring required</p>
                              </div>
                            </div>
                          )}
                        </TooltipProvider>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-4">
          <Button
            onClick={() => onViewDetails(resident)}
            className="w-full bg-[#e5e7eb] hover:bg-[#d1d5db] text-[#1e293b]"
            size="sm"
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
