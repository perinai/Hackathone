
import React from 'react';
import { Link } from 'react-router-dom';
import { Produce } from '../types';
import { DEFAULT_PRODUCE_IMAGE, ROUTES } from '../constants';
import Button from './Button';

interface ProduceListItemProps {
  produce: Produce;
  onEdit: (produceId: string) => void;
  onDelete: (produceId: string) => void; // Or toggle status
  onToggleStatus: (produceId: string, newStatus: Produce['status']) => void;
}

const ProduceListItem: React.FC<ProduceListItemProps> = ({ produce, onEdit, onDelete, onToggleStatus }) => {
  const imageUrl = produce.photos && produce.photos.length > 0 ? produce.photos[0] : DEFAULT_PRODUCE_IMAGE;

  const statusClasses = {
    active: 'bg-green-100 text-green-700',
    sold_out: 'bg-yellow-100 text-yellow-700',
    expired: 'bg-red-100 text-red-700',
    draft: 'bg-gray-100 text-gray-700',
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4 flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
      <img 
        src={imageUrl} 
        alt={produce.name} 
        className="w-full sm:w-32 h-32 object-cover rounded-md"
      />
      <div className="flex-grow">
        <Link to={`${ROUTES.PRODUCE_DETAIL}/${produce.id}`} className="hover:underline">
            <h3 className="text-lg font-semibold text-primary">{produce.name}</h3>
        </Link>
        <p className="text-sm text-gray-600">{produce.category}</p>
        <p className="text-sm text-gray-800 font-medium">${produce.price.toFixed(2)} / {produce.unit}</p>
        <p className="text-xs text-gray-500">Quantity: {produce.quantityAvailable}</p>
        <p className={`text-xs font-semibold px-2 py-0.5 inline-block rounded-full mt-1 ${statusClasses[produce.status]}`}>
          {produce.status.replace('_', ' ').toUpperCase()}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
        <Button onClick={() => onEdit(produce.id)} variant="outline" size="sm" className="w-full sm:w-auto">Edit</Button>
        {produce.status === 'active' && 
            <Button onClick={() => onToggleStatus(produce.id, 'sold_out')} variant="secondary" size="sm" className="w-full sm:w-auto">Mark Sold Out</Button>}
        {produce.status === 'sold_out' && 
            <Button onClick={() => onToggleStatus(produce.id, 'active')} variant="primary" size="sm" className="w-full sm:w-auto">Relist</Button>}
        <Button onClick={() => onDelete(produce.id)} variant="danger" size="sm" className="w-full sm:w-auto">Delete</Button>
      </div>
    </div>
  );
};

export default ProduceListItem;
    