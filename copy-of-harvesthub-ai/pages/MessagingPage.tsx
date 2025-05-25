
import React, { useState, useEffect, useRef, useCallback } from 'react';
// Fix: Import Link
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Conversation, Message, User } from '../types';
import { mockConversations, mockMessages, mockUsers } from '../services/mockData'; // Mock data
import Card from '../components/Card';
import Button from '../components/Button';
import Input, { Textarea } from '../components/Input';
import LoadingSpinner from '../components/LoadingSpinner';
// Fix: Import ArrowLeftIcon
import { ChatBubbleLeftEllipsisIcon, UserCircleIcon, ArrowLeftIcon } from '../components/Icons';
import { ROUTES, DEFAULT_USER_PROFILE_PIC } from '../constants';

const MessagingPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const { conversationId: activeConversationIdFromParams } = useParams<{ conversationId?: string }>();
  const locationHook = useLocation(); // Renamed to avoid conflict with produce.location
  const navigate = useNavigate();
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Effect to initialize conversations and handle deep linking or state-based navigation
  useEffect(() => {
    if (!currentUser) return;
    setIsLoading(true);
    // Simulate fetching conversations for the current user
    const userConvos = mockConversations
        .filter(c => c.participantIds.includes(currentUser.id))
        .sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    setConversations(userConvos);

    const locationState = locationHook.state as { recipientId?: string, recipientName?: string, produceId?: string, produceName?: string };
    
    if (activeConversationIdFromParams) {
        const foundConvo = userConvos.find(c => c.id === activeConversationIdFromParams);
        setActiveConversation(foundConvo || null);
    } else if (locationState?.recipientId) {
        // Try to find existing conversation or prepare for a new one
        let existingConvo = userConvos.find(c => 
            c.participantIds.includes(locationState.recipientId!) && 
            (!locationState.produceId || c.produceId === locationState.produceId)
        );
        if (existingConvo) {
            setActiveConversation(existingConvo);
            navigate(`${ROUTES.MESSAGES}/${existingConvo.id}`, { replace: true }); // Update URL
        } else {
            // Create a temporary new conversation object for UI (won't be saved until message sent)
            const recipient = mockUsers.find(u => u.id === locationState.recipientId);
            const tempNewConvo: Conversation = {
                id: `new-${Date.now()}`, // Temporary ID
                participantIds: [currentUser.id, locationState.recipientId],
                participantNames: {
                    [currentUser.id]: currentUser.name,
                    [locationState.recipientId]: locationState.recipientName || recipient?.name || 'Unknown User'
                },
                produceId: locationState.produceId,
                produceName: locationState.produceName,
                updatedAt: new Date(),
            };
            setActiveConversation(tempNewConvo);
            setMessages([]); // No messages for a new conversation
        }
    } else if (userConvos.length > 0) {
        setActiveConversation(userConvos[0]); // Select first conversation by default
        navigate(`${ROUTES.MESSAGES}/${userConvos[0].id}`, { replace: true });
    }
    setIsLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, activeConversationIdFromParams, locationHook.state]); // navigate is stable

  // Effect to fetch messages for the active conversation
  useEffect(() => {
    if (activeConversation && !activeConversation.id.startsWith('new-')) {
      // Simulate fetching messages
      const convoMessages = mockMessages
        .filter(m => m.conversationId === activeConversation.id)
        .sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      setMessages(convoMessages);
    } else if (activeConversation && activeConversation.id.startsWith('new-')) {
        setMessages([]); // Clear messages for new temporary conversation
    }
  }, [activeConversation]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const handleSelectConversation = (conversation: Conversation) => {
      setActiveConversation(conversation);
      navigate(`${ROUTES.MESSAGES}/${conversation.id}`);
  };


  const handleSendMessage = () => {
    if (!currentUser || !activeConversation || !newMessageText.trim()) return;

    const recipientId = activeConversation.participantIds.find(id => id !== currentUser.id);
    if (!recipientId) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId: activeConversation.id.startsWith('new-') ? `convo-${Date.now()}` : activeConversation.id, // Assign new ID if it's a new convo
      senderId: currentUser.id,
      receiverId: recipientId,
      text: newMessageText.trim(),
      timestamp: new Date(),
      read: false,
    };
    
    // Simulate sending message and updating local state
    setMessages(prev => [...prev, newMessage]);
    
    if (activeConversation.id.startsWith('new-')) { // This is the first message of a new conversation
        const newConversationForList: Conversation = {
            ...activeConversation,
            id: newMessage.conversationId, // Use the generated ID
            lastMessage: newMessage,
            updatedAt: newMessage.timestamp,
        };
        // Add to mockConversations and update UI
        mockConversations.unshift(newConversationForList);
        mockMessages.push(newMessage);

        setConversations(prev => [newConversationForList, ...prev.filter(c => c.id !== activeConversation.id)]);
        setActiveConversation(newConversationForList);
        navigate(`${ROUTES.MESSAGES}/${newConversationForList.id}`, { replace: true });
    } else {
         // Update existing conversation
        setActiveConversation(prev => prev ? {...prev, lastMessage: newMessage, updatedAt: newMessage.timestamp} : null);
        setConversations(prevConvos => 
            prevConvos.map(c => c.id === activeConversation.id ? {...c, lastMessage: newMessage, updatedAt: newMessage.timestamp} : c)
                      // Fix: Sort by updatedAt for both a and b
                      .sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        );
        mockMessages.push(newMessage);
        const convoIndex = mockConversations.findIndex(c => c.id === activeConversation.id);
        if(convoIndex !== -1) {
            mockConversations[convoIndex].lastMessage = newMessage;
            mockConversations[convoIndex].updatedAt = newMessage.timestamp;
        }
    }
    setNewMessageText('');
  };


  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading your messages..." />;
  }
  if (!currentUser) {
    return <p>Please log in to view messages.</p>;
  }
  
  const otherParticipantId = activeConversation?.participantIds.find(id => id !== currentUser.id);
  const otherParticipantName = otherParticipantId ? activeConversation?.participantNames[otherParticipantId] : 'User';
  const otherParticipant = mockUsers.find(u => u.id === otherParticipantId);


  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-10rem)] max-h-[700px] bg-white shadow-xl rounded-lg overflow-hidden">
      {/* Sidebar: Conversation List */}
      <div className={`w-full md:w-1/3 border-r border-gray-200 bg-gray-50 flex flex-col ${activeConversation && 'hidden md:flex'}`}>
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-primary-dark">Conversations</h2>
          {/* Search/Filter could go here */}
        </div>
        <ul className="overflow-y-auto flex-grow">
          {conversations.length > 0 ? conversations.map(convo => {
            const otherId = convo.participantIds.find(id => id !== currentUser.id);
            const otherName = otherId ? convo.participantNames[otherId] : 'Unknown User';
            const participantDetails = mockUsers.find(u => u.id === otherId);
            return (
              <li key={convo.id} 
                  onClick={() => handleSelectConversation(convo)}
                  className={`p-4 hover:bg-gray-100 cursor-pointer border-b border-gray-200 ${activeConversation?.id === convo.id ? 'bg-primary-light bg-opacity-30' : ''}`}
              >
                <div className="flex items-center space-x-3">
                    <img src={participantDetails?.profilePictureUrl || DEFAULT_USER_PROFILE_PIC} alt={otherName} className="w-10 h-10 rounded-full object-cover"/>
                    <div className="flex-1 min-w-0">
                        <p className={`font-semibold ${convo.unreadCount ? 'text-primary-dark' : 'text-gray-800'} truncate`}>{otherName}</p>
                        {convo.produceName && <p className="text-xs text-gray-500 truncate">Re: {convo.produceName}</p>}
                        <p className={`text-sm ${convo.unreadCount ? 'text-gray-700 font-medium' : 'text-gray-500'} truncate`}>
                            {convo.lastMessage?.senderId === currentUser.id && "You: "} {convo.lastMessage?.text || "No messages yet"}
                        </p>
                    </div>
                    {convo.unreadCount && convo.unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{convo.unreadCount}</span>
                    )}
                </div>
              </li>
            );
          }) : (
            <p className="p-4 text-gray-500 text-center">No conversations yet. Start by contacting a farmer or buyer!</p>
          )}
        </ul>
      </div>

      {/* Main Chat Area */}
      <div className={`w-full md:w-2/3 flex flex-col ${!activeConversation && 'hidden md:flex'}`}>
        {activeConversation ? (
          <>
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center space-x-3">
               <button onClick={() => setActiveConversation(null)} className="md:hidden p-1 rounded-full hover:bg-gray-200">
                    <ArrowLeftIcon className="w-6 h-6 text-gray-600"/>
               </button>
               <img src={otherParticipant?.profilePictureUrl || DEFAULT_USER_PROFILE_PIC} alt={otherParticipantName} className="w-10 h-10 rounded-full object-cover"/>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{otherParticipantName}</h3>
                {activeConversation.produceName && (
                    <p className="text-xs text-gray-500">
                        {/* Fix: Use imported Link */}
                        Regarding: <Link to={`${ROUTES.PRODUCE_DETAIL}/${activeConversation.produceId}`} className="text-primary hover:underline">{activeConversation.produceName}</Link>
                    </p>
                )}
              </div>
            </div>
            <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-100">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-xl shadow ${msg.senderId === currentUser.id ? 'bg-primary text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none'}`}>
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.senderId === currentUser.id ? 'text-primary-light text-opacity-80 text-right' : 'text-gray-400 text-left'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-center space-x-3">
                <Textarea 
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  placeholder="Type your message..."
                  rows={2}
                  className="flex-grow !mb-0"
                  textareaClassName="resize-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button onClick={handleSendMessage} disabled={!newMessageText.trim()} className="self-end">Send</Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-gray-500 bg-gray-100 p-8">
            <ChatBubbleLeftEllipsisIcon className="w-24 h-24 text-gray-300 mb-4"/>
            <p className="text-xl">Select a conversation to start chatting</p>
            <p className="text-sm mt-2">Or find a product and contact the farmer to begin a new one!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagingPage;