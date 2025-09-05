import { useState, useEffect, useRef } from 'react';
import { 
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  UserIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  PhoneIcon,
  VideoCameraIcon,
  EllipsisVerticalIcon,
  PaperClipIcon
} from '@heroicons/react/24/outline';
import { ChatBubbleLeftRightIcon as ChatSolidIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';

interface Message {
  id: number;
  conversation_id: number;
  sender_id: number;
  sender_name: string;
  sender_role: string;
  message: string;
  message_type: 'text' | 'file' | 'image';
  file_url?: string;
  created_at: string;
  read: boolean;
}

interface Conversation {
  id: number;
  participants: Array<{
    id: number;
    name: string;
    email: string;
    role: string;
    avatar?: string;
    online: boolean;
  }>;
  last_message?: Message;
  unread_count: number;
  created_at: string;
  updated_at: string;
}

interface MessagingCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MessagingCenter({ isOpen, onClose }: MessagingCenterProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      fetchConversations();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/messages/conversations');
      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations || []);
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
      // Mock data for demo
      setConversations([
        {
          id: 1,
          participants: [
            { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'customer', online: true },
            { id: 2, name: 'Admin', email: 'admin@company.com', role: 'admin', online: true }
          ],
          last_message: {
            id: 10,
            conversation_id: 1,
            sender_id: 1,
            sender_name: 'John Doe',
            sender_role: 'customer',
            message: 'I need help with my loan application status',
            message_type: 'text',
            created_at: '2024-01-21T10:30:00Z',
            read: false
          },
          unread_count: 2,
          created_at: '2024-01-20T10:30:00Z',
          updated_at: '2024-01-21T10:30:00Z'
        },
        {
          id: 2,
          participants: [
            { id: 3, name: 'Jane Smith', email: 'jane.smith@retailer.com', role: 'retailer', online: false },
            { id: 2, name: 'Admin', email: 'admin@company.com', role: 'admin', online: true }
          ],
          last_message: {
            id: 15,
            conversation_id: 2,
            sender_id: 2,
            sender_name: 'Admin',
            sender_role: 'admin',
            message: 'Your commission rate has been updated to 5.5%',
            message_type: 'text',
            created_at: '2024-01-21T09:15:00Z',
            read: true
          },
          unread_count: 0,
          created_at: '2024-01-19T14:20:00Z',
          updated_at: '2024-01-21T09:15:00Z'
        },
        {
          id: 3,
          participants: [
            { id: 4, name: 'Mike Johnson', email: 'mike.johnson@example.com', role: 'customer', online: true },
            { id: 2, name: 'Admin', email: 'admin@company.com', role: 'admin', online: true }
          ],
          last_message: {
            id: 20,
            conversation_id: 3,
            sender_id: 4,
            sender_name: 'Mike Johnson',
            sender_role: 'customer',
            message: 'Thank you for resolving my issue!',
            message_type: 'text',
            created_at: '2024-01-20T16:45:00Z',
            read: true
          },
          unread_count: 0,
          created_at: '2024-01-18T11:30:00Z',
          updated_at: '2024-01-20T16:45:00Z'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: number) => {
    try {
      const response = await fetch(`/api/messages/conversations/${conversationId}/messages`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      // Mock messages for demo
      if (conversationId === 1) {
        setMessages([
          {
            id: 8,
            conversation_id: 1,
            sender_id: 1,
            sender_name: 'John Doe',
            sender_role: 'customer',
            message: 'Hello, I submitted my loan application yesterday',
            message_type: 'text',
            created_at: '2024-01-21T09:00:00Z',
            read: true
          },
          {
            id: 9,
            conversation_id: 1,
            sender_id: 2,
            sender_name: 'Admin',
            sender_role: 'admin',
            message: 'Hi John! I can see your application is under review. Let me check the status for you.',
            message_type: 'text',
            created_at: '2024-01-21T09:05:00Z',
            read: true
          },
          {
            id: 10,
            conversation_id: 1,
            sender_id: 1,
            sender_name: 'John Doe',
            sender_role: 'customer',
            message: 'I need help with my loan application status',
            message_type: 'text',
            created_at: '2024-01-21T10:30:00Z',
            read: false
          }
        ]);
      }
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: selectedConversation.id,
          message: newMessage.trim(),
          message_type: 'text'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, data.message]);
        setNewMessage('');
        // Update conversation list
        fetchConversations();
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      // Add mock message for demo
      const mockMessage: Message = {
        id: messages.length + 1,
        conversation_id: selectedConversation.id,
        sender_id: 2,
        sender_name: 'Admin',
        sender_role: 'admin',
        message: newMessage.trim(),
        message_type: 'text',
        created_at: new Date().toISOString(),
        read: true
      };
      setMessages(prev => [...prev, mockMessage]);
      setNewMessage('');
    }
  };

  const getRoleColor = (role: string) => {
    const colors = {
      admin: 'text-purple-600',
      customer: 'text-blue-600',
      retailer: 'text-green-600',
      lender: 'text-orange-600',
    };
    return colors[role as keyof typeof colors] || 'text-gray-600';
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-KE', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    } else {
      return date.toLocaleDateString('en-KE', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const filteredConversations = conversations.filter(conversation =>
    conversation.participants.some(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unread_count, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-25" onClick={onClose}></div>
      
      <div className="absolute right-0 top-0 h-full w-full max-w-4xl bg-white shadow-2xl transform transition-transform duration-300 ease-in-out">
        <div className="flex h-full">
          {/* Conversations Sidebar */}
          <div className="w-80 border-r border-gray-200 flex flex-col">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center">
                <ChatSolidIcon className="w-6 h-6 text-blue-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
                {totalUnread > 0 && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {totalUnread}
                  </span>
                )}
              </div>
              <div className="flex space-x-2">
                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <PlusIcon className="w-5 h-5 text-gray-500" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-gray-100">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <ChatBubbleLeftRightIcon className="w-12 h-12 text-gray-300 mb-4" />
                  <p className="text-sm text-gray-500">No conversations found</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredConversations.map((conversation) => {
                    const otherParticipant = conversation.participants.find(p => p.role !== 'admin') || conversation.participants[0];
                    return (
                      <div
                        key={conversation.id}
                        onClick={() => setSelectedConversation(conversation)}
                        className={clsx(
                          'p-4 cursor-pointer hover:bg-gray-50 transition-colors',
                          selectedConversation?.id === conversation.id && 'bg-blue-50 border-r-2 border-blue-500'
                        )}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative flex-shrink-0">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                              <UserIcon className="w-5 h-5 text-white" />
                            </div>
                            {otherParticipant.online && (
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="text-sm font-medium text-gray-900 truncate">
                                {otherParticipant.name}
                              </h3>
                              {conversation.last_message && (
                                <span className="text-xs text-gray-500">
                                  {formatTime(conversation.last_message.created_at)}
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <p className={clsx(
                                  'text-xs truncate',
                                  getRoleColor(otherParticipant.role)
                                )}>
                                  {otherParticipant.role}
                                </p>
                                {conversation.last_message && (
                                  <p className="text-sm text-gray-600 truncate mt-1">
                                    {conversation.last_message.message}
                                  </p>
                                )}
                              </div>
                              
                              {conversation.unread_count > 0 && (
                                <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-blue-600 rounded-full">
                                  {conversation.unread_count}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-white" />
                      </div>
                      {selectedConversation.participants.find(p => p.role !== 'admin')?.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {selectedConversation.participants.find(p => p.role !== 'admin')?.name}
                      </h3>
                      <p className={clsx(
                        'text-xs',
                        getRoleColor(selectedConversation.participants.find(p => p.role !== 'admin')?.role || 'customer')
                      )}>
                        {selectedConversation.participants.find(p => p.role !== 'admin')?.role} • {
                          selectedConversation.participants.find(p => p.role !== 'admin')?.online ? 'Online' : 'Offline'
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                      <PhoneIcon className="w-5 h-5 text-gray-500" />
                    </button>
                    <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                      <VideoCameraIcon className="w-5 h-5 text-gray-500" />
                    </button>
                    <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                      <EllipsisVerticalIcon className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {messages.map((message) => {
                    const isOwnMessage = message.sender_role === 'admin';
                    return (
                      <div
                        key={message.id}
                        className={clsx(
                          'flex',
                          isOwnMessage ? 'justify-end' : 'justify-start'
                        )}
                      >
                        <div
                          className={clsx(
                            'max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-sm',
                            isOwnMessage
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-gray-900 border border-gray-200'
                          )}
                        >
                          <p className="text-sm">{message.message}</p>
                          <p className={clsx(
                            'text-xs mt-1',
                            isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                          )}>
                            {formatTime(message.created_at)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 bg-white">
                  <div className="flex items-end space-x-2">
                    <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                      <PaperClipIcon className="w-5 h-5 text-gray-500" />
                    </button>
                    
                    <div className="flex-1">
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                          }
                        }}
                        placeholder="Type your message..."
                        rows={1}
                        className="w-full px-4 py-2 border border-gray-300 rounded-2xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        style={{ minHeight: '40px', maxHeight: '120px' }}
                      />
                    </div>
                    
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      className={clsx(
                        'p-2 rounded-full transition-colors',
                        newMessage.trim()
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      )}
                    >
                      <PaperAirplaneIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <ChatBubbleLeftRightIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No conversation selected</h3>
                  <p className="text-gray-500">Choose a conversation from the sidebar to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
