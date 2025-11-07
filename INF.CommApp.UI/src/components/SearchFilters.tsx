import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Slider } from './ui/slider';
import { Resident } from './ResidentsPage';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import { Badge } from './ui/badge';

interface SearchFiltersProps {
  residents: Resident[];
  onFilter: (filtered: Resident[]) => void;
}

export function SearchFilters({ residents, onFilter }: SearchFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [careLevel, setCareLevel] = useState<string>('all');
  const [medicalAlert, setMedicalAlert] = useState<string>('all');
  const [ageRange, setAgeRange] = useState<number[]>([0, 100]);
  const [roomNumber, setRoomNumber] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const activeFiltersCount = [
    searchTerm,
    careLevel !== 'all',
    medicalAlert !== 'all',
    ageRange[0] !== 0 || ageRange[1] !== 100,
    roomNumber,
  ].filter(Boolean).length;

  const applyFilters = () => {
    let filtered = [...residents];

    // Search by name, room, or medical record number
    if (searchTerm) {
      filtered = filtered.filter(
        (r) =>
          r.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.medicalRecordNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by care level
    if (careLevel !== 'all') {
      filtered = filtered.filter((r) => r.careLevel === careLevel);
    }

    // Filter by medical alert
    if (medicalAlert !== 'all') {
      filtered = filtered.filter((r) => {
        switch (medicalAlert) {
          case 'fallRisk':
            return r.medicalAlerts.fallRisk;
          case 'allergies':
            return r.medicalAlerts.allergies;
          case 'dietary':
            return r.medicalAlerts.dietaryRestrictions;
          case 'medication':
            return r.medicalAlerts.medicationAlerts;
          default:
            return true;
        }
      });
    }

    // Filter by age range
    filtered = filtered.filter(
      (r) => r.age >= ageRange[0] && r.age <= ageRange[1]
    );

    // Filter by room number
    if (roomNumber) {
      filtered = filtered.filter((r) =>
        r.roomNumber.toLowerCase().includes(roomNumber.toLowerCase())
      );
    }

    onFilter(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCareLevel('all');
    setMedicalAlert('all');
    setAgeRange([0, 100]);
    setRoomNumber('');
    onFilter(residents);
  };

  // Apply filters whenever any filter changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setTimeout(() => applyFilters(), 300);
  };

  const handleCareLevelChange = (value: string) => {
    setCareLevel(value);
    setTimeout(() => applyFilters(), 0);
  };

  const handleMedicalAlertChange = (value: string) => {
    setMedicalAlert(value);
    setTimeout(() => applyFilters(), 0);
  };

  const handleAgeRangeChange = (value: number[]) => {
    setAgeRange(value);
  };

  const handleRoomNumberChange = (value: string) => {
    setRoomNumber(value);
    setTimeout(() => applyFilters(), 300);
  };

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#64748b]" />
          <Input
            placeholder="Search by name, room number, or medical record number..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2 relative">
              <Filter className="h-4 w-4" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-[#2563eb] p-0 flex items-center justify-center text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm text-[#1e293b]">Advanced Filters</h4>
                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-auto p-0 text-[#2563eb]"
                  >
                    Clear all
                  </Button>
                )}
              </div>

              {/* Care Level Filter */}
              <div className="space-y-2">
                <label className="text-sm text-[#64748b]">Care Level</label>
                <Select value={careLevel} onValueChange={handleCareLevelChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select care level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="Independent">Independent</SelectItem>
                    <SelectItem value="Assisted">Assisted</SelectItem>
                    <SelectItem value="Full Care">Full Care</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Medical Alert Filter */}
              <div className="space-y-2">
                <label className="text-sm text-[#64748b]">Medical Alerts</label>
                <Select value={medicalAlert} onValueChange={handleMedicalAlertChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select alert type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Alerts</SelectItem>
                    <SelectItem value="fallRisk">Fall Risk</SelectItem>
                    <SelectItem value="allergies">Allergies</SelectItem>
                    <SelectItem value="dietary">Dietary Restrictions</SelectItem>
                    <SelectItem value="medication">Medication Alerts</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Age Range Filter */}
              <div className="space-y-2">
                <label className="text-sm text-[#64748b]">
                  Age Range: {ageRange[0]} - {ageRange[1]}
                </label>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={ageRange}
                  onValueChange={handleAgeRangeChange}
                  onValueCommit={applyFilters}
                  className="py-4"
                />
              </div>

              {/* Room Number Filter */}
              <div className="space-y-2">
                <label className="text-sm text-[#64748b]">Room Number</label>
                <Input
                  placeholder="e.g., 101A"
                  value={roomNumber}
                  onChange={(e) => handleRoomNumberChange(e.target.value)}
                />
              </div>

              <Button
                onClick={() => {
                  applyFilters();
                  setIsFilterOpen(false);
                }}
                className="w-full bg-[#2563eb] hover:bg-[#1d4ed8]"
              >
                Apply Filters
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <Badge variant="secondary" className="gap-2">
              Search: {searchTerm}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  setSearchTerm('');
                  setTimeout(() => applyFilters(), 0);
                }}
              />
            </Badge>
          )}
          {careLevel !== 'all' && (
            <Badge variant="secondary" className="gap-2">
              Care: {careLevel}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  setCareLevel('all');
                  setTimeout(() => applyFilters(), 0);
                }}
              />
            </Badge>
          )}
          {medicalAlert !== 'all' && (
            <Badge variant="secondary" className="gap-2">
              Alert: {medicalAlert}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  setMedicalAlert('all');
                  setTimeout(() => applyFilters(), 0);
                }}
              />
            </Badge>
          )}
          {roomNumber && (
            <Badge variant="secondary" className="gap-2">
              Room: {roomNumber}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  setRoomNumber('');
                  setTimeout(() => applyFilters(), 0);
                }}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
