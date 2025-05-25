
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import { Link } from 'react-router-dom';
import { ROUTES, DEFAULT_FARM_IMAGE } from '../constants';
import { UserCircleIcon, ChatBubbleLeftEllipsisIcon, MapPinIcon } from '../components/Icons';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
// Mock data for demonstration
import { mockUsers, mockConversations } from '../services/mockData';
import { User, UserRole, Conversation } from '../types';


interface Connection {
  id: string;
  farmName: string;
  farmerName: string;
  location: string;
  profilePictureUrl?: string;
  lastInteraction?: Date;
  status?: string; // e.g. "Replied", "Awaiting Reply"
}


const BuyerConnectionsPage: React.FC = () => {
  const { user } = useAuth();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user && user.role === UserRole.BUYER) {
      // Simulate fetching connections: Farmers the buyer has interacted with
      const farmerIdsFromConversations = new Set<string>();
      mockConversations.forEach(convo => {
        if (convo.participantIds.includes(user.id)) {
          convo.participantIds.forEach(pId => {
            if (pId !== user.id) farmerIdsFromConversations.add(pId);
          });
        }
      });

      const fetchedConnections: Connection[] = [];
      mockUsers.forEach(u => {
        if (u.role === UserRole.FARMER && farmerIdsFromConversations.has(u.id)) {
           const relevantConversation = mockConversations.find(
            c => c.participantIds.includes(user.id) && c.participantIds.includes(u.id)
          );
          fetchedConnections.push({
            id: u.id,
            farmName: u.farmName || "A Local Farm",
            farmerName: u.name,
            location: u.location || "Unknown Location",
            profilePictureUrl: u.profilePictureUrl || DEFAULT_FARM_IMAGE,
            lastInteraction: relevantConversation?.updatedAt,
            status: relevantConversation?.lastMessage?.senderId === u.id && !relevantConversation?.lastMessage?.read ? "New Message" : "Viewed"
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
  
  if (user.role !== UserRole.BUYER) {
     return <Alert type="warning" message="This page is for buyers only." />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <h1 className="text-3xl font-bold text-primary-dark mb-6">My Farmer Connections</h1>
        {/* Add filter/sort options here in future */}
        {connections.length > 0 ? (
          <div className="space-y-4">
            {connections.map(conn => (
              <Card key={conn.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-4 mb-4 sm:mb-0 flex-grow">
                  <img 
                    src={conn.profilePictureUrl} 
                    alt={conn.farmName} 
                    className="w-20 h-20 rounded-lg object-cover" 
                  />
                  <div className="flex-grow">
                    <Link to={`${ROUTES.FARMER_PROFILE}/${conn.id}`} className="hover:underline">
                        <h2 className="text-xl font-semibold text-primary">{conn.farmName}</h2>
                    </Link>
                    <p className="text-sm text-gray-700">Operated by: {conn.farmerName}</p>
                    <p className="text-xs text-gray-500 flex items-center mt-1">
                        <MapPinIcon className="w-3 h-3 mr-1 text-gray-400"/> {conn.location}
                    </p>
                    {conn.lastInteraction && <p className="text-xs text-gray-400 mt-1">Last active: {new Date(conn.lastInteraction).toLocaleDateString()}</p>}
                     {conn.status && <p className={`text-xs font-medium mt-1 px-2 py-0.5 inline-block rounded-full ${conn.status === "New Message" ? "bg-yellow-200 text-yellow-800" : "bg-gray-200 text-gray-800"}`}>{conn.status}</p>}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 self-start sm:self-center">
                  <Link to={`${ROUTES.MESSAGES}?recipientId=${conn.id}`}> {/* This needs proper handling in MessagingPage */}
                     <Button variant="primary" size="sm" leftIcon={<ChatBubbleLeftEllipsisIcon />} className="w-full sm:w-auto">Message</Button>
                  </Link>
                  <Link to={`${ROUTES.FARMER_PROFILE}/${conn.id}`}>
                    <Button variant="outline" size="sm" className="w-full sm:w-auto">View Profile</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <UserCircleIcon className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No farmer connections yet.</p>
            <p className="text-gray-500 mt-2">Start by finding produce in the marketplace and contacting farmers.</p>
            <Link to={ROUTES.MARKETPLACE}>
                <Button variant="primary" className="mt-6">Find Produce</Button>
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
};

export default BuyerConnectionsPage;
