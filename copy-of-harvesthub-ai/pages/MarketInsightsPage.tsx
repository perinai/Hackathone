
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import { MarketTrend } from '../types';
import { mockMarketTrends } from '../services/mockData'; // Using mock data for now
import { getAIPersonalizedTip } from '../services/geminiService'; // Example AI integration
import { LightbulbIcon, SproutIcon } from '../components/Icons';

const MarketInsightsPage: React.FC = () => {
  const { user } = useAuth();
  const [marketTrends, setMarketTrends] = useState<MarketTrend[]>([]);
  const [aiTip, setAiTip] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // In a real app, fetch dynamic market trends, possibly using Gemini
        // For now, use mock data and a generic tip
        setMarketTrends(mockMarketTrends);
        
        const tipContext = `Farmer is viewing market insights for their region: ${user.location}. They grow various produce.`;
        const tip = await getAIPersonalizedTip(tipContext, 'farmer');
        setAiTip(tip);

      } catch (err) {
        console.error("Error fetching market insights:", err);
        setError("Could not load market insights at this time. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading market insights..." />;
  }

  if (error) {
    return <Alert type="error" message={error} className="my-8" />;
  }
  
  if (!user) {
    return <Alert type="info" message="Please log in to view market insights." />
  }

  return (
    <div className="space-y-8">
      <Card>
        <div className="text-center mb-8">
          <SproutIcon className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-primary-dark">Market Insights for Farmers</h1>
          <p className="text-lg text-gray-600 mt-2">
            Stay informed with AI-powered data on local market prices and demand trends in {user.location || 'your region'}.
          </p>
        </div>
      </Card>

      {aiTip && (
        <Alert type="info" className="mb-6" message={
          <div className="flex items-start">
            <LightbulbIcon className="w-6 h-6 mr-3 text-blue-500 flex-shrink-0" />
            <div>
              <p className="font-semibold">AI-Powered Tip:</p>
              <p>{aiTip}</p>
            </div>
          </div>
        }/>
      )}

      {marketTrends.length > 0 ? (
        marketTrends.map((trend, index) => (
          <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">{trend.produceCategory}</h2>
            <div className="flex items-center mb-2">
              <span className={`px-3 py-1 text-sm font-semibold rounded-full mr-3
                ${trend.trend === 'up' ? 'bg-green-100 text-green-700' : 
                  trend.trend === 'down' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-700'}`}>
                Trend: {trend.trend.charAt(0).toUpperCase() + trend.trend.slice(1)}
                {trend.percentageChange && ` (${trend.percentageChange > 0 ? '+' : ''}${trend.percentageChange}%)`}
              </span>
              <span className="text-xs text-gray-500">Period: {trend.period}</span>
            </div>
            <p className="text-gray-700 leading-relaxed">{trend.insight}</p>
            {/* Placeholder for charts - In a real app, you'd use a charting library */}
            <div className="mt-4 p-4 bg-gray-50 rounded-md text-center text-gray-500 italic">
              [Simple chart/graph for {trend.produceCategory} would go here]
            </div>
          </Card>
        ))
      ) : (
        <Card>
          <p className="text-gray-600 text-center py-8">
            No specific market trends available at the moment. AI is actively analyzing data for {user.location || 'your region'}. Check back soon!
          </p>
        </Card>
      )}

      <Card className="mt-8 text-center bg-gray-50">
        <p className="text-sm text-gray-600">
          <strong>Note:</strong> Market insights are AI-generated suggestions based on available data and should be used as one of many factors in your decision-making.
        </p>
      </Card>
    </div>
  );
};

export default MarketInsightsPage;
