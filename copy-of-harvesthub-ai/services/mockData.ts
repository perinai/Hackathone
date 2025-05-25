
import { User, UserRole, Produce, FarmProfile, Notification, Conversation, Message, MarketTrend } from '../types';
import { DEFAULT_USER_PROFILE_PIC, DEFAULT_FARM_IMAGE } from '../constants';

export const mockUsers: User[] = [
  {
    id: 'farmer1',
    name: 'Alice GreenThumb',
    email: 'alice@sunnyfarm.com',
    role: UserRole.FARMER,
    location: 'Willow Creek, CA',
    farmName: 'Sunny Meadows Farm',
    farmDescription: 'Family-owned farm specializing in organic vegetables and free-range eggs. We believe in sustainable agriculture and bringing the freshest produce to our community.',
    profilePictureUrl: 'https://picsum.photos/seed/alice/200/200',
    farmStory: 'Sunny Meadows Farm has been in our family for three generations. We started with a small vegetable patch and a dream to provide healthy, locally-grown food. Today, we continue that tradition, using sustainable practices to cultivate a wide variety of seasonal produce. We love connecting with our customers and sharing the bounty of our land!',
    createdAt: new Date('2023-01-15T09:00:00Z')
  },
  {
    id: 'farmer2',
    name: 'Bob Orchard',
    email: 'bob@orchardfresh.com',
    role: UserRole.FARMER,
    location: 'Green Valley, OR',
    farmName: 'Orchard Fresh Fruits',
    farmDescription: 'Juicy apples, pears, and berries straight from our trees and bushes. We use integrated pest management and focus on flavor.',
    profilePictureUrl: 'https://picsum.photos/seed/bob/200/200',
    farmStory: 'For over 20 years, Orchard Fresh Fruits has been dedicated to growing the most delicious and high-quality fruits in Green Valley. Our secret? Lots of sunshine, careful tending, and a deep respect for nature. We pick our fruits at peak ripeness so you can enjoy them at their best.',
    createdAt: new Date('2023-03-20T10:30:00Z')
  },
  {
    id: 'buyer1',
    name: 'Charlie Chef',
    email: 'charlie@thecornercafe.com',
    role: UserRole.BUYER,
    location: 'Downtown, Willow Creek, CA',
    businessName: 'The Corner Cafe',
    businessType: 'Restaurant',
    produceInterests: ['Organic Vegetables', 'Seasonal Fruits', 'Fresh Herbs'],
    profilePictureUrl: 'https://picsum.photos/seed/charlie/200/200',
    createdAt: new Date('2023-02-10T14:00:00Z')
  },
  {
    id: 'buyer2',
    name: 'Diana Grocer',
    email: 'diana@localpantry.com',
    role: UserRole.BUYER,
    location: 'Uptown, Green Valley, OR',
    businessName: 'The Local Pantry',
    businessType: 'Grocery Store',
    produceInterests: ['Root Vegetables', 'Apples', 'Berries', 'Artisan Bread'],
    profilePictureUrl: 'https://picsum.photos/seed/diana/200/200',
    createdAt: new Date('2023-04-05T11:15:00Z')
  },
];

