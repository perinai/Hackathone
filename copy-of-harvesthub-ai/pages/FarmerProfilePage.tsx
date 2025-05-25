
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FarmProfile, Produce } from '../types';
import { getFarmProfileByFarmerId } from '../services/userService';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import Card from '../components/Card';
import ProduceCard from '../components/ProduceCard'; // Re-use for consistency
import { DEFAULT_FARM_IMAGE, ROUTES } from '../constants';
import { MapPinIcon, CalendarDaysIcon, ChatBubbleLeftEllipsisIcon } from '../components/Icons';
import Button from '../components/Button';
import { useAuth } from '../contexts/AuthContext'; // To check if current user is this farmer

const FarmerProfilePage: React.FC = () => {
  const { farmerId } = useParams<{ farmerId: string }>();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState<FarmProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!farmerId) {
      setError("Farmer ID is missing.");
      setIsLoading(false);
      return;
    }

    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const profileData = await getFarmProfileByFarmerId(farmerId);
        if (profileData) {
          setProfile(profileData);
        } else {
          setError("Farmer profile not found.");
        }
      } catch (err) {
        setError("Failed to fetch farmer profile. Please try again.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [farmerId]);

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading farmer's profile..." />;
  }

  if (error) {
    return <Alert type="error" message={error} className="my-8" />;
  }

  if (!profile) {
    return <Alert type="info" message="Farmer profile is not available." className="my-8" />;
  }

  const isOwnProfile = currentUser?.id === farmerId;

  return (
    <div className="space-y-8">
      {/* Profile Header Card */}
      <Card className="overflow-hidden">
        <div className="relative h-64 bg-gray-200">
          <img 
            src={profile.profilePictureUrl || DEFAULT_FARM_IMAGE} // Could be a farm banner image
            alt={`${profile.farmName} cover image`}
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center text-center p-4">
            <img
              src={profile.profilePictureUrl || `https://picsum.photos/seed/${profile.farmerId}/150/150`}
              alt={profile.farmerName}
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl mb-4"
            />
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">{profile.farmName}</h1>
            <p className="text-xl text-gray-200 drop-shadow-md">Operated by {profile.farmerName}</p>
          </div>
        </div>
        <div className="p-6 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                    <p className="text-gray-600 flex items-center"><MapPinIcon className="w-5 h-5 mr-2 text-gray-500" />{profile.location}</p>
                    <p className="text-sm text-gray-500 flex items-center"><CalendarDaysIcon className="w-4 h-4 mr-2 text-gray-400" />Member since {new Date(profile.memberSince).toLocaleDateString()}</p>
                </div>
                {isOwnProfile ? (
                     <Link to={ROUTES.PROFILE}>
                        <Button variant="outline" size="sm" className="mt-2 sm:mt-0">Edit My Profile</Button>
                    </Link>
                ) : (
                    <Link to={ROUTES.MESSAGES} state={{ recipientId: profile.farmerId, recipientName: profile.farmerName }}>
                        <Button variant="primary" leftIcon={<ChatBubbleLeftEllipsisIcon />} className="mt-2 sm:mt-0">
                            Contact {profile.farmerName}
                        </Button>
                    </Link>
                )}
            </div>
            
            <div>
                <h2 className="text-xl font-semibold text-primary-dark mb-2">Our Farm Story & Philosophy</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{profile.farmStory || "This farmer is passionate about bringing fresh, local produce to the community!"}</p>
            </div>

            {profile.practices && profile.practices.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-1">Our Practices:</h3>
                    <div className="flex flex-wrap gap-2">
                    {profile.practices.map(practice => (
                        <span key={practice} className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">{practice}</span>
                    ))}
                    </div>
                </div>
            )}
        </div>
      </Card>

      {/* Current Listings Section */}
      <section>
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Currently Available from {profile.farmName}</h2>
        {profile.currentListings && profile.currentListings.length > 0 ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {profile.currentListings.map(produce => (
              <ProduceCard key={produce.id} produce={produce} />
            ))}
          </div>
        ) : (
          <Card>
            <p className="text-gray-600 text-center py-8">
              {profile.farmName} has no active listings at the moment. Check back soon!
            </p>
          </Card>
        )}
      </section>

      {/* Reviews/Testimonials (Future Feature) */}
      {/* 
      <section>
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">What Buyers Say (Coming Soon)</h2>
        <Card>
          <p className="text-gray-600 text-center py-8">Reviews and testimonials will be shown here once available.</p>
        </Card>
      </section>
      */}
    </div>
  );
};

export default FarmerProfilePage;
    