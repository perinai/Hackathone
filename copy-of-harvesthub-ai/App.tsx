
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import RegistrationPage from './pages/RegistrationPage';
import LoginPage from './pages/LoginPage';
import FarmerDashboard from './pages/FarmerDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import MyProducePage from './pages/MyProducePage';
import ProduceListingForm from './pages/ProduceListingForm';
import MarketplacePage from './pages/MarketplacePage';
import ProduceDetailPage from './pages/ProduceDetailPage';
import UserProfilePage from './pages/UserProfilePage';
import NotificationCenterPage from './pages/NotificationCenterPage';
import MessagingPage from './pages/MessagingPage';
import AboutUsPage from './pages/AboutUsPage';
import HelpPage from './pages/HelpPage';
import MarketInsightsPage from './pages/MarketInsightsPage';
import FarmerConnectionsPage from './pages/FarmerConnectionsPage';
import BuyerConnectionsPage from './pages/BuyerConnectionsPage';
import FarmerProfilePage from './pages/FarmerProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import { useAuth } from './contexts/AuthContext';
import { UserRole } from './types';
import { ROUTES } from './constants';

const ProtectedRoute: React.FC<{ children: React.ReactNode; role?: UserRole }> = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><p>Loading...</p></div>;
  }

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (role && user.role !== role) {
    // Redirect to their respective dashboard if role mismatch
    if (user.role === UserRole.FARMER) return <Navigate to={ROUTES.FARMER_DASHBOARD} replace />;
    if (user.role === UserRole.BUYER) return <Navigate to={ROUTES.BUYER_DASHBOARD} replace />;
    return <Navigate to={ROUTES.LANDING} replace />; // Fallback
  }

  return <>{children}</>;
};


const App: React.FC = () => {
  const { user } = useAuth();

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            {/* Universal Routes */}
            <Route path={ROUTES.LANDING} element={<LandingPage />} />
            <Route path={ROUTES.REGISTER} element={<RegistrationPage />} />
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.ABOUT_US} element={<AboutUsPage />} />
            <Route path={ROUTES.HELP} element={<HelpPage />} />
            <Route path={ROUTES.MARKETPLACE} element={<MarketplacePage />} />
             <Route path={`${ROUTES.PRODUCE_DETAIL}/:produceId`} element={<ProduceDetailPage />} />
            <Route path={`${ROUTES.FARMER_PROFILE}/:farmerId`} element={<FarmerProfilePage />} />


            {/* Farmer Routes */}
            <Route path={ROUTES.FARMER_DASHBOARD} element={<ProtectedRoute role={UserRole.FARMER}><FarmerDashboard /></ProtectedRoute>} />
            <Route path={ROUTES.MY_PRODUCE} element={<ProtectedRoute role={UserRole.FARMER}><MyProducePage /></ProtectedRoute>} />
            <Route path={ROUTES.ADD_PRODUCE} element={<ProtectedRoute role={UserRole.FARMER}><ProduceListingForm /></ProtectedRoute>} />
            <Route path={`${ROUTES.EDIT_PRODUCE}/:produceId`} element={<ProtectedRoute role={UserRole.FARMER}><ProduceListingForm /></ProtectedRoute>} />
            <Route path={ROUTES.FARMER_MARKET_INSIGHTS} element={<ProtectedRoute role={UserRole.FARMER}><MarketInsightsPage /></ProtectedRoute>} />
            <Route path={ROUTES.FARMER_CONNECTIONS} element={<ProtectedRoute role={UserRole.FARMER}><FarmerConnectionsPage /></ProtectedRoute>} />

            {/* Buyer Routes */}
            <Route path={ROUTES.BUYER_DASHBOARD} element={<ProtectedRoute role={UserRole.BUYER}><BuyerDashboard /></ProtectedRoute>} />
            <Route path={ROUTES.BUYER_CONNECTIONS} element={<ProtectedRoute role={UserRole.BUYER}><BuyerConnectionsPage /></ProtectedRoute>} />
            
            {/* Shared Logged-In Routes */}
            <Route path={ROUTES.PROFILE} element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
            <Route path={ROUTES.NOTIFICATIONS} element={<ProtectedRoute><NotificationCenterPage /></ProtectedRoute>} />
            <Route path={ROUTES.MESSAGES} element={<ProtectedRoute><MessagingPage /></ProtectedRoute>} />
            <Route path={`${ROUTES.MESSAGES}/:conversationId`} element={<ProtectedRoute><MessagingPage /></ProtectedRoute>} />


            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <footer className="bg-primary-dark text-white text-center p-4">
          <p>&copy; {new Date().getFullYear()} HarvestHub AI. Nourishing Communities, Joyfully.</p>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;
