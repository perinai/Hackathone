
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Produce, FarmProfile } from '../types';
import { getProduceById } from '../services/produceService';
import { getFarmProfileByFarmerId } from '../services/userService';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import Button from '../components/Button';
import Card from '../components/Card';
import { DEFAULT_PRODUCE_IMAGE, DEFAULT_FARM_IMAGE, ROUTES } from '../constants';
import { MapPinIcon, PriceTagIcon, CalendarDaysIcon, UserCircleIcon, SproutIcon, ChatBubbleLeftEllipsisIcon } from '../components/Icons';
import { useAuth } from '../contexts/AuthContext';


const ProduceDetailPage: React.FC = () => {
  const { produceId } = useParams<{ produceId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [produce, setProduce] = useState<Produce | null>(null);
  const [farmerProfile, setFarmerProfile] = useState<FarmProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!produceId) {
      setError("Produce ID is missing.");
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const produceData = await getProduceById(produceId);
        if (produceData) {
          setProduce(produceData);
          const farmProfileData = await getFarmProfileByFarmerId(produceData.farmerId);
          setFarmerProfile(farmProfileData || null);
        } else {
          setError("Produce not found.");
        }
      } catch (err) {
        setError("Failed to fetch produce details. Please try again.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [produceId]);

  const handleContactFarmer = () => {
    if (!user) {
        navigate(ROUTES.LOGIN, { state: { from: location.pathname }});
        return;
    }
    if (produce) {
        // Navigate to messaging page, potentially pre-filling a new message
        // For now, just a placeholder
        navigate(ROUTES.MESSAGES, { state: { recipientId: produce.farmerId, produceId: produce.id, produceName: produce.name } });
        console.log(`Contacting farmer ${produce.farmerId} about ${produce.name}`);
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading fresh details..." />;
  }

  if (error) {
    return <Alert type="error" message={error} className="my-8" />;
  }

  if (!produce) {
    return <Alert type="info" message="Produce details are not available." className="my-8" />;
  }
  
  const images = produce.photos && produce.photos.length > 0 ? produce.photos : [DEFAULT_PRODUCE_IMAGE];
  const displayFarmerName = farmerProfile?.farmerName || produce.farmerName || "A Local Farmer";
  const displayFarmName = farmerProfile?.farmName || produce.farmName || "Local Farm";


  return (
    <div className="space-y-8">
      <Card>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div>
            <div className="relative aspect-w-4 aspect-h-3 mb-4 rounded-lg overflow-hidden shadow-lg">
              <img 
                src={images[currentImageIndex]} 
                alt={`${produce.name} - view ${currentImageIndex + 1}`} 
                className="w-full h-full object-cover transition-opacity duration-300"
              />
            </div>
            {images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className={`w-20 h-20 object-cover rounded-md cursor-pointer border-2 ${index === currentImageIndex ? 'border-primary' : 'border-transparent'} hover:border-primary-light`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Produce Details */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-primary-dark">{produce.name}</h1>
            <p className="text-lg text-gray-700">{produce.description}</p>
            
            <div className="flex items-center text-2xl font-semibold text-secondary-dark">
              <PriceTagIcon className="w-7 h-7 mr-2" /> ${produce.price.toFixed(2)} / {produce.unit}
            </div>

            <div className="text-sm text-gray-600 space-y-2">
              <p className="flex items-center"><SproutIcon className="w-5 h-5 mr-2 text-gray-500" />Category: <span className="font-medium ml-1">{produce.category}</span></p>
              <p className="flex items-center"><MapPinIcon className="w-5 h-5 mr-2 text-gray-500" />Pickup Location: <span className="font-medium ml-1">{produce.location}</span></p>
              {produce.availabilityDateFrom && (
                <p className="flex items-center"><CalendarDaysIcon className="w-5 h-5 mr-2 text-gray-500" />
                  Available from: {new Date(produce.availabilityDateFrom).toLocaleDateString()}
                  {produce.availabilityDateTo && ` to ${new Date(produce.availabilityDateTo).toLocaleDateString()}`}
                </p>
              )}
              <p className="text-gray-600">Quantity Available: <span className="font-medium">{produce.quantityAvailable} {produce.unit}{produce.quantityAvailable > 1 ? 's' : ''}</span></p>
            </div>

            {produce.tags && produce.tags.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-700 mb-1">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {produce.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4">
              <Button 
                size="lg" 
                onClick={handleContactFarmer} 
                className="w-full md:w-auto"
                leftIcon={<ChatBubbleLeftEllipsisIcon />}
              >
                Contact Farmer / Express Interest
              </Button>
              {/* Future: Add to Inquiry List, Request Order */}
            </div>
          </div>
        </div>
      </Card>

      {/* Farmer Profile Snapshot */}
      {farmerProfile && (
        <Card title="Meet the Farmer">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <img 
              src={farmerProfile.profilePictureUrl || DEFAULT_FARM_IMAGE} 
              alt={displayFarmName} 
              className="w-32 h-32 rounded-full object-cover shadow-md"
            />
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-semibold text-primary hover:underline">
                <Link to={`${ROUTES.FARMER_PROFILE}/${farmerProfile.farmerId}`}>{displayFarmName}</Link>
              </h2>
              <p className="text-lg text-gray-700">Run by: {displayFarmerName}</p>
              <p className="text-sm text-gray-500 mb-2">Member since {new Date(farmerProfile.memberSince).toLocaleDateString()}</p>
              <p className="text-gray-600 italic line-clamp-3 mb-3">{farmerProfile.farmStory || "A passionate local farmer dedicated to quality and community."}</p>
              <Link to={`${ROUTES.FARMER_PROFILE}/${farmerProfile.farmerId}`}>
                <Button variant="outline" size="sm">View Full Farmer Profile</Button>
              </Link>
            </div>
          </div>
        </Card>
      )}
      
      {/* TODO: Related Produce Section? */}
    </div>
  );
};

export default ProduceDetailPage;
    