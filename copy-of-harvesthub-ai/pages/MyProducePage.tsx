
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Produce } from '../types';
import { getProduceForFarmer, deleteProduce, updateProduce } from '../services/produceService';
import ProduceListItem from '../components/ProduceListItem';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import { PlusCircleIcon, SproutIcon } from '../components/Icons';
import { ROUTES } from '../constants';

const MyProducePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [produceList, setProduceList] = useState<Produce[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | Produce['status']>('all');


  const fetchFarmerProduce = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getProduceForFarmer(user.id);
      setProduceList(data);
    } catch (err) {
      setError("Failed to fetch your produce listings. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchFarmerProduce();
  }, [fetchFarmerProduce]);

  const handleEdit = (produceId: string) => {
    navigate(`${ROUTES.EDIT_PRODUCE}/${produceId}`);
  };

  const handleDelete = async (produceId: string) => {
    if (window.confirm("Are you sure you want to delete this produce listing? This action cannot be undone.")) {
      setIsLoading(true);
      try {
        await deleteProduce(produceId);
        setProduceList(prev => prev.filter(p => p.id !== produceId));
         // Optionally show a success message
      } catch (err) {
        setError("Failed to delete produce. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const handleToggleStatus = async (produceId: string, newStatus: Produce['status']) => {
    setIsLoading(true);
    try {
        const updated = await updateProduce(produceId, { status: newStatus });
        if (updated) {
            setProduceList(prevList => prevList.map(p => p.id === produceId ? updated : p));
        }
    } catch (err) {
        setError(`Failed to update status for ${produceId}.`);
    } finally {
        setIsLoading(false);
    }
  };


  const filteredProduce = produceList
    .filter(p => filterStatus === 'all' || p.status === filterStatus)
    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.category.toLowerCase().includes(searchTerm.toLowerCase()));

  if (!user) {
    return <p>Please log in to manage your produce.</p>;
  }
  
  const statusOptions: {value: string, label: string}[] = [
    { value: 'all', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'draft', label: 'Draft' },
    { value: 'sold_out', label: 'Sold Out' },
    { value: 'expired', label: 'Expired' },
  ];


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-white shadow rounded-lg">
        <h1 className="text-3xl font-bold text-primary-dark">My Produce Listings</h1>
        <Button onClick={() => navigate(ROUTES.ADD_PRODUCE)} leftIcon={<PlusCircleIcon />}>
          Add New Produce
        </Button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      
      <div className="p-4 bg-white shadow rounded-lg">
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Search by name or category..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as Produce['status'] | 'all')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary bg-white"
          >
            {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
      </div>


      {isLoading && !produceList.length ? ( // Show spinner only if loading initial list
        <LoadingSpinner fullScreen message="Loading your produce..." />
      ) : filteredProduce.length > 0 ? (
        <div className="space-y-4">
          {filteredProduce.map(produce => (
            <ProduceListItem 
              key={produce.id} 
              produce={produce} 
              onEdit={handleEdit} 
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white shadow rounded-lg">
            <SproutIcon className="w-24 h-24 text-gray-300 mx-auto mb-6"/>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Produce Found</h2>
          <p className="text-gray-500 mb-6">
            {produceList.length === 0 ? "You haven't listed any produce yet. Let's get started!" : "No produce matches your current filters. Try adjusting your search."}
          </p>
          {produceList.length === 0 && (
            <Button onClick={() => navigate(ROUTES.ADD_PRODUCE)} leftIcon={<PlusCircleIcon />}>
                Add Your First Produce
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default MyProducePage;
    