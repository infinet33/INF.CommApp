import { useState } from 'react';
import { Search, ArrowLeft } from 'lucide-react';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { NormalUserConversationList } from './NormalUserConversationList';
import { NormalUserChatView } from './NormalUserChatView';
import { Badge } from './ui/badge';

export interface Conversation {
  id: string;
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

// Mock conversations for normal user (conversations they are part of)
const mockUserConversations: Conversation[] = [
  {
    id: 'conv-1',
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
    participants: [
      { id: 'u3', name: 'Michael Brown', role: 'pharmacy' },
    ],
    lastMessage: {
      text: 'Medication refill has been approved.',
      sender: 'Michael Brown',
      timestamp: '2025-11-05T14:20:00Z',
    },
    unread: false,
  },
  {
    id: 'conv-3',
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
    participants: [
      { id: 'u6', name: 'Comfort Care Hospice', role: 'hospice' },
    ],
    lastMessage: {
      text: 'We are available 24/7 for any questions.',
      sender: 'Comfort Care Hospice',
      timestamp: '2025-11-03T09:15:00Z',
    },
    unread: false,
  },
  {
    id: 'conv-5',
    participants: [
      { id: 'u7', name: 'Home Health Team', role: 'home-health' },
    ],
    lastMessage: {
      text: 'Physical therapy session completed successfully.',
      sender: 'Home Health Team',
      timestamp: '2025-11-02T11:00:00Z',
    },
    unread: false,
  },
];

export function NormalUserMessagingPage() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredConversations = mockUserConversations.filter((conversation) =>
    conversation.participants.some((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleBackToConversations = () => {
    setSelectedConversation(null);
  };

  // Determine which view to show on mobile
  const showConversationList = !selectedConversation;
  const showChatView = selectedConversation;

  return (
    <div className="flex gap-4 h-full">
      {/* Conversation List Panel */}
      <div className={`w-full lg:w-96 ${
        showConversationList ? 'flex' : 'hidden'
      } lg:flex`}>
        <NormalUserConversationList
          conversations={filteredConversations}
          selectedConversation={selectedConversation}
          onSelectConversation={setSelectedConversation}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      </div>

      {/* Chat View Panel */}
      {selectedConversation ? (
        <div className={`flex-1 ${
          showChatView ? 'flex' : 'hidden'
        } lg:flex`}>
          <NormalUserChatView
            conversationId={selectedConversation}
            conversation={mockUserConversations.find(c => c.id === selectedConversation)!}
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
    </div>
  );
}
