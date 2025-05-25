
export enum UserRole {
  FARMER = 'farmer',
  BUYER = 'buyer',
  NONE = 'none',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  location?: string;
  farmName?: string;
  businessName?: string;
  businessType?: string;
  farmDescription?: string;
  produceInterests?: string[];
  profilePictureUrl?: string;
  farmStory?: string;
  createdAt: Date;
}

export interface Produce {
  id: string;
  farmerId: string;
  farmerName?: string; // Denormalized for easier display
  farmName?: string; // Denormalized
  name: string;
  category: string;
  description: string;
  price: number;
  unit: string;
  quantityAvailable: number;
  harvestDate?: string;
  availabilityDateFrom?: string;
  availabilityDateTo?: string;
  photos: string[];
  location: string;
  tags: string[];
  status: 'active' | 'sold_out' | 'expired' | 'draft';
  views?: number;
  inquiries?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: Date;
  read: boolean;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  participantNames: { [userId: string]: string };
  lastMessage?: Message; // Optional, might not exist for new conversations
  produceId?: string;
  produceName?: string; // Denormalized
  unreadCount?: number; // For current user
  updatedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'price_alert' | 'buyer_match' | 'new_message' | 'listing_update' | 'system_tip' | 'welcome';
  title: string;
  message: string;
  link?: string;
  timestamp: Date;
  read: boolean;
  icon?: React.ReactNode; // e.g. <PriceAlertIcon />
}

// For Gemini Service
export interface PriceSuggestion {
  minPrice: number;
  maxPrice: number;
  currency: string;
  message: string; // e.g. "Similar organic heirloom tomatoes in Your Region are currently listed between $X.XX - $Y.YY per kg."
}

export interface BuyerMatch {
  buyerId: string;
  buyerName: string;
  buyerType: string; // e.g., Restaurant, Market
  location: string;
  lookingFor: string; // Produce type
  quantityRange?: string;
  message?: string; // e.g., "Actively searching for..."
  profileLink?: string;
}

export interface FarmerRecommendation {
  farmerId: string;
  farmerName: string;
  farmName?: string;
  primaryProduce: string[];
  location: string;
  reason: string;
  profileLink?: string;
}

export interface MarketTrend {
  produceCategory: string;
  trend: 'up' | 'down' | 'stable';
  percentageChange?: number;
  insight: string; // e.g. "High buyer interest for organic leafy greens this week in [Your Region]"
  period: string; // e.g. "last 7 days"
}

export interface FarmProfile {
  farmerId: string;
  farmName: string;
  farmerName: string;
  profilePictureUrl?: string;
  farmStory: string;
  location: string; // General area
  practices?: string[]; // e.g., Organic, Sustainable
  memberSince: Date;
  // reviews?: Review[]; // Future feature
  currentListings?: Produce[];
  // Fix: Add primaryProduce to FarmProfile
  primaryProduce?: string[]; 
}

export interface ProduceCategory {
  id: string;
  name: string;
  icon?: React.ReactNode;
}
