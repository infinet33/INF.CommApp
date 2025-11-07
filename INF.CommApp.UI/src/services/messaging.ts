// Messaging service - API calls for conversation and message management
import { api } from './api';
import { 
  Conversation, 
  ConversationDetails, 
  Message, 
  CreateConversationData, 
  SendMessageData,
  ConversationFilters,
  ApiResponse, 
  PaginatedResponse 
} from '../types';

class MessagingService {
  private readonly endpoint = '/conversations';

  // Conversation management
  async getConversations(filters: ConversationFilters = {}): Promise<PaginatedResponse<Conversation>> {
    const params: Record<string, string> = {};
    if (filters.search) params.search = filters.search;
    if (filters.residentId) params.residentId = filters.residentId;
    if (filters.participantId) params.participantId = filters.participantId;
    if (filters.priority && filters.priority !== 'all') params.priority = filters.priority;
    if (filters.isArchived !== undefined) params.isArchived = filters.isArchived.toString();
    if (filters.hasUnread !== undefined) params.hasUnread = filters.hasUnread.toString();
    if (filters.page) params.page = filters.page.toString();
    if (filters.pageSize) params.pageSize = filters.pageSize.toString();
    if (filters.sortBy) params.sortBy = filters.sortBy;
    if (filters.sortOrder) params.sortOrder = filters.sortOrder;

    return api.getPaginated<Conversation>(this.endpoint, params);
  }

  async getConversationDetails(id: string): Promise<ApiResponse<ConversationDetails>> {
    return api.getApiResponse<ConversationDetails>(`${this.endpoint}/${id}`);
  }

  async createConversation(data: CreateConversationData): Promise<ApiResponse<Conversation>> {
    return api.postApiResponse<Conversation>(this.endpoint, data);
  }

  async archiveConversation(id: string): Promise<ApiResponse<Conversation>> {
    return api.patch<ApiResponse<Conversation>>(`${this.endpoint}/${id}/archive`, {});
  }

  async unarchiveConversation(id: string): Promise<ApiResponse<Conversation>> {
    return api.patch<ApiResponse<Conversation>>(`${this.endpoint}/${id}/unarchive`, {});
  }

  // Message management
  async sendMessage(conversationId: string, data: SendMessageData): Promise<ApiResponse<Message>> {
    return api.postApiResponse<Message>(`${this.endpoint}/${conversationId}/messages`, data);
  }

  async getMessages(conversationId: string, page: number = 1, pageSize: number = 50): Promise<PaginatedResponse<Message>> {
    return api.getPaginated<Message>(`${this.endpoint}/${conversationId}/messages`, { page: page.toString(), pageSize: pageSize.toString() });
  }

  async markAsRead(conversationId: string): Promise<ApiResponse<{ success: boolean }>> {
    return api.patch<ApiResponse<{ success: boolean }>>(`${this.endpoint}/${conversationId}/read`, {});
  }

  async markMessageAsRead(conversationId: string, messageId: string): Promise<ApiResponse<{ success: boolean }>> {
    return api.patch<ApiResponse<{ success: boolean }>>(`${this.endpoint}/${conversationId}/messages/${messageId}/read`, {});
  }

  // Search and filtering
  async searchConversations(query: string): Promise<ApiResponse<Conversation[]>> {
    return api.getApiResponse<Conversation[]>(`${this.endpoint}/search`, { q: query });
  }

  async searchMessages(conversationId: string, query: string): Promise<ApiResponse<Message[]>> {
    return api.getApiResponse<Message[]>(`${this.endpoint}/${conversationId}/messages/search`, { q: query });
  }

  // Statistics and reporting
  async getMessagingStatistics(): Promise<ApiResponse<{
    totalConversations: number;
    activeConversations: number;
    totalMessages: number;
    unreadMessagesCount: number;
    averageResponseTime: number;
    messagesByPriority: Record<string, number>;
  }>> {
    return api.getApiResponse(`${this.endpoint}/statistics`);
  }

  // File attachments
  async uploadAttachment(conversationId: string, file: File): Promise<ApiResponse<{ id: string; url: string; name: string; type: string; size: number }>> {
    const response = await api.uploadFile(`${this.endpoint}/${conversationId}/attachments`, file);
    return {
      ...response,
      data: {
        id: Date.now().toString(), // Temporary ID generation
        url: response.data.url,
        name: file.name,
        type: file.type,
        size: file.size
      }
    };
  }

  async downloadAttachment(conversationId: string, attachmentId: string): Promise<Blob> {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
    const response = await fetch(`${API_BASE_URL}${this.endpoint}/${conversationId}/attachments/${attachmentId}`);
    return response.blob();
  }

  // Participants management
  async addParticipant(conversationId: string, participantId: string): Promise<ApiResponse<Conversation>> {
    return api.postApiResponse<Conversation>(`${this.endpoint}/${conversationId}/participants`, { participantId });
  }

  async removeParticipant(conversationId: string, participantId: string): Promise<ApiResponse<Conversation>> {
    return api.delete<ApiResponse<Conversation>>(`${this.endpoint}/${conversationId}/participants/${participantId}`);
  }

  // Notification preferences
  async updateNotificationSettings(conversationId: string, settings: { 
    emailNotifications: boolean; 
    pushNotifications: boolean; 
    smsNotifications: boolean; 
  }): Promise<ApiResponse<{ success: boolean }>> {
    return api.putApiResponse<{ success: boolean }>(`${this.endpoint}/${conversationId}/notifications`, settings);
  }
}

export const messagingService = new MessagingService();
export { MessagingService };