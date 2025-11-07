import { useState } from 'react';
import { Search, X, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Resident } from './MessagingPage';

interface NewConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  resident: Resident;
  onConversationCreated: (conversationId: string) => void;
}

interface Participant {
  id: string;
  name: string;
  role: 'staff' | 'home-health' | 'nurse' | 'hospice' | 'pharmacy' | 'doctor';
  title?: string;
  avatar?: string;
}

// Mock participants data
const mockParticipants: Participant[] = [
  // Staff
  { id: 's1', name: 'Jennifer Lee', role: 'staff', title: 'Care Coordinator' },
  { id: 's2', name: 'David Martinez', role: 'staff', title: 'Activities Director' },
  { id: 's3', name: 'Amanda Wilson', role: 'staff', title: 'Dining Services Manager' },
  
  // Nurses
  { id: 'n1', name: 'Emily Davis', role: 'nurse', title: 'RN, Charge Nurse' },
  { id: 'n2', name: 'Michael Thompson', role: 'nurse', title: 'LPN' },
  { id: 'n3', name: 'Sarah Collins', role: 'nurse', title: 'RN, Night Shift' },
  
  // Doctors
  { id: 'd1', name: 'Dr. Sarah Johnson', role: 'doctor', title: 'Primary Care Physician' },
  { id: 'd2', name: 'Dr. Patricia Williams', role: 'doctor', title: 'Geriatric Specialist' },
  { id: 'd3', name: 'Dr. James Anderson', role: 'doctor', title: 'Cardiologist' },
  
  // Pharmacy
  { id: 'p1', name: 'Michael Brown', role: 'pharmacy', title: 'Clinical Pharmacist' },
  { id: 'p2', name: 'Lisa Chang', role: 'pharmacy', title: 'Pharmacy Technician' },
  
  // Home Health
  { id: 'h1', name: 'Robert Garcia', role: 'home-health', title: 'Physical Therapist' },
  { id: 'h2', name: 'Maria Rodriguez', role: 'home-health', title: 'Occupational Therapist' },
  { id: 'h3', name: 'John Smith', role: 'home-health', title: 'Home Health Aide' },
  
  // Hospice
  { id: 'ho1', name: 'Rachel Green', role: 'hospice', title: 'Hospice Nurse' },
  { id: 'ho2', name: 'Thomas White', role: 'hospice', title: 'Hospice Social Worker' },
  { id: 'ho3', name: 'Karen Miller', role: 'hospice', title: 'Chaplain' },
];

const roleLabels = {
  all: 'All Roles',
  staff: 'Staff',
  'home-health': 'Home Health Agency',
  nurse: 'Nurse',
  hospice: 'Hospice',
  pharmacy: 'Pharmacy',
  doctor: 'Doctor',
};

const roleColors = {
  staff: 'bg-[#eff6ff] text-[#2563eb] border-[#2563eb]',
  'home-health': 'bg-[#f0fdf4] text-[#16a34a] border-[#16a34a]',
  nurse: 'bg-[#faf5ff] text-[#8b5cf6] border-[#8b5cf6]',
  hospice: 'bg-[#fdf2f8] text-[#ec4899] border-[#ec4899]',
  pharmacy: 'bg-[#fffbeb] text-[#d97706] border-[#d97706]',
  doctor: 'bg-[#fef2f2] text-[#dc2626] border-[#dc2626]',
};

export function NewConversationModal({
  isOpen,
  onClose,
  resident,
  onConversationCreated,
}: NewConversationModalProps) {
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);

  const handleClose = () => {
    setSelectedRole('all');
    setSearchTerm('');
    setSelectedParticipants([]);
    onClose();
  };

  const handleToggleParticipant = (participantId: string) => {
    setSelectedParticipants((prev) =>
      prev.includes(participantId)
        ? prev.filter((id) => id !== participantId)
        : [...prev, participantId]
    );
  };

  const handleCreateConversation = () => {
    if (selectedParticipants.length === 0) return;
    
    // In a real app, this would create a new conversation in the backend
    const newConversationId = `conv-new-${Date.now()}`;
    console.log('Creating conversation:', {
      residentId: resident.id,
      participants: selectedParticipants,
    });
    
    onConversationCreated(newConversationId);
    handleClose();
  };

  const filteredParticipants = mockParticipants.filter((participant) => {
    const matchesRole = selectedRole === 'all' || participant.role === selectedRole;
    const matchesSearch = participant.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
      (participant.title?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    return matchesRole && matchesSearch;
  });

  const selectedParticipantObjects = mockParticipants.filter((p) =>
    selectedParticipants.includes(p.id)
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] w-[calc(100vw-2rem)] mx-4">
        <DialogHeader>
          <DialogTitle className="text-[#1e293b]">
            New Conversation for {resident.firstName} {resident.lastName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Role Filter */}
          <div className="space-y-2">
            <Label>Filter by Role</Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="nurse">Nurse</SelectItem>
                <SelectItem value="doctor">Doctor</SelectItem>
                <SelectItem value="pharmacy">Pharmacy</SelectItem>
                <SelectItem value="home-health">Home Health Agency</SelectItem>
                <SelectItem value="hospice">Hospice</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search */}
          <div className="space-y-2">
            <Label>Search Participants</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#64748b]" />
              <Input
                placeholder="Search by name or title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Selected Participants */}
          {selectedParticipants.length > 0 && (
            <div className="space-y-2">
              <Label>Selected ({selectedParticipants.length})</Label>
              <div className="flex flex-wrap gap-2 p-3 bg-[#f9fafb] rounded-lg border min-h-[60px]">
                {selectedParticipantObjects.map((participant) => (
                  <Badge
                    key={participant.id}
                    className={`${roleColors[participant.role]} border gap-2 pr-1`}
                  >
                    {participant.name}
                    <button
                      onClick={() => handleToggleParticipant(participant.id)}
                      className="hover:bg-black/10 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Participants List */}
          <div className="space-y-2">
            <Label>
              Available Participants ({filteredParticipants.length})
            </Label>
            <div className="border rounded-lg max-h-[300px] overflow-y-auto">
              {filteredParticipants.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-[#64748b]">No participants found</p>
                </div>
              ) : (
                filteredParticipants.map((participant) => {
                  const isSelected = selectedParticipants.includes(participant.id);
                  const initials = participant.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('');

                  return (
                    <button
                      key={participant.id}
                      onClick={() => handleToggleParticipant(participant.id)}
                      className={`w-full p-3 border-b hover:bg-[#f9fafb] transition-colors text-left flex items-center gap-3 ${
                        isSelected ? 'bg-[#eff6ff]' : ''
                      }`}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleToggleParticipant(participant.id)}
                      />

                      <Avatar className="h-10 w-10">
                        <AvatarImage src={participant.avatar} />
                        <AvatarFallback className="bg-[#eff6ff] text-[#2563eb] text-xs">
                          {initials}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm text-[#1e293b] truncate">
                          {participant.name}
                        </h4>
                        <p className="text-xs text-[#64748b] truncate">
                          {participant.title}
                        </p>
                      </div>

                      <Badge className={`${roleColors[participant.role]} border text-xs`}>
                        {roleLabels[participant.role]}
                      </Badge>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateConversation}
            disabled={selectedParticipants.length === 0}
            className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white"
          >
            <Check className="h-4 w-4 mr-2" />
            Create Conversation
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
