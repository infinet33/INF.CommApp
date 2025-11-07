import { useState } from 'react';
import { Search, Plus, ArrowLeft } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ConversationList } from './ConversationList';
import { ChatView } from './ChatView';
import { NewConversationModal } from './NewConversationModal';
import { Badge } from './ui/badge';

export interface Resident {
  id: string;
  firstName: string;
  lastName: string;
  photo?: string;
  room: string;
  careLevel: 'Independent' | 'Assisted' | 'Full Care';
  unreadCount: number;
}

export interface Conversation {
  id: string;
  residentId: string;
  participants: {
    id: string;
    name: string;
    role: 'staff' | 'home-health' | 'nurse' | 'hospice' | 'pharmacy' | 'doctor';
    avatar?: string;
  }[];
  lastMessage: {
    text: string;
    sender: string;
    timestamp: string;
  };
  unread: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  text: string;
  timestamp: string;
  isCurrentUser?: boolean;
}

// Mock data
const mockResidents: Resident[] = [
  {
    id: '1',
    firstName: 'Margaret',
    lastName: 'Anderson',
    room: '102A',
    careLevel: 'Assisted',
    unreadCount: 2,
  },
  {
    id: '2',
    firstName: 'Robert',
    lastName: 'Chen',
    room: '105B',
    careLevel: 'Full Care',
    unreadCount: 0,
  },
  {
    id: '3',
    firstName: 'Dorothy',
    lastName: 'Martinez',
    room: '108A',
    careLevel: 'Independent',
    unreadCount: 1,
  },
  {
    id: '4',
    firstName: 'James',
    lastName: 'Wilson',
    room: '112C',
    careLevel: 'Assisted',
    unreadCount: 0,
  },
  {
    id: '5',
    firstName: 'Barbara',
    lastName: 'Taylor',
    room: '203A',
    careLevel: 'Full Care',
    unreadCount: 3,
  },
];

export function MessagingPage() {
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewConversation, setShowNewConversation] = useState(false);

  const filteredResidents = mockResidents.filter((resident) =>
    `${resident.firstName} ${resident.lastName} ${resident.room}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleResidentSelect = (resident: Resident) => {
    setSelectedResident(resident);
    setSelectedConversation(null);
  };

  const handleNewConversation = () => {
    setShowNewConversation(true);
  };

  const handleConversationCreated = (conversationId: string) => {
    setShowNewConversation(false);
    setSelectedConversation(conversationId);
  };

  const handleBackToResidents = () => {
    setSelectedResident(null);
    setSelectedConversation(null);
  };

  const handleBackToConversations = () => {
    setSelectedConversation(null);
  };

  // Determine which view to show on mobile
  const showResidentList = !selectedResident;
  const showConversationList = selectedResident && !selectedConversation;
  const showChatView = selectedResident && selectedConversation;

  return (
    <div className="flex gap-4 h-full">
      {/* Resident Selection Panel */}
      <div className={`w-full lg:w-80 bg-white rounded-lg border flex flex-col ${
        showResidentList ? 'flex' : 'hidden'
      } lg:flex`}>
        <div className="p-4 border-b">
          <h2 className="text-[#1e293b] mb-3">Select Resident</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#64748b]" />
            <Input
              placeholder="Search residents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {filteredResidents.map((resident) => {
            const initials = `${resident.firstName[0]}${resident.lastName[0]}`;
            const isSelected = selectedResident?.id === resident.id;
            
            return (
              <button
                key={resident.id}
                onClick={() => handleResidentSelect(resident)}
                className={`w-full p-4 border-b hover:bg-[#f9fafb] transition-colors text-left ${
                  isSelected ? 'bg-[#eff6ff]' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={resident.photo} />
                    <AvatarFallback className="bg-[#eff6ff] text-[#2563eb]">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm text-[#1e293b] truncate">
                        {resident.firstName} {resident.lastName}
                      </h3>
                      {resident.unreadCount > 0 && (
                        <Badge className="bg-[#dc2626] text-white ml-2">
                          {resident.unreadCount}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-[#64748b]">Room {resident.room}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Conversation List Panel */}
      {selectedResident ? (
        <>
          <div className={`w-full lg:w-96 ${
            showConversationList ? 'flex' : 'hidden'
          } lg:flex`}>
            <ConversationList
              resident={selectedResident}
              selectedConversation={selectedConversation}
              onSelectConversation={setSelectedConversation}
              onNewConversation={handleNewConversation}
              onBack={handleBackToResidents}
            />
          </div>

          {/* Chat View Panel */}
          {selectedConversation ? (
            <div className={`flex-1 ${
              showChatView ? 'flex' : 'hidden'
            } lg:flex`}>
              <ChatView
                conversationId={selectedConversation}
                resident={selectedResident}
                onBack={handleBackToConversations}
              />
            </div>
          ) : (
            <div className="hidden lg:flex flex-1 bg-white rounded-lg border items-center justify-center">
              <div className="text-center">
                <p className="text-[#64748b]">Select a conversation to view messages</p>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="hidden lg:flex flex-1 bg-white rounded-lg border items-center justify-center">
          <div className="text-center">
            <p className="text-[#64748b]">Select a resident to view their conversations</p>
          </div>
        </div>
      )}

      {/* New Conversation Modal */}
      {selectedResident && (
        <NewConversationModal
          isOpen={showNewConversation}
          onClose={() => setShowNewConversation(false)}
          resident={selectedResident}
          onConversationCreated={handleConversationCreated}
        />
      )}
    </div>
  );
}
