
import { User, FarmProfile } from '../types';
import { mockUsers, mockFarmProfiles, mockProduce } from './mockData';

// Simulate API delay
const delay = <T,>(ms: number, data: T): Promise<T> => 
  new Promise(resolve => setTimeout(() => resolve(data), ms));

export const getUserById = async (userId: string): Promise<User | undefined> => {
  const user = mockUsers.find(u => u.id === userId);
  return delay(300, user);
};

export const updateUserProfile = async (userId: string, updates: Partial<User>): Promise<User | undefined> => {
  const index = mockUsers.findIndex(u => u.id === userId);
  if (index !== -1) {
    mockUsers[index] = { ...mockUsers[index], ...updates };
    // If farmName or farmStory is updated, also update the corresponding FarmProfile
    if (mockUsers[index].role === 'farmer') {
        const farmProfileIndex = mockFarmProfiles.findIndex(fp => fp.farmerId === userId);
        if (farmProfileIndex !== -1) {
            if(updates.farmName) mockFarmProfiles[farmProfileIndex].farmName = updates.farmName;
            if(updates.farmStory) mockFarmProfiles[farmProfileIndex].farmStory = updates.farmStory;
            if(updates.profilePictureUrl) mockFarmProfiles[farmProfileIndex].profilePictureUrl = updates.profilePictureUrl;
        }
    }
    return delay(400, mockUsers[index]);
  }
  return delay(400, undefined);
};

export const getFarmProfileByFarmerId = async (farmerId: string): Promise<FarmProfile | undefined> => {
  let profile = mockFarmProfiles.find(fp => fp.farmerId === farmerId);
  if (profile) {
    // Ensure currentListings are up-to-date
    profile = {
        ...profile,
        currentListings: mockProduce.filter(p => p.farmerId === farmerId && p.status === 'active')
    }
  }
  return delay(500, profile);
};

// Example function to get farmer recommendations for a buyer (mocked)
export const getFarmerRecommendationsForBuyer = async (buyerId: string): Promise<FarmProfile[]> => {
    // Mock logic: recommend farmers not already connected, or based on buyer interests
    // For now, just return a couple of farmers
    const buyer = mockUsers.find(u => u.id === buyerId);
    if (!buyer) return delay(300, []);

    // Simple: return first 2 farmers that are not the buyer themselves (if a farmer is also a buyer)
    const recommendations = mockFarmProfiles.slice(0, 2);
    return delay(600, recommendations);
};
    