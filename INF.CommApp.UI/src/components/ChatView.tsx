import { useState } from 'react';
import { Send, Phone, Video, MoreVertical, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Resident, Message } from './MessagingPage';

interface ChatViewProps {
  conversationId: string;
  resident: Resident;
  onBack?: () => void;
}

// Mock messages data
const mockMessages: { [key: string]: Message[] } = {
  'conv-1': [
    {
      id: 'm1',
      conversationId: 'conv-1',
      senderId: 'u2',
      senderName: 'Emily Davis',
      senderRole: 'Nurse',
      text: 'Good morning! Just completed the morning vitals check for Mrs. Anderson.',
      timestamp: '2025-11-06T08:00:00Z',
      isCurrentUser: false,
    },
    {
      id: 'm2',
      conversationId: 'conv-1',
      senderId: 'u1',
      senderName: 'Dr. Sarah Johnson',
      senderRole: 'Doctor',
      text: 'Thank you, Emily. How were the readings?',
      timestamp: '2025-11-06T08:15:00Z',
      isCurrentUser: false,
    },
    {
      id: 'm3',
      conversationId: 'conv-1',
      senderId: 'u2',
      senderName: 'Emily Davis',
      senderRole: 'Nurse',
      text: 'Blood pressure is 128/82, heart rate 74 bpm, temperature 98.4°F. All within normal range.',
      timestamp: '2025-11-06T08:18:00Z',
      isCurrentUser: false,
    },
    {
      id: 'm4',
      conversationId: 'conv-1',
      senderId: 'current-user',
      senderName: 'You',
      senderRole: 'Staff',
      text: 'That\'s great to hear. I\'ll update her care log.',
      timestamp: '2025-11-06T08:25:00Z',
      isCurrentUser: true,
    },
    {
      id: 'm5',
      conversationId: 'conv-1',
      senderId: 'u2',
      senderName: 'Emily Davis',
      senderRole: 'Nurse',
      text: 'Blood pressure reading looks good today.',
      timestamp: '2025-11-06T10:30:00Z',
      isCurrentUser: false,
    },
  ],
  'conv-2': [
    {
      id: 'm6',
      conversationId: 'conv-2',
      senderId: 'u3',
      senderName: 'Michael Brown',
      senderRole: 'Pharmacist',
      text: 'Hello, I\'ve reviewed Mrs. Anderson\'s medication list.',
      timestamp: '2025-11-05T13:00:00Z',
      isCurrentUser: false,
    },
    {
      id: 'm7',
      conversationId: 'conv-2',
      senderId: 'current-user',
      senderName: 'You',
      senderRole: 'Staff',
      text: 'Thank you! Does she need any refills?',
      timestamp: '2025-11-05T13:15:00Z',
      isCurrentUser: true,
    },
    {
      id: 'm8',
      conversationId: 'conv-2',
      senderId: 'u3',
      senderName: 'Michael Brown',
      senderRole: 'Pharmacist',
      text: 'Yes, her blood pressure medication needs a refill. I\'ve contacted her doctor for approval.',
      timestamp: '2025-11-05T13:30:00Z',
      isCurrentUser: false,
    },
    {
      id: 'm9',
      conversationId: 'conv-2',
      senderId: 'u3',
      senderName: 'Michael Brown',
      senderRole: 'Pharmacist',
      text: 'Medication refill has been approved.',
      timestamp: '2025-11-05T14:20:00Z',
      isCurrentUser: false,
    },
  ],
  'conv-3': [
    {
      id: 'm10',
      conversationId: 'conv-3',
      senderId: 'u4',
      senderName: 'Jennifer Lee',
      senderRole: 'Staff',
      text: 'Mrs. Anderson\'s daughter called about visiting hours.',
      timestamp: '2025-11-04T15:00:00Z',
      isCurrentUser: false,
    },
    {
      id: 'm11',
      conversationId: 'conv-3',
      senderId: 'u5',
      senderName: 'David Martinez',
      senderRole: 'Staff',
      text: 'I spoke with her. They\'re planning to visit tomorrow afternoon.',
      timestamp: '2025-11-04T15:30:00Z',
      isCurrentUser: false,
    },
    {
      id: 'm12',
      conversationId: 'conv-3',
      senderId: 'u4',
      senderName: 'Jennifer Lee',
      senderRole: 'Staff',
      text: 'Family visit scheduled for tomorrow at 2 PM.',
      timestamp: '2025-11-04T16:45:00Z',
      isCurrentUser: false,
    },
  ],
};

const roleColors: { [key: string]: string } = {
  Staff: 'text-[#2563eb]',
  'Home Health': 'text-[#16a34a]',
  Nurse: 'text-[#8b5cf6]',
  Hospice: 'text-[#ec4899]',
  Pharmacist: 'text-[#d97706]',
  Doctor: 'text-[#dc2626]',
};

export function ChatView({ conversationId, resident, onBack }: ChatViewProps) {
  const [messageText, setMessageText] = useState('');
  const messages = mockMessages[conversationId] || [];

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // In a real app, this would send the message to the backend
      console.log('Sending message:', messageText);
      setMessageText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const formatDateDivider = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    }
  };

  // Group messages by date
  const groupedMessages: { [key: string]: Message[] } = {};
  messages.forEach((message) => {
    const date = new Date(message.timestamp).toDateString();
    if (!groupedMessages[date]) {
      groupedMessages[date] = [];
    }
    groupedMessages[date].push(message);
  });

  return (
    <div className="w-full bg-white rounded-lg border flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {onBack && (
            <Button
              onClick={onBack}
              variant="ghost"
              size="icon"
              className="lg:hidden flex-shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <div className="flex-1 min-w-0">
            <h2 className="text-[#1e293b] truncate">
              {resident.firstName} {resident.lastName}
            </h2>
            <p className="text-sm text-[#64748b]">Room {resident.room}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button variant="outline" size="icon" className="hidden sm:flex">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="hidden sm:flex">
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Object.entries(groupedMessages).map(([date, msgs]) => (
          <div key={date}>
            {/* Date Divider */}
            <div className="flex items-center justify-center mb-4">
              <div className="bg-[#f1f5f9] px-3 py-1 rounded-full">
                <span className="text-xs text-[#64748b]">
                  {formatDateDivider(msgs[0].timestamp)}
                </span>
              </div>
            </div>

            {/* Messages for this date */}
            {msgs.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 mb-4 ${
                  message.isCurrentUser ? 'flex-row-reverse' : ''
                }`}
              >
                {!message.isCurrentUser && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-[#eff6ff] text-[#2563eb] text-xs">
                      {message.senderName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={`flex flex-col ${
                    message.isCurrentUser ? 'items-end' : 'items-start'
                  } max-w-[70%]`}
                >
                  {!message.isCurrentUser && (
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-[#1e293b]">
                        {message.senderName}
                      </span>
                      <span className={`text-xs ${roleColors[message.senderRole]}`}>
                        {message.senderRole}
                      </span>
                    </div>
                  )}

                  <div
                    className={`rounded-lg px-4 py-2 ${
                      message.isCurrentUser
                        ? 'bg-[#2563eb] text-white'
                        : 'bg-[#f1f5f9] text-[#1e293b]'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                  </div>

                  <span className="text-xs text-[#64748b] mt-1">
                    {formatTimestamp(message.timestamp)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!messageText.trim()}
            className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
