
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import { Link } from 'react-router-dom';
import { ROUTES } from '../constants';
import { UserCircleIcon, ChatBubbleLeftEllipsisIcon } from '../components/Icons';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
// Mock data for demonstration
import { mockUsers, mockConversations } from '../services/mockData';
import { User, UserRole, Conversation } from '../types';

interface Connection {
  id: string;
  name: string;
  type: string; // e.g., "Restaurant", "Individual"
  profilePictureUrl?: string;
  lastInteraction?: Date;
  status?: string; // e.g., "New Inquiry", "Responded"
}

const FarmerConnectionsPage: React.FC = () => {
  const { user } = useAuth();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user && user.role === UserRole.FARMER) {
      // Simulate fetching connections: Buyers who have interacted with the farmer
      const buyerIdsFromConversations = new Set<string>();
      mockConversations.forEach(convo => {
        if (convo.participantIds.includes(user.id)) {
          convo.participantIds.forEach(pId => {
            if (pId !== user.id) buyerIdsFromConversations.add(pId);
          });
        }
      });

      const fetchedConnections: Connection[] = [];
      mockUsers.forEach(u => {
        if (u.role === UserRole.BUYER && buyerIdsFromConversations.has(u.id)) {
          const relevantConversation = mockConversations.find(
            c => c.participantIds.includes(user.id) && c.participantIds.includes(u.id)
          );
          fetchedConnections.push({
            id: u.id,
            name: u.businessName || u.name,
            type: u.businessType || "Individual Buyer",
            profilePictureUrl: u.profilePictureUrl,
            lastInteraction: relevantConversation?.updatedAt,
            status: relevantConversation?.lastMessage?.senderId === u.id && !relevantConversation?.lastMessage?.read ? "New Inquiry" : "Responded"
          });
        }
      });
      
      // Sort by last interaction date, newest first
      fetchedConnections.sort((a, b) => (b.lastInteraction?.getTime() || 0) - (a.lastInteraction?.getTime() || 0));
      setConnections(fetchedConnections);
    }
    setIsLoading(false);
  }, [user]);

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading your connections..." />;
  }

  if (!user) {
    return <Alert type="info" message="Please log in to view your connections." />;
  }
  
  if (user.role !== UserRole.FARMER) {
     return <Alert type="warning" message="This page is for farmers only." />;
  }


  return (
    <div className="space-y-6">
      <Card>
        <h1 className="text-3xl font-bold text-primary-dark mb-6">My Buyer Connections</h1>
        {connections.length > 0 ? (
          <div className="space-y-4">
            {connections.map(conn => (
              <Card key={conn.id} className="flex flex-col sm:flex-row items-center justify-between p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                  <img 
                    src={conn.profilePictureUrl || `https://picsum.photos/seed/${conn.id}/80/80`}
                    alt={conn.name} 
                    className="w-16 h-16 rounded-full object-cover" 
                  />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">{conn.name}</h2>
                    <p className="text-sm text-gray-600">{conn.type}</p>
                    {conn.lastInteraction && <p className="text-xs text-gray-400">Last active: {new Date(conn.lastInteraction).toLocaleDateString()}</p>}
                    {conn.status && <p className={`text-xs font-medium mt-1 px-2 py-0.5 inline-block rounded-full ${conn.status === "New Inquiry" ? "bg-yellow-200 text-yellow-800" : "bg-green-200 text-green-800"}`}>{conn.status}</p>}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Link to={`${ROUTES.MESSAGES}?recipientId=${conn.id}`}> {/* This needs proper handling in MessagingPage to open/find convo */}
                     <Button variant="primary" size="sm" leftIcon={<ChatBubbleLeftEllipsisIcon />}>Message</Button>
                  </Link>
                  {/* <Button variant="outline" size="sm">View Profile</Button> Future: Link to buyer's profile if they have one */}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <UserCircleIcon className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No buyer connections yet.</p>
            <p className="text-gray-500 mt-2">When buyers contact you about your produce, their information will appear here.</p>
            <Link to={ROUTES.MY_PRODUCE}>
                <Button variant="primary" className="mt-6">Manage My Produce Listings</Button>
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
};

export default FarmerConnectionsPage;