export const mockProduce: Produce[] = [
  {
    id: 'prod1',
    farmerId: 'farmer1',
    farmerName: 'Alice GreenThumb',
    farmName: 'Sunny Meadows Farm',
    name: 'Organic Heirloom Tomatoes',
    category: 'Vegetable',
    description: 'Sun-ripened, bursting with flavor, grown with no pesticides. Perfect for salads, sauces, or just eating with a sprinkle of salt!',
    price: 4.50,
    unit: 'lb',
    quantityAvailable: 50,
    harvestDate: new Date('2024-07-20T00:00:00Z').toISOString(),
    availabilityDateFrom: new Date('2024-07-20T00:00:00Z').toISOString(),
    availabilityDateTo: new Date('2024-08-15T00:00:00Z').toISOString(),
    photos: ['https://picsum.photos/seed/tomatoes1/400/300', 'https://picsum.photos/seed/tomatoes2/400/300'],
    location: 'Sunny Meadows Farm Stall, Willow Creek',
    tags: ['organic', 'heirloom', 'fresh', 'local'],
    status: 'active',
    views: 120,
    inquiries: 5,
    createdAt: new Date('2024-07-18T10:00:00Z'),
    updatedAt: new Date('2024-07-19T11:00:00Z'),
  },
  {
    id: 'prod2',
    farmerId: 'farmer1',
    farmerName: 'Alice GreenThumb',
    farmName: 'Sunny Meadows Farm',
    name: 'Farm Fresh Eggs',
    category: 'Eggs',
    description: 'Delicious and nutritious eggs from our happy, free-range chickens. Variety of beautiful shell colors.',
    price: 6.00,
    unit: 'dozen',
    quantityAvailable: 20,
    availabilityDateFrom: new Date('2024-07-01T00:00:00Z').toISOString(), // available weekly
    photos: ['https://picsum.photos/seed/eggs1/400/300'],
    location: 'Sunny Meadows Farm Stall, Willow Creek',
    tags: ['free-range', 'fresh', 'local', 'nutritious'],
    status: 'active',
    views: 85,
    inquiries: 3,
    createdAt: new Date('2024-07-01T08:00:00Z'),
    updatedAt: new Date('2024-07-15T09:00:00Z'),
  },
  {
    id: 'prod3',
    farmerId: 'farmer2',
    farmerName: 'Bob Orchard',
    farmName: 'Orchard Fresh Fruits',
    name: 'Crisp Honeycrisp Apples',
    category: 'Fruit',
    description: 'Sweet, tangy, and incredibly crisp Honeycrisp apples, perfect for snacking or baking. Picked at peak ripeness.',
    price: 3.00,
    unit: 'lb',
    quantityAvailable: 100,
    harvestDate: new Date('2024-09-01T00:00:00Z').toISOString(),
    availabilityDateFrom: new Date('2024-09-01T00:00:00Z').toISOString(),
    availabilityDateTo: new Date('2024-10-31T00:00:00Z').toISOString(),
    photos: ['https://picsum.photos/seed/apples1/400/300', 'https://picsum.photos/seed/apples2/400/300'],
    location: 'Orchard Fresh Fruits Stand, Green Valley',
    tags: ['fresh', 'local', 'seasonal', 'crisp'],
    status: 'active',
    views: 210,
    inquiries: 12,
    createdAt: new Date('2024-08-28T14:00:00Z'),
    updatedAt: new Date('2024-08-29T10:00:00Z'),
  },
   {
    id: 'prod4',
    farmerId: 'farmer2',
    farmerName: 'Bob Orchard',
    farmName: 'Orchard Fresh Fruits',
    name: 'Aromatic Genovese Basil',
    category: 'Herb',
    description: 'Freshly picked Genovese basil with a wonderfully fragrant aroma. Ideal for pesto, caprese salads, or garnishing your favorite Italian dishes.',
    price: 2.50,
    unit: 'bunch',
    quantityAvailable: 30,
    harvestDate: new Date().toISOString(), // Available now
    availabilityDateFrom: new Date().toISOString(),
    photos: ['https://picsum.photos/seed/basil1/400/300'],
    location: 'Orchard Fresh Fruits Stand, Green Valley',
    tags: ['fresh', 'local', 'herb', 'aromatic', 'genovese'],
    status: 'active',
    views: 75,
    inquiries: 2,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  },
];

export const mockFarmProfiles: FarmProfile[] = mockUsers
  .filter(user => user.role === UserRole.FARMER)
  .map(farmer => {
    const farmerActiveProduce = mockProduce.filter(p => p.farmerId === farmer.id && p.status === 'active');
    return {
      farmerId: farmer.id,
      farmName: farmer.farmName!,
      farmerName: farmer.name,
      profilePictureUrl: farmer.profilePictureUrl || DEFAULT_USER_PROFILE_PIC,
      farmStory: farmer.farmStory || "A passionate local farmer dedicated to quality and community.",
      location: farmer.location!,
      practices: farmer.farmDescription?.toLowerCase().includes('organic') ? ['Organic', 'Sustainable'] : ['Sustainable'],
      memberSince: farmer.createdAt,
      currentListings: farmerActiveProduce,
      // Fix: Populate primaryProduce based on categories of active listings
      primaryProduce: Array.from(new Set(farmerActiveProduce.map(p => p.category))),
    };
  });


