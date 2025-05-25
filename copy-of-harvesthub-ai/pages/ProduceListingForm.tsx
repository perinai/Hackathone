
import React, { useState, useEffect, useCallback, ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Produce } from '../types';
import { addProduce, getProduceById, updateProduce } from '../services/produceService';
import { getMarketPriceSuggestion, generateProduceDescription } from '../services/geminiService';
import Input, { Textarea, Select } from '../components/Input';
import Button from '../components/Button';
import Alert from '../components/Alert';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import { AiTip } from '../components/Tooltip';
import { PRODUCE_CATEGORIES, PRODUCE_UNITS, ROUTES, DEFAULT_PRODUCE_IMAGE } from '../constants';
import { LightbulbIcon } from '../components/Icons';


const ProduceListingForm: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { produceId } = useParams<{ produceId?: string }>(); // For editing
  const isEditing = Boolean(produceId);

  const [formData, setFormData] = useState<Partial<Produce>>({
    name: '',
    category: PRODUCE_CATEGORIES[0],
    description: '',
    price: 0,
    unit: PRODUCE_UNITS[0],
    quantityAvailable: 1,
    availabilityDateFrom: new Date().toISOString().split('T')[0],
    availabilityDateTo: '',
    photos: [],
    location: user?.location || '', // Default to farm location
    tags: [],
    status: 'active',
  });
  const [tagInput, setTagInput] = useState('');
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [priceSuggestion, setPriceSuggestion] = useState<string | null>(null);
  const [isFetchingPriceSuggestion, setIsFetchingPriceSuggestion] = useState(false);
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);


  useEffect(() => {
    if (isEditing && produceId) {
      setIsFetchingDetails(true);
      getProduceById(produceId)
        .then(produce => {
          if (produce && produce.farmerId === user?.id) { // Ensure farmer owns this produce
            setFormData({
                ...produce,
                price: produce.price || 0, // ensure price is number
                quantityAvailable: produce.quantityAvailable || 0,
                availabilityDateFrom: produce.availabilityDateFrom ? new Date(produce.availabilityDateFrom).toISOString().split('T')[0] : '',
                availabilityDateTo: produce.availabilityDateTo ? new Date(produce.availabilityDateTo).toISOString().split('T')[0] : '',
                tags: produce.tags || [],
                photos: produce.photos || [],
            });
          } else {
            setError("Produce not found or you don't have permission to edit it.");
            navigate(ROUTES.MY_PRODUCE);
          }
        })
        .catch(() => setError("Failed to fetch produce details."))
        .finally(() => setIsFetchingDetails(false));
    } else if (user?.location) { // For new listings, set default location
        setFormData(prev => ({...prev, location: user.location}));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [produceId, isEditing, user?.id, navigate, user?.location]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }));
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim().toLowerCase())) {
      setFormData(prev => ({ ...prev, tags: [...(prev.tags || []), tagInput.trim().toLowerCase()] }));
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags?.filter(tag => tag !== tagToRemove) }));
  };

  const handlePhotoUrlInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoUrlInput(e.target.value);
  };

  const handleAddPhotoUrl = () => {
    if (photoUrlInput.trim() && !formData.photos?.includes(photoUrlInput.trim())) {
      // Basic URL validation (very simple)
      if (photoUrlInput.startsWith('http://') || photoUrlInput.startsWith('https://')) {
         setFormData(prev => ({ ...prev, photos: [...(prev.photos || []), photoUrlInput.trim()] }));
         setError(null);
      } else {
        setError("Please enter a valid photo URL (starting with http:// or https://).");
        return;
      }
    }
    setPhotoUrlInput('');
  };

  const handleRemovePhoto = (photoToRemove: string) => {
     setFormData(prev => ({ ...prev, photos: prev.photos?.filter(photo => photo !== photoToRemove) }));
  };


  const fetchPriceSuggestion = useCallback(async () => {
    if (!formData.name || !user?.location) return;
    setIsFetchingPriceSuggestion(true);
    setPriceSuggestion(null);
    try {
      const suggestion = await getMarketPriceSuggestion(formData.name, user.location, formData.price);
      if (suggestion) {
        setPriceSuggestion(suggestion.message);
      } else {
        setPriceSuggestion("Could not fetch AI price suggestion at this time.");
      }
    } catch (err) {
      setPriceSuggestion("Error fetching AI suggestion.");
    } finally {
      setIsFetchingPriceSuggestion(false);
    }
  }, [formData.name, formData.price, user?.location]);

  const handleGenerateDescription = async () => {
    if (!formData.name) {
        setError("Please enter a produce name to generate a description.");
        return;
    }
    setIsGeneratingDesc(true);
    setError(null);
    try {
        const desc = await generateProduceDescription(formData.name, formData.tags || []);
        if (desc) {
            setFormData(prev => ({ ...prev, description: desc }));
        } else {
            setError("Could not generate description. Please try again or write your own.");
        }
    } catch (err) {
        setError("Failed to generate AI description.");
    } finally {
        setIsGeneratingDesc(false);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError("You must be logged in to list produce.");
      return;
    }
    // Basic validation
    if (!formData.name || !formData.category || formData.price! <= 0 || formData.quantityAvailable! <= 0 || !formData.location) {
        setError("Please fill in all required fields: Name, Category, Price (>0), Quantity (>0), and Location.");
        return;
    }
    if ((formData.photos || []).length === 0) {
        if(!window.confirm("You haven't added any photos. Listings with photos attract more buyers. Continue without photos?")) {
            return;
        }
    }


    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const produceDataSubmit: Omit<Produce, 'id' | 'farmerName' | 'farmName' | 'views' | 'inquiries' | 'createdAt' | 'updatedAt'> = {
      farmerId: user.id,
      name: formData.name!,
      category: formData.category!,
      description: formData.description!,
      price: formData.price!,
      unit: formData.unit!,
      quantityAvailable: formData.quantityAvailable!,
      availabilityDateFrom: formData.availabilityDateFrom,
      availabilityDateTo: formData.availabilityDateTo,
      photos: formData.photos || [DEFAULT_PRODUCE_IMAGE], // Default image if none provided
      location: formData.location!,
      tags: formData.tags || [],
      status: formData.status || 'active',
    };

    try {
      let savedProduce;
      if (isEditing && produceId) {
        savedProduce = await updateProduce(produceId, produceDataSubmit);
      } else {
        savedProduce = await addProduce(produceDataSubmit, user);
      }

      if (savedProduce) {
        setSuccess(`Produce "${savedProduce.name}" ${isEditing ? 'updated' : 'listed'} successfully! Redirecting...`);
        setTimeout(() => navigate(ROUTES.MY_PRODUCE), 2000);
      } else {
        throw new Error("Failed to save produce.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to save produce. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isFetchingDetails) {
    return <LoadingSpinner fullScreen message="Loading produce details..."/>
  }

  return (
    <Card title={isEditing ? "Edit Produce Listing" : "Add New Produce Listing"}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <Alert type="error" message={error} onClose={() => setError(null)} className="mb-4" />}
        {success && <Alert type="success" message={success} className="mb-4" />}

        <Input label="Produce Name*" name="name" value={formData.name || ''} onChange={handleChange} required 
            onBlur={fetchPriceSuggestion} // Fetch suggestion when user leaves the field
        />
        
        <Select label="Category*" name="category" value={formData.category || ''} onChange={handleChange} required
          options={PRODUCE_CATEGORIES.map(cat => ({ value: cat, label: cat }))}
        />

        <div>
            <Textarea label="Description*" name="description" value={formData.description || ''} onChange={handleChange} required 
                placeholder="Grown with love, these sun-ripened tomatoes are bursting with flavor!"
            />
            <Button type="button" onClick={handleGenerateDescription} isLoading={isGeneratingDesc} size="sm" variant="ghost" className="mt-1 text-xs" leftIcon={<LightbulbIcon className="w-4 h-4"/>}>
                Generate with AI
            </Button>
            <AiTip tip="Share what makes your produce special! Buyers love to hear your story." className="ml-2" />
        </div>


        <div className="grid md:grid-cols-3 gap-4">
          {/* Fix: Pass min/step directly to Input component */}
          <Input label="Price (per unit)*" name="price" type="number" value={String(formData.price || '')} onChange={handleChange} required 
            min="0.01" step="0.01"
            onBlur={fetchPriceSuggestion}
            />
          <Select label="Unit*" name="unit" value={formData.unit || ''} onChange={handleChange} required 
             options={PRODUCE_UNITS.map(u => ({ value: u, label: u }))}
          />
          {/* Fix: Pass min/step directly to Input component */}
          <Input label="Quantity Available*" name="quantityAvailable" type="number" value={String(formData.quantityAvailable || '')} onChange={handleChange} required 
            min="1" step="1"
          />
        </div>
        {isFetchingPriceSuggestion && <p className="text-sm text-blue-500">Fetching AI price suggestion...</p>}
        {priceSuggestion && <Alert type="info" message={<><span className="font-semibold">AI Price Tip:</span> {priceSuggestion}</>} className="text-sm"/>}


        <div className="grid md:grid-cols-2 gap-4">
          <Input label="Available From (Date)" name="availabilityDateFrom" type="date" value={formData.availabilityDateFrom || ''} onChange={handleChange} />
          <Input label="Available Until (Date)" name="availabilityDateTo" type="date" value={formData.availabilityDateTo || ''} onChange={handleChange} />
        </div>
        
        <Input label="Pickup Location*" name="location" value={formData.location || ''} onChange={handleChange} required placeholder="e.g., Farm Stand, Willow Creek Farmers Market" />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tags/Keywords <AiTip tip="e.g., organic, heirloom, pesticide-free. AI can suggest based on description later."/></label>
          <div className="flex items-center gap-2 mb-2">
            <Input name="tagInput" value={tagInput} onChange={handleTagInputChange} placeholder="Add a tag" className="flex-grow mb-0" />
            <Button type="button" onClick={handleAddTag} variant="secondary" size="sm">Add Tag</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags?.map(tag => (
              <span key={tag} className="px-3 py-1 bg-primary-light text-primary-dark text-sm rounded-full flex items-center">
                {tag}
                <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-2 text-red-500 hover:text-red-700">&times;</button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Photo URLs <AiTip tip="Clear, bright photos attract more buyers! Try taking pictures in natural light."/></label>
           <div className="flex items-center gap-2 mb-2">
            <Input name="photoUrlInput" value={photoUrlInput} onChange={handlePhotoUrlInputChange} placeholder="https://example.com/image.jpg" className="flex-grow mb-0" />
            <Button type="button" onClick={handleAddPhotoUrl} variant="secondary" size="sm">Add Photo URL</Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-2">
            {(formData.photos || []).map(photoUrl => (
              <div key={photoUrl} className="relative group">
                <img src={photoUrl} alt="Produce preview" className="w-full h-24 object-cover rounded-md border"/>
                <button 
                  type="button" 
                  onClick={() => handleRemovePhoto(photoUrl)} 
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove photo"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
          {error && (formData.photos || []).length === 0 && <p className="text-xs text-red-500">{error.includes("photo URL") ? error : ""}</p>}
          {/* Actual file upload could be added here */}
          {/* <Input label="Or Upload Photos (Max 5)" name="photoUploads" type="file" multiple accept="image/*" /> */}
        </div>

        <Select label="Listing Status" name="status" value={formData.status || 'active'} onChange={handleChange}
            options={[
                {value: 'active', label: 'Active (Visible to Buyers)'},
                {value: 'draft', label: 'Draft (Save for later)'},
                {value: 'sold_out', label: 'Sold Out'},
            ]}
        />
        
        <div className="flex space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={() => navigate(ROUTES.MY_PRODUCE)}>Cancel</Button>
            <Button type="submit" isLoading={isLoading || isFetchingDetails} className="flex-grow">
            {isEditing ? "Update Listing" : "Save & List Produce"}
            </Button>
        </div>
        <p className="text-xs text-gray-500 mt-4 text-center">
            {isEditing ? "Remember to keep your listing details accurate and up-to-date!" : "Let's share your farm's goodness with the world!"}
        </p>
      </form>
    </Card>
  );
};

export default ProduceListingForm;