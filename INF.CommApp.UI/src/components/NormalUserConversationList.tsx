import { Search, Users, ExternalLink } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Conversation } from './NormalUserMessagingPage';

interface NormalUserConversationListProps {
  conversations: Conversation[];
  selectedConversation: string | null;
  onSelectConversation: (conversationId: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

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

export function NormalUserConversationList({
  conversations,
  selectedConversation,
  onSelectConversation,
  searchTerm,
  onSearchChange,
}: NormalUserConversationListProps) {
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
        <h2 className="text-[#1e293b] mb-3">Messages</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#64748b]" />
          <Input
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Preferred Provider Banner */}
      <div className="mx-4 mt-4 mb-3 p-4 bg-gradient-to-br from-[#2563eb] via-[#3b82f6] to-[#60a5fa] rounded-xl shadow-lg border border-[#1d4ed8]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-white mb-0.5">Caring Hands Home Health</h3>
            <p className="text-xs text-white/90 leading-relaxed mb-1">Trusted partner for in-home care services</p>
            <p className="text-xs text-white/80">Featured Partner</p>
          </div>
          <button className="flex items-center gap-1 text-xs text-white hover:text-white/80 transition-colors flex-shrink-0">
            <span className="font-bold">Learn More</span>
            <ExternalLink className="h-3 w-3" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-[#64748b]">No conversations found</p>
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
