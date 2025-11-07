// useConversations hook - React hook for messaging and conversation management
import { useState, useEffect, useCallback } from 'react';
import { messagingService } from '../services/messaging';
import { 
  Conversation, 
  ConversationDetails, 
  Message, 
  CreateConversationData, 
  SendMessageData,
  ConversationFilters,
  ApiError 
} from '../types';

interface UseConversationsReturn {
  conversations: Conversation[];
  activeConversation: ConversationDetails | null;
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  totalConversations: number;
  
  // Core operations
  fetchConversations: (filters?: ConversationFilters) => Promise<void>;
  getConversation: (id: string) => Promise<void>;
  createConversation: (data: CreateConversationData) => Promise<Conversation | null>;
  sendMessage: (conversationId: string, data: SendMessageData) => Promise<Message | null>;
  markAsRead: (conversationId: string) => Promise<void>;
  
  // Conversation management
  archiveConversation: (id: string) => Promise<boolean>;
  unarchiveConversation: (id: string) => Promise<boolean>;
  
  // Utility methods
  refreshData: () => Promise<void>;
  clearError: () => void;
  setActiveConversation: (conversation: ConversationDetails | null) => void;
}

export function useConversations(initialFilters: ConversationFilters = {}): UseConversationsReturn {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversationState] = useState<ConversationDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalConversations, setTotalConversations] = useState(0);
  const [currentFilters, setCurrentFilters] = useState<ConversationFilters>(initialFilters);

  const handleError = useCallback((err: unknown) => {
    const apiError = err as ApiError;
    const errorMessage = apiError.message || 'An unexpected error occurred';
    setError(errorMessage);
    console.error('Messaging API Error:', apiError);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchConversations = useCallback(async (filters: ConversationFilters = {}) => {
    setLoading(true);
    setError(null);
    
    const mergedFilters = { ...currentFilters, ...filters };
    setCurrentFilters(mergedFilters);
    
    try {
      const response = await messagingService.getConversations(mergedFilters);
      setConversations(response.data);
      setTotalPages(response.totalPages);
      setCurrentPage(response.page);
      setTotalConversations(response.total);
    } catch (err) {
      handleError(err);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  }, [currentFilters, handleError]);

  const getConversation = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await messagingService.getConversationDetails(id);
      setActiveConversationState(response.data);
      
      // Mark as read when conversation is opened
      await messagingService.markAsRead(id);
      
      // Update unread count in conversations list
      setConversations(prev => prev.map(conv => 
        conv.id === id ? { ...conv, unreadCount: 0 } : conv
      ));
    } catch (err) {
      handleError(err);
      setActiveConversationState(null);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const createConversation = useCallback(async (data: CreateConversationData): Promise<Conversation | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await messagingService.createConversation(data);
      const newConversation = response.data;
      
      // Add to conversations list
      setConversations(prev => [newConversation, ...prev]);
      setTotalConversations(prev => prev + 1);
      
      return newConversation;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const sendMessage = useCallback(async (conversationId: string, data: SendMessageData): Promise<Message | null> => {
    if (!activeConversation || activeConversation.id !== conversationId) {
      setError('No active conversation selected');
      return null;
    }
    
    setError(null);
    
    try {
      const response = await messagingService.sendMessage(conversationId, data);
      const newMessage = response.data;
      
      // Optimistically add message to active conversation
      setActiveConversationState(prev => prev ? {
        ...prev,
        messages: [...prev.messages, newMessage],
        lastMessage: newMessage,
        totalMessages: prev.totalMessages + 1
      } : null);
      
      // Update last message in conversations list
      setConversations(prev => prev.map(conv => 
        conv.id === conversationId ? { ...conv, lastMessage: newMessage } : conv
      ));
      
      return newMessage;
    } catch (err) {
      handleError(err);
      return null;
    }
  }, [activeConversation, handleError]);

  const markAsRead = useCallback(async (conversationId: string) => {
    try {
      await messagingService.markAsRead(conversationId);
      
      // Update unread count in conversations list
      setConversations(prev => prev.map(conv => 
        conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
      ));
    } catch (err) {
      handleError(err);
    }
  }, [handleError]);

  const archiveConversation = useCallback(async (id: string): Promise<boolean> => {
    try {
      await messagingService.archiveConversation(id);
      
      // Update conversation in list
      setConversations(prev => prev.map(conv => 
        conv.id === id ? { ...conv, isArchived: true } : conv
      ));
      
      return true;
    } catch (err) {
      handleError(err);
      return false;
    }
  }, [handleError]);

  const unarchiveConversation = useCallback(async (id: string): Promise<boolean> => {
    try {
      await messagingService.unarchiveConversation(id);
      
      // Update conversation in list
      setConversations(prev => prev.map(conv => 
        conv.id === id ? { ...conv, isArchived: false } : conv
      ));
      
      return true;
    } catch (err) {
      handleError(err);
      return false;
    }
  }, [handleError]);

  const refreshData = useCallback(async () => {
    await fetchConversations(currentFilters);
  }, [fetchConversations, currentFilters]);

  const setActiveConversation = useCallback((conversation: ConversationDetails | null) => {
    setActiveConversationState(conversation);
  }, []);

  // Load initial data on mount
  useEffect(() => {
    fetchConversations(initialFilters);
  }, []); // Only run on mount

  return {
    conversations,
    activeConversation,
    loading,
    error,
    totalPages,
    currentPage,
    totalConversations,
    
    // Core operations
    fetchConversations,
    getConversation,
    createConversation,
    sendMessage,
    markAsRead,
    
    // Conversation management
    archiveConversation,
    unarchiveConversation,
    
    // Utility methods
    refreshData,
    clearError,
    setActiveConversation,
  };
}