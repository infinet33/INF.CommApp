import { Plus, Users, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Resident, Conversation } from './MessagingPage';

interface ConversationListProps {
  resident: Resident;
  selectedConversation: string | null;
  onSelectConversation: (conversationId: string) => void;
  onNewConversation: () => void;
  onBack?: () => void;
}

// Mock conversations data
const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    residentId: '1',
    participants: [
      { id: 'u1', name: 'Dr. Sarah Johnson', role: 'doctor' },
      { id: 'u2', name: 'Emily Davis', role: 'nurse' },
    ],
    lastMessage: {
      text: 'Blood pressure reading looks good today.',
      sender: 'Emily Davis',
      timestamp: '2025-11-06T10:30:00Z',
    },
    unread: true,
  },
  {
    id: 'conv-2',
    residentId: '1',
    participants: [
      { id: 'u3', name: 'Michael Brown', role: 'pharmacy' },
    ],
    lastMessage: {
      text: 'Medication refill has been approved.',
      sender: 'Michael Brown',
      timestamp: '2025-11-05T14:20:00Z',
    },
    unread: true,
  },
  {
    id: 'conv-3',
    residentId: '1',
    participants: [
      { id: 'u4', name: 'Jennifer Lee', role: 'staff' },
      { id: 'u5', name: 'David Martinez', role: 'staff' },
    ],
    lastMessage: {
      text: 'Family visit scheduled for tomorrow at 2 PM.',
      sender: 'Jennifer Lee',
      timestamp: '2025-11-04T16:45:00Z',
    },
    unread: false,
  },
  {
    id: 'conv-4',
    residentId: '2',
    participants: [
      { id: 'u6', name: 'Home Health Team', role: 'home-health' },
    ],
    lastMessage: {
      text: 'Physical therapy session completed successfully.',
      sender: 'Home Health Team',
      timestamp: '2025-11-06T09:15:00Z',
    },
    unread: false,
  },
  {
    id: 'conv-5',
    residentId: '3',
    participants: [
      { id: 'u7', name: 'Dr. Patricia Williams', role: 'doctor' },
    ],
    lastMessage: {
      text: 'Lab results are in. Everything looks normal.',
      sender: 'Dr. Patricia Williams',
      timestamp: '2025-11-06T11:00:00Z',
    },
    unread: true,
  },
  {
    id: 'conv-6',
    residentId: '5',
    participants: [
      { id: 'u8', name: 'Hospice Care Team', role: 'hospice' },
      { id: 'u2', name: 'Emily Davis', role: 'nurse' },
    ],
    lastMessage: {
      text: 'Pain management plan updated.',
      sender: 'Hospice Care Team',
      timestamp: '2025-11-06T08:30:00Z',
    },
    unread: true,
  },
  {
    id: 'conv-7',
    residentId: '5',
    participants: [
      { id: 'u4', name: 'Jennifer Lee', role: 'staff' },
    ],
    lastMessage: {
      text: 'Dietary preferences noted.',
      sender: 'Jennifer Lee',
      timestamp: '2025-11-05T12:00:00Z',
    },
    unread: true,
  },
  {
    id: 'conv-8',
    residentId: '5',
    participants: [
      { id: 'u3', name: 'Michael Brown', role: 'pharmacy' },
    ],
    lastMessage: {
      text: 'New prescription ready for pickup.',
      sender: 'Michael Brown',
      timestamp: '2025-11-05T10:00:00Z',
    },
    unread: true,
  },
];

const roleColors = {
  staff: 'text-[#2563eb]',
  'home-health': 'text-[#16a34a]',
  nurse: 'text-[#8b5cf6]',
  hospice: 'text-[#ec4899]',
  pharmacy: 'text-[#d97706]',
  doctor: 'text-[#dc2626]',
};

const roleLabels = {
  staff: 'Staff',
  'home-health': 'Home Health',
  nurse: 'Nurse',
  hospice: 'Hospice',
  pharmacy: 'Pharmacy',
  doctor: 'Doctor',
};

export function ConversationList({
  resident,
  selectedConversation,
  onSelectConversation,
  onNewConversation,
  onBack,
}: ConversationListProps) {
  const conversations = mockConversations.filter(
    (conv) => conv.residentId === resident.id
  );

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  return (
    <div className="w-full bg-white rounded-lg border flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center gap-3 mb-2">
          {onBack && (
            <Button
              onClick={onBack}
              variant="ghost"
              size="icon"
              className="lg:hidden"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <h2 className="text-[#1e293b] flex-1">
            Conversations
          </h2>
          <Button
            onClick={onNewConversation}
            size="sm"
            className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white"
          >
            <Plus className="h-4 w-4 lg:mr-1" />
            <span className="hidden lg:inline">New</span>
          </Button>
        </div>
        <p className="text-sm text-[#64748b]">
          {resident.firstName} {resident.lastName} - Room {resident.room}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-[#64748b] mb-4">No conversations yet</p>
            <Button
              onClick={onNewConversation}
              variant="outline"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Start a conversation
            </Button>
          </div>
        ) : (
          conversations.map((conversation) => {
            const isSelected = selectedConversation === conversation.id;
            
            return (
              <button
                key={conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                className={`w-full p-4 border-b hover:bg-[#f9fafb] transition-colors text-left ${
                  isSelected ? 'bg-[#eff6ff]' : ''
                } ${conversation.unread ? 'bg-[#fefefe]' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    {conversation.participants.length === 1 ? (
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={conversation.participants[0].avatar} />
                        <AvatarFallback className="bg-[#eff6ff] text-[#2563eb] text-xs">
                          {conversation.participants[0].name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-[#eff6ff] flex items-center justify-center">
                        <Users className="h-5 w-5 text-[#2563eb]" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex-1 min-w-0">
                        <h3
                          className={`text-sm truncate ${
                            conversation.unread
                              ? 'text-[#1e293b]'
                              : 'text-[#1e293b]'
                          }`}
                        >
                          {conversation.participants.map((p) => p.name).join(', ')}
                        </h3>
                        <div className="flex items-center gap-1 mt-0.5">
                          {conversation.participants.map((p, index) => (
                            <span
                              key={p.id}
                              className={`text-xs ${roleColors[p.role]}`}
                            >
                              {roleLabels[p.role]}
                              {index < conversation.participants.length - 1 && ', '}
                            </span>
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-[#64748b] ml-2 whitespace-nowrap">
                        {formatTimestamp(conversation.lastMessage.timestamp)}
                      </span>
                    </div>
                    <p
                      className={`text-xs truncate ${
                        conversation.unread
                          ? 'text-[#1e293b]'
                          : 'text-[#64748b]'
                      }`}
                    >
                      {conversation.lastMessage.text}
                    </p>
                  </div>

                  {conversation.unread && (
                    <div className="w-2 h-2 bg-[#2563eb] rounded-full mt-1 flex-shrink-0" />
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
