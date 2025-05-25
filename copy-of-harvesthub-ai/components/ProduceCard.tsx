
import React from 'react';
import { Link } from 'react-router-dom';
import { Produce } from '../types';
import { DEFAULT_PRODUCE_IMAGE, ROUTES } from '../constants';
import { MapPinIcon, PriceTagIcon, CalendarDaysIcon } from './Icons';
import Button from './Button';

interface ProduceCardProps {
  produce: Produce;
}

const ProduceCard: React.FC<ProduceCardProps> = ({ produce }) => {
  const imageUrl = produce.photos && produce.photos.length > 0 ? produce.photos[0] : DEFAULT_PRODUCE_IMAGE;
  
  return (
    <Link to={`${ROUTES.PRODUCE_DETAIL}/${produce.id}`} className="block group">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl transform hover:-translate-y-1 h-full flex flex-col">
        <div className="relative h-56">
          <img 
            src={imageUrl} 
            alt={produce.name} 
            className="w-full h-full object-cover"
          />
          {produce.tags.includes('organic') && (
             <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">Organic</span>
          )}
           <span className="absolute top-2 right-2 bg-secondary text-white text-xs font-semibold px-2 py-1 rounded capitalize">{produce.category}</span>
        </div>
        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-xl font-semibold text-gray-800 mb-2 truncate group-hover:text-primary">{produce.name}</h3>
          <p className="text-sm text-gray-600 mb-1 flex items-center">
            <PriceTagIcon className="w-4 h-4 mr-2 text-primary" />
            <span className="font-semibold text-lg text-primary-dark">${produce.price.toFixed(2)}</span> / {produce.unit}
          </p>
          <p className="text-sm text-gray-600 mb-1 flex items-center">
            <MapPinIcon className="w-4 h-4 mr-2 text-gray-500" />
            {produce.location}
          </p>
          {produce.availabilityDateFrom && (
            <p className="text-sm text-gray-600 mb-3 flex items-center">
              <CalendarDaysIcon className="w-4 h-4 mr-2 text-gray-500" />
              Available {new Date(produce.availabilityDateFrom).toLocaleDateString()}
              {produce.availabilityDateTo && ` to ${new Date(produce.availabilityDateTo).toLocaleDateString()}`}
            </p>
          )}
          <p className="text-xs text-gray-500 mb-3 truncate">
            By <Link to={`${ROUTES.FARMER_PROFILE}/${produce.farmerId}`} onClick={(e) => e.stopPropagation()} className="text-primary hover:underline">{produce.farmName || produce.farmerName || 'A Local Farmer'}</Link>
          </p>
          
          <div className="mt-auto">
             <Button variant="primary" size="sm" fullWidth>
              View Details
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProduceCard;
    