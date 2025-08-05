import dotenv from 'dotenv';

dotenv.config();

const aiConfig = {
  // OpenRouter Configuration
  openRouter: {
    apiKey: process.env.OPENROUTER_API_KEY,
    baseUrl: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
    model: process.env.OPENROUTER_MODEL || 'deepseek/deepseek-r1-0528:free',
    maxTokens: 2048,
    temperature: 0.7,
  },
  
  // AI Service Flags
  services: {
    enabled: process.env.AI_SERVICE_ENABLED !== 'false', // Enabled by default unless explicitly disabled
    formAssistance: process.env.AI_FORM_ASSISTANCE !== 'false', // Enabled by default unless explicitly disabled
    pricingGuidance: process.env.AI_PRICING_GUIDANCE !== 'false', // Enabled by default unless explicitly disabled
  },
  
  // Form Assistance Configuration
  formAssistance: {
    maxSuggestions: 3,
    languages: ['ar', 'en'], // Arabic and English
    categories: {
      'Plumbing': 'سباكة',
      'Electrical': 'كهرباء',
      'Cleaning': 'تنظيف',
      'Gardening': 'بستنة',
      'Home Repair': 'إصلاح منزلي',
      'Beauty Services': 'خدمات التجميل',
      'Photography': 'التصوير',
      'Tutoring': 'الدراسة الخصوصية',
      'Technology Support': 'الدعم التقني',
      'Food & Catering': 'الطعام والضيافة'
    }
  },
  
  // Pricing Guidance Configuration
  pricingGuidance: {
    confidenceThreshold: 0.7,
    marketDataSources: ['similar_services', 'category_averages', 'location_factors'],
    priceRanges: {
      'Plumbing': { min: 200, max: 2000, avg: 800 },
      'Electrical': { min: 300, max: 2500, avg: 1000 },
      'Cleaning': { min: 150, max: 800, avg: 400 },
      'Gardening': { min: 200, max: 1500, avg: 600 },
      'Home Repair': { min: 250, max: 3000, avg: 1200 },
      'Beauty Services': { min: 100, max: 500, avg: 250 },
      'Photography': { min: 500, max: 3000, avg: 1500 },
      'Tutoring': { min: 100, max: 300, avg: 200 },
      'Technology Support': { min: 200, max: 1000, avg: 500 },
      'Food & Catering': { min: 300, max: 2000, avg: 800 }
    }
  },
  
  // API Configuration
  api: {
    timeout: 30000, // 30 seconds
    retries: 2,
    rateLimit: {
      requestsPerMinute: 30,
      requestsPerHour: 500,
    },
  },
  
  // Validation
  validate: () => {
    if (!aiConfig.openRouter.apiKey) {
      throw new Error('OPENROUTER_API_KEY is required in environment variables');
    }
    return true;
  },
};

export default aiConfig; 