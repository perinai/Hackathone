
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Produce, Notification, MarketTrend, BuyerMatch } from '../types';
import { getProduceForFarmer } from '../services/produceService';
import { getAIPersonalizedTip, findPotentialBuyerMatches } from '../services/geminiService'; // Assuming Gemini service exists
import { mockNotifications, mockMarketTrends } from '../services/mockData'; // Mock data
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
// Fix: Import SproutIcon and other used icons correctly
import { PlusCircleIcon, BellIcon, LightbulbIcon, SproutIcon } from '../components/Icons';
import { ROUTES, DEFAULT_PRODUCE_IMAGE } from '../constants';
import Alert from '../components/Alert';

const FarmerDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [produceList, setProduceList] = useState<Produce[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [marketTrends, setMarketTrends] = useState<MarketTrend[]>([]);
  const [potentialMatches, setPotentialMatches] = useState<BuyerMatch[]>([]);
  const [aiTip, setAiTip] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [farmerProduce, tip, matches] = await Promise.all([
          getProduceForFarmer(user.id),
          getAIPersonalizedTip("Farmer is on their dashboard, viewing active listings and market trends.", "farmer"),
          user.farmName && user.location ? findPotentialBuyerMatches(
            (await getProduceForFarmer(user.id)).slice(0,3).map(p => ({ name: p.name, category: p.category, quantity: p.quantityAvailable})), // use actual produce for better matches
            user.location
          ) : Promise.resolve(null)
        ]);
        setProduceList(farmerProduce);
        setNotifications(mockNotifications.filter(n => n.userId === user.id || n.type === 'system_tip').slice(0,3)); // Mock
        setMarketTrends(mockMarketTrends.slice(0,2)); // Mock
        setAiTip(tip);
        if (matches) {
            setPotentialMatches(matches);
        } else if(user.farmName && user.location){ // If AI call failed but info was present, show mock for demo
             setPotentialMatches([
                { buyerId: "mockBuyerGenerated", buyerName: "The Local Cafe", buyerType: "Restaurant", location: "Downtown", lookingFor: "Organic Vegetables", message: "AI Suggested Match (mock fallback)."},
            ]);
        }

      } catch (error) {
        console.error("Error fetching farmer dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading your farm dashboard..." />;
  }

  if (!user) {
    return <p>Please log in to view your dashboard.</p>;
  }

  const activeListings = produceList.filter(p => p.status === 'active');
  const newMessagesCount = notifications.filter(n => n.type === 'new_message' && !n.read).length; // Simplified

  return (
    <div className="space-y-8">
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-primary-dark mb-2">
          Good Morning, {user.name}! <span role="img" aria-label="sunflower">🌻</span>
        </h1>
        <p className="text-gray-600">Let's make today a bountiful one. Here's an overview of your farm's activity.</p>
        {aiTip && (
          // Fix: Pass content to Alert via message prop
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

      {/* Critical Alerts & Primary Actions */}
      <section className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 bg-yellow-50 border-l-4 border-yellow-400">
          <h2 className="text-xl font-semibold text-yellow-700 mb-2 flex items-center">
            <BellIcon className="w-6 h-6 mr-2" /> Alerts & Notifications
          </h2>
          {notifications.length > 0 ? (
            <ul className="space-y-2">
              {notifications.slice(0,3).map(n => (
                <li key={n.id} className={`text-sm p-2 rounded ${n.read ? 'bg-gray-100' : 'bg-yellow-100 font-medium'}`}>
                  <Link to={n.link || ROUTES.NOTIFICATIONS} className="hover:underline text-yellow-800">{n.title}</Link>
                  <p className="text-xs text-gray-600">{n.message.substring(0,50)}...</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No new critical alerts.</p>
          )}
          {newMessagesCount > 0 && <p className="text-sm text-red-600 mt-2">You have {newMessagesCount} new messages!</p>}
          <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.NOTIFICATIONS)} className="mt-4 w-full border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-white">View All Notifications</Button>
        </Card>

        <div className="md:col-span-2 space-y-6">
            <Button 
              onClick={() => navigate(ROUTES.ADD_PRODUCE)} 
              size="lg" 
              fullWidth 
              className="bg-gradient-to-r from-green-500 to-primary hover:from-green-600 hover:to-primary-dark text-white shadow-lg transform hover:scale-105 transition-transform duration-200"
              leftIcon={<PlusCircleIcon className="w-6 h-6"/>}
            >
              Add New Produce Listing
            </Button>
            <Button 
                onClick={() => navigate(ROUTES.MY_PRODUCE)} 
                variant="outline" 
                size="lg" 
                fullWidth
            >
                Manage My Active Listings ({activeListings.length})
            </Button>
        </div>
      </section>

      {/* At-a-Glance Information Sections */}
      <section className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My Listings Snapshot */}
        <Card title="My Listings Snapshot" className="lg:col-span-2">
          {activeListings.length > 0 ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {activeListings.slice(0, 3).map(produce => (
                <Link key={produce.id} to={`${ROUTES.PRODUCE_DETAIL}/${produce.id}`} className="block group">
                  <div className="border rounded-lg p-3 hover:shadow-md transition-shadow h-full flex flex-col">
                    <img src={produce.photos[0] || DEFAULT_PRODUCE_IMAGE} alt={produce.name} className="h-32 w-full object-cover rounded mb-2"/>
                    <h4 className="font-semibold text-gray-700 group-hover:text-primary truncate">{produce.name}</h4>
                    <p className="text-sm text-gray-500">${produce.price}/{produce.unit}</p>
                    <p className="text-xs text-green-600 capitalize mt-auto">{produce.status}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
                {/* Fix: Use imported SproutIcon */}
                <SproutIcon className="w-16 h-16 text-gray-300 mx-auto mb-4"/>
                <p className="text-gray-500 mb-4">Your farm stand is looking a bit bare!</p>
                <p className="text-gray-500 mb-4">Let's add your first amazing produce and get you noticed. 🌱</p>
                <Button variant="primary" onClick={() => navigate(ROUTES.ADD_PRODUCE)}>List Your First Produce</Button>
            </div>
          )}
          {activeListings.length > 3 && 
            <Button onClick={() => navigate(ROUTES.MY_PRODUCE)} variant="ghost" className="mt-4 w-full">View All Listings</Button>
          }
        </Card>

        {/* Market Pulse */}
        <Card title="Market Pulse" className="bg-blue-50 border-l-4 border-blue-400">
          {marketTrends.length > 0 ? (
            <ul className="space-y-3">
              {marketTrends.map(trend => (
                <li key={trend.produceCategory} className="text-sm p-2 bg-blue-100 rounded">
                  <h4 className="font-semibold text-blue-700">{trend.produceCategory}
                    <span className={`ml-2 text-xs ${trend.trend === 'up' ? 'text-green-600' : trend.trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                      ({trend.trend} {trend.percentageChange ? `${trend.percentageChange}%` : ''})
                    </span>
                  </h4>
                  <p className="text-xs text-blue-600">{trend.insight}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">Market insights will appear here.</p>
          )}
          <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.FARMER_MARKET_INSIGHTS)} className="mt-4 w-full border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white">
            Explore All Market Insights
          </Button>
        </Card>
      </section>
      
      {/* Potential Connections */}
      {potentialMatches.length > 0 && (
        <section>
            <Card title="✨ Potential Buyer Connections (AI Suggested)" className="bg-purple-50 border-l-4 border-purple-400">
                <div className="grid md:grid-cols-2 gap-4">
                    {potentialMatches.map(match => (
                        <div key={match.buyerId} className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                            <h4 className="font-semibold text-purple-700">{match.buyerName} ({match.buyerType})</h4>
                            <p className="text-sm text-gray-600">Location: {match.location}</p>
                            <p className="text-sm text-gray-600">Looking for: <span className="font-medium">{match.lookingFor}</span></p>
                            {match.message && <p className="text-xs italic text-gray-500 mt-1">{match.message}</p>}
                             <Button 
                                size="sm" 
                                variant="ghost" 
                                className="mt-2 text-purple-600 hover:bg-purple-100"
                                onClick={() => navigate(match.profileLink || ROUTES.FARMER_CONNECTIONS)} // conceptual link
                            >
                                View Profile & Connect
                            </Button>
                        </div>
                    ))}
                </div>
                 <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.FARMER_CONNECTIONS)} className="mt-4 w-full border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white">
                    Manage All Connections
                </Button>
            </Card>
        </section>
      )}

      {/* Joyful/Community Element */}
      <section>
        <Card className="bg-primary-light text-center">
            {/* Fix: Use imported SproutIcon */}
            <SproutIcon className="w-12 h-12 text-primary-dark mx-auto mb-3" />
            <h3 className="text-xl font-semibold text-primary-dark mb-2">Tip for Growth!</h3>
            <p className="text-gray-700">Buyers love to see photos of your farm! Consider adding one to your public profile to build trust and connection.</p>
            <Button variant="secondary" size="sm" className="mt-4" onClick={() => navigate(ROUTES.PROFILE)}>Update My Profile</Button>
        </Card>
      </section>
    </div>
  );
};

export default FarmerDashboard;