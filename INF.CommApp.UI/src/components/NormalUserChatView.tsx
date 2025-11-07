import { useState, useEffect } from 'react';
import { Send, Phone, Video, MoreVertical, ArrowLeft, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Conversation } from './NormalUserMessagingPage';

interface ChatViewProps {
  conversationId: string;
  conversation: Conversation;
  onBack?: () => void;
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  text: string;
  timestamp: string;
  isCurrentUser?: boolean;
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
      text: 'Good morning! Just completed the morning vitals check.',
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
      senderRole: 'Family',
      text: 'That\'s great to hear. Thank you for the update!',
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
      text: 'Hello, I\'ve reviewed the medication list.',
      timestamp: '2025-11-05T13:00:00Z',
      isCurrentUser: false,
    },
    {
      id: 'm7',
      conversationId: 'conv-2',
      senderId: 'current-user',
      senderName: 'You',
      senderRole: 'Family',
      text: 'Thank you! Is there anything we need to be aware of?',
      timestamp: '2025-11-05T13:15:00Z',
      isCurrentUser: true,
    },
    {
      id: 'm8',
      conversationId: 'conv-2',
      senderId: 'u3',
      senderName: 'Michael Brown',
      senderRole: 'Pharmacist',
      text: 'Everything looks good. I\'ve processed a refill for the blood pressure medication.',
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
      text: 'Thank you for calling about visiting hours.',
      timestamp: '2025-11-04T15:00:00Z',
      isCurrentUser: false,
    },
    {
      id: 'm11',
      conversationId: 'conv-3',
      senderId: 'current-user',
      senderName: 'You',
      senderRole: 'Family',
      text: 'We\'re planning to visit tomorrow afternoon.',
      timestamp: '2025-11-04T15:30:00Z',
      isCurrentUser: true,
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
  'conv-4': [
    {
      id: 'm13',
      conversationId: 'conv-4',
      senderId: 'u6',
      senderName: 'Comfort Care Hospice',
      senderRole: 'Hospice',
      text: 'Hello, we wanted to introduce our services and let you know we\'re here to support you.',
      timestamp: '2025-11-03T09:00:00Z',
      isCurrentUser: false,
    },
    {
      id: 'm14',
      conversationId: 'conv-4',
      senderId: 'u6',
      senderName: 'Comfort Care Hospice',
      senderRole: 'Hospice',
      text: 'We are available 24/7 for any questions.',
      timestamp: '2025-11-03T09:15:00Z',
      isCurrentUser: false,
    },
  ],
  'conv-5': [
    {
      id: 'm15',
      conversationId: 'conv-5',
      senderId: 'u7',
      senderName: 'Home Health Team',
      senderRole: 'Home Health',
      text: 'We completed today\'s physical therapy session.',
      timestamp: '2025-11-02T10:30:00Z',
      isCurrentUser: false,
    },
    {
      id: 'm16',
      conversationId: 'conv-5',
      senderId: 'current-user',
      senderName: 'You',
      senderRole: 'Family',
      text: 'Thank you! How did it go?',
      timestamp: '2025-11-02T10:45:00Z',
      isCurrentUser: true,
    },
    {
      id: 'm17',
      conversationId: 'conv-5',
      senderId: 'u7',
      senderName: 'Home Health Team',
      senderRole: 'Home Health',
      text: 'Physical therapy session completed successfully.',
      timestamp: '2025-11-02T11:00:00Z',
      isCurrentUser: false,
    },
  ],
};

// Rotating banner content
const bannerContent = [
  {
    id: 1,
    title: 'Healing Touch Hospice',
    description: 'Compassionate end-of-life care for your loved ones',
    cta: 'Learn More',
  },
  {
    id: 2,
    title: 'Caring Hands Home Health',
    description: 'Professional in-home care services',
    cta: 'Learn More',
  },
  {
    id: 3,
    title: 'Sunrise Pharmacy',
    description: 'Convenient prescription delivery & medication management',
    cta: 'Learn More',
  },
];

const roleColors: { [key: string]: string } = {
  Family: 'text-[#2563eb]',
  Staff: 'text-[#2563eb]',
  'Home Health': 'text-[#16a34a]',
  Nurse: 'text-[#8b5cf6]',
  Hospice: 'text-[#ec4899]',
  Pharmacist: 'text-[#d97706]',
  Doctor: 'text-[#dc2626]',
};

export function NormalUserChatView({ conversationId, conversation, onBack }: ChatViewProps) {
  const [messageText, setMessageText] = useState('');
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const messages = mockMessages[conversationId] || [];

  // Rotate banner every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % bannerContent.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

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

  const currentBanner = bannerContent[currentBannerIndex];

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
              {conversation.participants.map((p) => p.name).join(', ')}
            </h2>
            <p className="text-sm text-[#64748b]">
              {conversation.participants.map((p) => p.role).join(', ')}
            </p>
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

      {/* Rotating Banner */}
      <div className="mx-4 mt-3 transition-all duration-500">
        <div className="p-3 bg-gradient-to-r from-[#eff6ff] to-[#dbeafe] border border-[#2563eb]/20 rounded-lg">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm text-[#1e293b] mb-0.5">{currentBanner.title}</h3>
              <p className="text-xs text-[#64748b]">{currentBanner.description}</p>
            </div>
            <button className="flex items-center gap-1 text-xs text-[#2563eb] hover:underline flex-shrink-0">
              {currentBanner.cta}
              <ExternalLink className="h-3 w-3" />
            </button>
          </div>
        </div>
        {/* Banner Indicators */}
        <div className="flex justify-center gap-1 mt-1.5">
          {bannerContent.map((_, index) => (
            <div
              key={index}
              className={`h-1 rounded-full transition-all duration-300 ${
                index === currentBannerIndex
                  ? 'w-4 bg-[#2563eb]'
                  : 'w-1 bg-[#cbd5e1]'
              }`}
            />
          ))}
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
