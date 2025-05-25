
import { Produce, User } from '../types';
import { mockProduce, mockUsers } from './mockData';

// Simulate API delay
const delay = <T,>(ms: number, data: T): Promise<T> => 
  new Promise(resolve => setTimeout(() => resolve(data), ms));

export const getProduceForFarmer = async (farmerId: string): Promise<Produce[]> => {
  const produce = mockProduce.filter(p => p.farmerId === farmerId);
  return delay(500, produce);
};

export const getAllProduce = async (filters?: { category?: string; location?: string; query?: string }): Promise<Produce[]> => {
  let filteredProduce = [...mockProduce.filter(p => p.status === 'active')]; // Start with a copy

  if (filters) {
    if (filters.category) {
      filteredProduce = filteredProduce.filter(p => p.category.toLowerCase() === filters.category?.toLowerCase());
    }
    if (filters.location) {
      // Simple location matching for mock data
      filteredProduce = filteredProduce.filter(p => p.location.toLowerCase().includes(filters.location!.toLowerCase()));
    }
    if (filters.query) {
      const queryLower = filters.query.toLowerCase();
      filteredProduce = filteredProduce.filter(p => 
        p.name.toLowerCase().includes(queryLower) ||
        p.description.toLowerCase().includes(queryLower) ||
        p.tags.some(tag => tag.toLowerCase().includes(queryLower)) ||
        p.farmName?.toLowerCase().includes(queryLower)
      );
    }
  }
  return delay(700, filteredProduce);
};

export const getProduceById = async (produceId: string): Promise<Produce | undefined> => {
  const produce = mockProduce.find(p => p.id === produceId);
  return delay(300, produce);
};

export const addProduce = async (produceData: Omit<Produce, 'id' | 'farmerName' | 'farmName' | 'views' | 'inquiries' | 'createdAt' | 'updatedAt'>, farmer: User): Promise<Produce> => {
  const newProduce: Produce = {
    ...produceData,
    id: `prod-${Date.now()}`,
    farmerName: farmer.name,
    farmName: farmer.farmName,
    views: 0,
    inquiries: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  mockProduce.unshift(newProduce); // Add to the beginning of the array
  return delay(600, newProduce);
};

export const updateProduce = async (produceId: string, updates: Partial<Produce>): Promise<Produce | undefined> => {
  const index = mockProduce.findIndex(p => p.id === produceId);
  if (index !== -1) {
    mockProduce[index] = { ...mockProduce[index], ...updates, updatedAt: new Date() };
    return delay(400, mockProduce[index]);
  }
  return delay(400, undefined);
};

export const deleteProduce = async (produceId: string): Promise<boolean> => {
  const index = mockProduce.findIndex(p => p.id === produceId);
  if (index !== -1) {
    mockProduce.splice(index, 1);
    return delay(500, true);
  }
  return delay(500, false);
};
    