
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, UserRole } from '../types';
import { updateUserProfile } from '../services/userService';
import Input, { Textarea } from '../components/Input';
import Button from '../components/Button';
import Alert from '../components/Alert';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import { DEFAULT_USER_PROFILE_PIC } from '../constants';

const UserProfilePage: React.FC = () => {
  const { user, updateUserContext, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState<Partial<User>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email, // Typically email is not editable or handled separately
        location: user.location || '',
        profilePictureUrl: user.profilePictureUrl || DEFAULT_USER_PROFILE_PIC,
        // Role-specific fields
        farmName: user.role === UserRole.FARMER ? user.farmName || '' : undefined,
        farmDescription: user.role === UserRole.FARMER ? user.farmDescription || '' : undefined,
        farmStory: user.role === UserRole.FARMER ? user.farmStory || '' : undefined,
        businessName: user.role === UserRole.BUYER ? user.businessName || '' : undefined,
        businessType: user.role === UserRole.BUYER ? user.businessType || '' : undefined,
        // produceInterests: user.role === UserRole.BUYER ? user.produceInterests || [] : undefined, // TODO: Add UI for this
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError("User not found.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const updatedUser = await updateUserProfile(user.id, formData);
      if (updatedUser) {
        updateUserContext(updatedUser); // Update context
        setSuccess("Profile updated successfully!");
      } else {
        throw new Error("Failed to update profile.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || !user) {
    return <LoadingSpinner fullScreen message="Loading your profile..." />;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card title="My Profile & Settings">
        {error && <Alert type="error" message={error} onClose={() => setError(null)} className="mb-4" />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} className="mb-4" />}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center space-y-4 mb-6">
            <img 
                src={formData.profilePictureUrl || DEFAULT_USER_PROFILE_PIC} 
                alt="Profile" 
                className="w-32 h-32 rounded-full object-cover shadow-md"
            />
            <Input 
                label="Profile Picture URL" 
                name="profilePictureUrl" 
                value={formData.profilePictureUrl || ''} 
                onChange={handleChange} 
                placeholder="https://example.com/your-photo.jpg"
            />
          </div>

          <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Account Information</h3>
          <Input label="Full Name" name="name" value={formData.name || ''} onChange={handleChange} required />
          <Input label="Email Address" name="email" type="email" value={formData.email || ''} onChange={handleChange} disabled required 
            inputClassName="bg-gray-100 cursor-not-allowed"
          />
          <Input label="Location (e.g., City, State or Zip Code)" name="location" value={formData.location || ''} onChange={handleChange} />

          {/* Password change section - conceptual */}
          {/* 
          <div>
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mt-6">Change Password</h3>
            <Input label="Current Password" name="currentPassword" type="password" />
            <Input label="New Password" name="newPassword" type="password" />
            <Input label="Confirm New Password" name="confirmNewPassword" type="password" />
            <Button type="button" variant="outline" size="sm" className="mt-2">Update Password</Button>
          </div>
          */}

          {user.role === UserRole.FARMER && (
            <>
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mt-6">Farm Details</h3>
              <Input label="Farm Name" name="farmName" value={formData.farmName || ''} onChange={handleChange} />
              <Textarea label="Public Farm Description (short)" name="farmDescription" value={formData.farmDescription || ''} onChange={handleChange} placeholder="e.g., Specializing in organic berries and greens." rows={2} />
              <Textarea label="Farm Story / Philosophy (longer, for your profile page)" name="farmStory" value={formData.farmStory || ''} onChange={handleChange} placeholder="Share your farm's journey and values..." rows={5} />
            </>
          )}

          {user.role === UserRole.BUYER && (
            <>
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mt-6">Business Details</h3>
              <Input label="Business Name" name="businessName" value={formData.businessName || ''} onChange={handleChange} />
              <Input label="Business Type" name="businessType" value={formData.businessType || ''} onChange={handleChange} placeholder="e.g., Restaurant, Grocery, Co-op, Individual"/>
              {/* TODO: UI for produceInterests (e.g., multi-select or tags input) */}
            </>
          )}
          
          {/* Notification Preferences - conceptual */}
          {/*
          <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mt-6">Notification Preferences</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input type="checkbox" className="form-checkbox h-5 w-5 text-primary rounded" defaultChecked />
              <span className="ml-2 text-gray-700">Email me about new messages</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="form-checkbox h-5 w-5 text-primary rounded" defaultChecked />
              <span className="ml-2 text-gray-700">Notify me of market price alerts (Farmers)</span>
            </label>
             <label className="flex items-center">
              <input type="checkbox" className="form-checkbox h-5 w-5 text-primary rounded" />
              <span className="ml-2 text-gray-700">In-app notifications for new produce from followed farmers (Buyers)</span>
            </label>
          </div>
          */}

          <div className="pt-4">
            <Button type="submit" isLoading={isLoading} fullWidth size="lg">
              Save Changes
            </Button>
          </div>
        </form>
      </Card>

      {/* Privacy Settings - conceptual */}
      {/*
      <Card title="Privacy Settings">
        <p className="text-gray-600">Manage how your information is shared on HarvestHub AI.</p>
        {/* Add privacy options here *}
      </Card>
      */}
    </div>
  );
};

export default UserProfilePage;
    