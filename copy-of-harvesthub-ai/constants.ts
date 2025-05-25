
export const ROUTES = {
  LANDING: '/',
  REGISTER: '/register',
  LOGIN: '/login',
  ABOUT_US: '/about',
  HELP: '/help-faq',
  
  FARMER_DASHBOARD: '/farmer/dashboard',
  MY_PRODUCE: '/farmer/my-produce',
  ADD_PRODUCE: '/farmer/produce/add',
  EDIT_PRODUCE: '/farmer/produce/edit', // expects /:produceId
  FARMER_MARKET_INSIGHTS: '/farmer/market-insights',
  FARMER_CONNECTIONS: '/farmer/connections',

  BUYER_DASHBOARD: '/buyer/dashboard',
  MARKETPLACE: '/marketplace', // Buyer's main search/browse
  PRODUCE_DETAIL: '/produce', // expects /:produceId
  FARMER_PROFILE: '/farmer', // expects /:farmerId (public view)
  BUYER_CONNECTIONS: '/buyer/connections',
  
  PROFILE: '/profile',
  NOTIFICATIONS: '/notifications',
  MESSAGES: '/messages', // expects /:conversationId?
};

export const PRODUCE_CATEGORIES: string[] = [
  "Vegetable", "Fruit", "Herb", "Dairy", "Eggs", "Bakery", "Meat", "Flowers", "Other"
];

export const PRODUCE_UNITS: string[] = [
  "kg", "lb", "piece", "bunch", "dozen", "liter", "gallon", "jar", "box", "crate"
];

export const DEFAULT_USER_PROFILE_PIC = 'https://picsum.photos/seed/defaultuser/200/200';
export const DEFAULT_PRODUCE_IMAGE = 'https://picsum.photos/seed/defaultproduce/400/300';
export const DEFAULT_FARM_IMAGE = 'https://picsum.photos/seed/defaultfarm/600/400';

export const GEMINI_TEXT_MODEL = 'gemini-2.5-flash-preview-04-17';
export const GEMINI_IMAGE_MODEL = 'imagen-3.0-generate-002';

    