export const mockNotifications: Notification[] = [
  {
    id: 'notif1',
    userId: 'farmer1',
    type: 'welcome',
    title: 'Welcome to HarvestHub AI!',
    message: 'We\'re thrilled to have Sunny Meadows Farm join our community. Start by listing your amazing produce!',
    link: '/farmer/produce/add',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: false,
  },
  {
    id: 'notif2',
    userId: 'farmer1',
    type: 'price_alert',
    title: '📈 Market Alert for Organic Tomatoes!',
    message: 'Local prices for Organic Tomatoes have increased by 8% due to high demand. Great time to highlight your listing!',
    link: '/farmer/my-produce',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    read: false,
  },
  {
    id: 'notif3',
    userId: 'farmer1',
    type: 'buyer_match',
    title: '✨ Potential Buyer Match!',
    message: '\'The Local Pantry\' in Downtown, Willow Creek is actively searching for \'Organic Tomatoes\'. They often buy in bulk.',
    link: '/farmer/connections', // Or a specific match page
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    read: true,
  },
  {
    id: 'notif4',
    userId: 'buyer1',
    type: 'new_message',
    title: '💬 Reply from Sunny Meadows Farm',
    message: 'Alice from Sunny Meadows Farm replied to your inquiry about Organic Heirloom Tomatoes.',
    link: '/messages/convo1', // Example conversation ID
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    read: false,
  },
   {
    id: 'notif5',
    userId: 'farmer1',
    type: 'listing_update',
    title: '🎉 Your Tomatoes are Shining!',
    message: 'Your "Organic Heirloom Tomatoes" listing got 10 new views today!',
    link: `/produce/prod1`,
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 mins ago
    read: false,
  },
];


export const mockConversations: Conversation[] = [
  {
    id: 'convo1',
    participantIds: ['farmer1', 'buyer1'],
    participantNames: { 'farmer1': 'Alice GreenThumb', 'buyer1': 'Charlie Chef' },
    produceId: 'prod1',
    produceName: 'Organic Heirloom Tomatoes',
    lastMessage: {
      id: 'msg2',
      conversationId: 'convo1',
      senderId: 'farmer1',
      receiverId: 'buyer1',
      text: 'Yes, Charlie! We have a fresh batch ready. How many pounds are you looking for?',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      read: false, // For buyer1
    },
    unreadCount: 1, // For buyer1
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
  {
    id: 'convo2',
    participantIds: ['farmer2', 'buyer1'],
    participantNames: { 'farmer2': 'Bob Orchard', 'buyer1': 'Charlie Chef' },
    produceId: 'prod4',
    produceName: 'Aromatic Genovese Basil',
    lastMessage: {
      id: 'msg3',
      conversationId: 'convo2',
      senderId: 'buyer1',
      receiverId: 'farmer2',
      text: 'Hi Bob, I\'m interested in your Fresh Basil listing. Could I inquire about availability for 2kg weekly?',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      read: true, // For farmer2
    },
    unreadCount: 0, // For buyer1
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
  }
];

export const mockMessages: Message[] = [
  {
    id: 'msg1',
    conversationId: 'convo1',
    senderId: 'buyer1',
    receiverId: 'farmer1',
    text: 'Hi Alice, I saw your listing for Organic Heirloom Tomatoes. Are they available for pickup this week?',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: true,
  },
  mockConversations[0].lastMessage!,
  mockConversations[1].lastMessage!,
];

export const mockMarketTrends: MarketTrend[] = [
  {
    produceCategory: 'Organic Leafy Greens',
    trend: 'up',
    insight: 'High buyer interest for organic leafy greens this week in Willow Creek.',
    period: 'Last 7 Days',
    percentageChange: 12,
  },
  {
    produceCategory: 'Berries',
    trend: 'stable',
    insight: 'Demand for berries remains steady. Consider highlighting unique varieties.',
    period: 'Last 7 Days',
  },
  {
    produceCategory: 'Root Vegetables',
    trend: 'down',
    insight: 'Slight dip in demand for root vegetables as summer produce comes into season.',
    period: 'Last 7 Days',
    percentageChange: -5,
  }
];
