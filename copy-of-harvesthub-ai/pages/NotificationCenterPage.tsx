
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Notification } from '../types';
import { mockNotifications } from '../services/mockData'; // Using mock data
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
// Fix: Import UserGroupIcon
import { BellIcon, LightbulbIcon, ChatBubbleLeftEllipsisIcon, UserGroupIcon } from '../components/Icons'; 

const NotificationIcon: React.FC<{type: Notification['type']}> = ({ type }) => {
    switch(type) {
        case 'price_alert': return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-500"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" /></svg>;
        case 'buyer_match': return <UserGroupIcon className="w-6 h-6 text-purple-500"/>;
        case 'new_message': return <ChatBubbleLeftEllipsisIcon className="w-6 h-6 text-green-500"/>;
        case 'system_tip': return <LightbulbIcon className="w-6 h-6 text-yellow-500"/>;
        case 'listing_update': return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-indigo-500"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>;
        default: return <BellIcon className="w-6 h-6 text-gray-500"/>;
    }
}


const NotificationCenterPage: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    if (user) {
      // In a real app, fetch notifications for user.id
      // For now, filter mock data.
      const userNotifications = mockNotifications.filter(n => n.userId === user.id || n.type === 'system_tip' || n.type === 'welcome');
      setNotifications(userNotifications.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    }
    setIsLoading(false);
  }, [user]);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
    // In real app, also send API request to mark as read
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const filteredNotifications = notifications.filter(n => 
    filter === 'all' || (filter === 'unread' && !n.read)
  );

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading notifications..." />;
  }

  if (!user) {
    return <p>Please log in to view notifications.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        <div className="flex justify-between items-center mb-6 pb-4 border-b">
            <h1 className="text-3xl font-bold text-primary-dark flex items-center">
                <BellIcon className="w-8 h-8 mr-3"/> Notification Center
            </h1>
            {notifications.some(n => !n.read) && (
                 <Button onClick={markAllAsRead} variant="outline" size="sm">Mark All as Read</Button>
            )}
        </div>
        
        <div className="mb-4">
            <label htmlFor="filter" className="mr-2 text-sm font-medium text-gray-700">Show:</label>
            <select 
                id="filter" 
                value={filter} 
                onChange={(e) => setFilter(e.target.value as 'all' | 'unread')}
                className="p-2 border border-gray-300 rounded-md bg-white text-sm focus:ring-primary focus:border-primary"
            >
                <option value="all">All Notifications</option>
                <option value="unread">Unread Only</option>
            </select>
        </div>

        {filteredNotifications.length > 0 ? (
          <ul className="space-y-4">
            {filteredNotifications.map(notification => (
              <li 
                key={notification.id} 
                className={`p-4 rounded-lg shadow-sm border-l-4 ${notification.read ? 'bg-gray-50 border-gray-300' : 'bg-yellow-50 border-yellow-400 font-medium'}`}
              >
                <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 pt-1">
                        <NotificationIcon type={notification.type}/>
                    </div>
                    <div className="flex-1">
                        <Link to={notification.link || '#'} className={`text-lg ${notification.read ? 'text-gray-800' : 'text-yellow-800'} hover:underline`}>
                            {notification.title}
                        </Link>
                        <p className={`text-sm ${notification.read ? 'text-gray-600' : 'text-gray-700'}`}>{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{new Date(notification.timestamp).toLocaleString()}</p>
                    </div>
                    {!notification.read && (
                        <Button onClick={() => markAsRead(notification.id)} variant="ghost" size="sm" className="text-xs">Mark as Read</Button>
                    )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-10">
            <BellIcon className="w-16 h-16 text-gray-300 mx-auto mb-4"/>
            <p className="text-gray-500">You're all caught up! No new notifications right now.</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default NotificationCenterPage;