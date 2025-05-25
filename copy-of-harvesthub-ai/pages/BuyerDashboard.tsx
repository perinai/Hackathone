
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Produce, FarmProfile, Notification as NotificationType } from '../types'; // Renamed to avoid conflict
import { getAllProduce } from '../services/produceService'; // Get some produce for suggestions
import { getFarmerRecommendationsForBuyer } from '../services/userService'; // Mock recommendations
import { getAIPersonalizedTip } from '../services/geminiService';
import { mockNotifications } from '../services/mockData';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import ProduceCard from '../components/ProduceCard';
import { SearchIcon, LightbulbIcon, BellIcon, MapPinIcon } from '../components/Icons';
import Alert from '../components/Alert';
import { ROUTES, DEFAULT_FARM_IMAGE } from '../constants'; // DEFAULT_FARM_IMAGE for farmer card

const BuyerDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestedProduce, setSuggestedProduce] = useState<Produce[]>([]);
  const [recommendedFarmers, setRecommendedFarmers] = useState<FarmProfile[]>([]);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [aiTip, setAiTip] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [produceData, farmerData, tipData] = await Promise.all([
          getAllProduce({ query: user.produceInterests?.[0] || 'organic', category: '' }), // Fetch some initial suggestions
          getFarmerRecommendationsForBuyer(user.id),
          getAIPersonalizedTip("Buyer is on their dashboard, looking for fresh produce.", "buyer")
        ]);
        
        setSuggestedProduce(produceData.slice(0, 4)); // Show a few suggestions
        setRecommendedFarmers(farmerData.slice(0,3));
        setNotifications(mockNotifications.filter(n => n.userId === user.id || n.type === 'system_tip').slice(0,3)); // Mock
        setAiTip(tipData);

      } catch (error) {
        console.error("Error fetching buyer dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user]);

  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`${ROUTES.MARKETPLACE}?query=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate(ROUTES.MARKETPLACE);
    }
  };
  
  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading your market view..." />;
  }

  if (!user) {
    return <p>Please log in to view your dashboard.</p>;
  }
  
  const newMessagesCount = notifications.filter(n => n.type === 'new_message' && !n.read).length;


  return (
    <div className="space-y-8">
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-primary-dark mb-2">
          Welcome back, {user.name}! <span role="img" aria-label="shopping bags">🛍️</span>
        </h1>
        <p className="text-gray-600">Ready to discover the freshest local produce? Let's find what you're looking for.</p>
        {aiTip && (
           <Alert 
            type="info" 
            className="mt-4"
            message={
              <div className="flex items-start">
                <LightbulbIcon className="w-5 h-5 mr-2 text-blue-500 mt-1" />
                <div>
                  <p className="font-semibold">HarvestHub AI Tip:</p>
                  <p>{aiTip}</p>
                </div>
              </div>
            }
          />
        )}
      </section>

      {/* Search Bar & Primary Actions */}
      <section className="space-y-4">
        <form onSubmit={handleSearch} className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-md">
          <SearchIcon className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for produce, specific items, or farm names..."
            className="flex-grow p-2 border-none focus:ring-0 text-gray-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button type="submit" variant="primary">Search Marketplace</Button>
        </form>
        <div className="grid md:grid-cols-2 gap-4">
            <Button onClick={() => navigate(ROUTES.MARKETPLACE)} variant="secondary" size="lg" fullWidth>
                Browse Full Marketplace
            </Button>
            <Button onClick={() => navigate(ROUTES.BUYER_CONNECTIONS)} variant="outline" size="lg" fullWidth>
                View My Connections & Saved Farmers
            </Button>
        </div>
      </section>
      
        {/* Notifications Snapshot */}
      <Card title="Quick Updates & Notifications" className="bg-yellow-50 border-l-4 border-yellow-400">
         <div className="flex items-center text-xl font-semibold text-yellow-700 mb-2">
            <BellIcon className="w-6 h-6 mr-2" /> Alerts
          </div>
          {notifications.length > 0 ? (
            <ul className="space-y-2">
              {notifications.slice(0,3).map(n => (
                <li key={n.id} className={`text-sm p-2 rounded ${n.read ? 'bg-gray-100' : 'bg-yellow-100 font-medium'}`}>
                  <Link to={n.link || ROUTES.NOTIFICATIONS} className="hover:underline text-yellow-800">{n.title}</Link>
                   <p className="text-xs text-gray-600">{n.message.substring(0,70)}...</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No new critical alerts.</p>
          )}
          {newMessagesCount > 0 && <p className="text-sm text-red-600 mt-2">You have {newMessagesCount} new messages!</p>}
          <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.NOTIFICATIONS)} className="mt-4 w-full border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-white">View All Notifications</Button>
      </Card>


      {/* Suggested Produce */}
      {suggestedProduce.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Just For You: Produce Suggestions</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {suggestedProduce.map(produce => (
              <ProduceCard key={produce.id} produce={produce} />
            ))}
          </div>
           <div className="text-center mt-6">
                <Button variant="ghost" onClick={() => navigate(ROUTES.MARKETPLACE)}>Explore More Produce</Button>
            </div>
        </section>
      )}

      {/* Recommended Farmers */}
      {recommendedFarmers.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Discover Local Farmers</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {recommendedFarmers.map(farmer => (
              <Card key={farmer.farmerId} className="hover:shadow-xl transition-shadow">
                <Link to={`${ROUTES.FARMER_PROFILE}/${farmer.farmerId}`} className="block">
                  <img 
                    src={farmer.profilePictureUrl || DEFAULT_FARM_IMAGE} 
                    alt={farmer.farmName} 
                    className="w-full h-40 object-cover rounded-t-xl"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-primary group-hover:underline">{farmer.farmName}</h3>
                    <p className="text-sm text-gray-600">{farmer.farmerName}</p>
                    <p className="text-xs text-gray-500 flex items-center mt-1">
                        <MapPinIcon className="w-4 h-4 mr-1 text-gray-400"/> {farmer.location}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 truncate">
                        Specializes in: {farmer.primaryProduce?.join(', ') || 'Various local goods'}
                    </p>
                     <Button variant="outline" size="sm" fullWidth className="mt-3">View Profile</Button>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
          <div className="text-center mt-6">
                <Button variant="ghost" onClick={() => navigate(ROUTES.BUYER_CONNECTIONS, {state: { findNew: true }})}>Find More Farmers</Button>
            </div>
        </section>
      )}
      
        {/* Call to Action or Tip */}
      <section>
        <Card className="bg-secondary-light text-center">
            <LightbulbIcon className="w-12 h-12 text-secondary-dark mx-auto mb-3" />
            <h3 className="text-xl font-semibold text-secondary-dark mb-2">Build Relationships!</h3>
            <p className="text-gray-700">Connect directly with farmers to learn about their practices and get the freshest seasonal items. Many farmers offer direct sales or CSA shares.</p>
            <Button variant="primary" size="sm" className="mt-4" onClick={() => navigate(ROUTES.MARKETPLACE)}>Start Exploring Now</Button>
        </Card>
      </section>

    </div>
  );
};

export default BuyerDashboard;
