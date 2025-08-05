import { ServiceProvider, ServiceRequest } from '../types';

// Arabic names for service providers
const arabicNames = [
  'فاطمة أحمد',
  'محمد علي',
  'عائشة حسن',
  'أحمد محمود',
  'نور الدين',
  'خديجة محمد',
  'علي حسن',
  'مريم عبدالله',
  'يوسف أحمد',
  'زينب محمد',
  'عبدالله علي',
  'آمنة حسن'
];

// Arabic names for request posters
const arabicRequestNames = [
  'سارة محمد',
  'عمر خالد',
  'ليلى أحمد',
  'كريم محمود',
  'نورا علي',
  'أحمد حسن',
  'فاطمة عبدالله',
  'محمد يوسف',
  'عائشة زينب',
  'علي عبدالله',
  'خديجة آمنة',
  'يوسف نور'
];

// Arabic descriptions for services
const arabicDescriptions = [
  'خدمات تنظيف منزلية متخصصة لمنزل متألق ونظيف.',
  'دروس خصوصية في الرياضيات والعلوم لجميع الأعمار.',
  'التقاط لحظاتك الخاصة بالإبداع والأناقة.',
  'خدمات سباكة وكهرباء موثوقة لجميع احتياجات منزلك.',
  'تصميم وصيانة حدائق جميلة.',
  'تنظيف صديق للبيئة للمكاتب والمساحات التجارية.',
  'جلسات تعلم اللغات وممارسة المحادثة.',
  'خدمات التصوير الاحترافي للمناسبات والصور الشخصية.',
  'إنشاء مناسبات لا تُنسى من الفكرة إلى التنفيذ.',
  'مدرب شخصي معتمد يساعدك في تحقيق أهدافك الرياضية.',
  'خدمات رعاية الحيوانات الأليفة والمشي للحيوانات الأليفة.',
  'خدمات كهربائية وسباكة متخصصة لمنزلك.'
];

// Arabic titles for service requests
const arabicRequestTitles = [
  'أحتاج مساعدة في نقل الأثاث',
  'مطلوب مدرس خصوصي للرياضيات',
  'أبحث عن مصور لحفل زفافي',
  'أحتاج سباك لإصلاح تسرب المياه',
  'مطلوب منسق حدائق لمنزلي',
  'أحتاج تنظيف شامل للمكتب',
  'أبحث عن مدرس لغة إنجليزية',
  'مطلوب مصور لتصوير المنتجات',
  'أحتاج منظم لحفل عيد ميلاد',
  'مطلوب مدرب شخصي للتمارين',
  'أحتاج رعاية لقطتي أثناء السفر',
  'أبحث عن كهربائي لإصلاح عطل'
];

// Arabic descriptions for service requests
const arabicRequestDescriptions = [
  'أحتاج مساعدة في نقل الأثاث من شقة إلى أخرى في نفس الحي. الأثاث متوسط الحجم ويتضمن غرفة نوم كاملة وغرفة معيشة.',
  'ابني في الصف الثالث ويحتاج مساعدة في الرياضيات. أبحث عن مدرس صبور ومتفهم لمساعدته في تحسين مستواه.',
  'زفافي بعد شهر وأحتاج مصور محترف لالتقاط لحظات يومي الخاص. أريد صور طبيعية وأنيقة.',
  'هناك تسرب في الحمام وأحتاج سباك موثوق لإصلاحه بسرعة. المشكلة في أنابيب المياه.',
  'لدي حديقة صغيرة وأريد تنسيقها بشكل جميل. أبحث عن منسق حدائق ذو خبرة في التصميم.',
  'مكتبي يحتاج تنظيف شامل بعد تجديده. المساحة حوالي 200 متر مربع مع أثاث مكتبي.',
  'أريد تحسين لغتي الإنجليزية للعمل. أبحث عن مدرس يمكنه التركيز على المحادثة والكتابة.',
  'لدي متجر إلكتروني وأحتاج صور احترافية للمنتجات. حوالي 50 منتج تحتاج تصوير.',
  'عيد ميلاد ابنتي بعد أسبوعين وأريد حفلاً مميزاً. أبحث عن منظم محترف للفعاليات.',
  'أريد البدء في ممارسة الرياضة وأحتاج مدرب شخصي لمساعدتي في وضع خطة مناسبة.',
  'سأسافر لمدة أسبوع وأحتاج شخص موثوق لرعاية قطتي وإطعامها وتنظيف صندوق الرمل.',
  'هناك مشكلة في الكهرباء في المطبخ وأحتاج كهربائي لإصلاحها. المشكلة في المقابس الكهربائية.'
];

export const mockServiceProviders: ServiceProvider[] = [
  {
    id: '1',
    name: arabicNames[0],
    rating: 4.5,
    category: 'Cleaning',
    description: arabicDescriptions[0],
    location: 'New York, NY',
    startingPrice: 100,
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    isPremium: true,
    isTopRated: false,
    completedJobs: 25,
    isIdentityVerified: true,
    availability: {
      days: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday'],
      timeSlots: ['Morning', 'Afternoon']
    }
  },
  {
    id: '2',
    name: arabicNames[1],
    rating: 4.0,
    category: 'Tutoring',
    description: arabicDescriptions[1],
    location: 'Los Angeles, CA',
    startingPrice: 160,
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    isPremium: false,
    isTopRated: false,
    completedJobs: 15,
    isIdentityVerified: false,
    availability: {
      days: ['Friday', 'Saturday', 'Sunday'],
      timeSlots: ['Evening']
    }
  },
  {
    id: '3',
    name: arabicNames[2],
    rating: 5.0,
    category: 'Photography',
    description: arabicDescriptions[2],
    location: 'Chicago, IL',
    startingPrice: 300,
    imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    isPremium: true,
    isTopRated: true,
    completedJobs: 45,
    isIdentityVerified: true,
    availability: {
      days: ['Friday', 'Saturday', 'Sunday'],
      timeSlots: ['Morning', 'Afternoon', 'Evening']
    }
  },
  {
    id: '4',
    name: arabicNames[3],
    rating: 4.5,
    category: 'Home Repair',
    description: arabicDescriptions[3],
    location: 'New York, NY',
    startingPrice: 200,
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    isPremium: false,
    isTopRated: true,
    completedJobs: 38,
    isIdentityVerified: true,
    availability: {
      days: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
      timeSlots: ['Morning', 'Afternoon']
    }
  },
  {
    id: '5',
    name: arabicNames[4],
    rating: 5.0,
    category: 'Landscaping',
    description: arabicDescriptions[4],
    location: 'Austin, TX',
    startingPrice: 240,
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    isPremium: true,
    isTopRated: true,
    completedJobs: 52,
    isIdentityVerified: true,
    availability: {
      days: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday'],
      timeSlots: ['Morning', 'Afternoon']
    }
  },
  {
    id: '6',
    name: arabicNames[5],
    rating: 4.0,
    category: 'Cleaning',
    description: arabicDescriptions[5],
    location: 'San Francisco, CA',
    startingPrice: 140,
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    isPremium: false,
    isTopRated: false,
    completedJobs: 12,
    isIdentityVerified: false,
    availability: {
      days: ['Friday', 'Saturday', 'Sunday'],
      timeSlots: ['Morning']
    }
  },
  {
    id: '7',
    name: arabicNames[6],
    rating: 4.8,
    category: 'Tutoring',
    description: arabicDescriptions[6],
    location: 'Chicago, IL',
    startingPrice: 140,
    imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
    isPremium: true,
    isTopRated: true,
    completedJobs: 67,
    isIdentityVerified: true,
    availability: {
      days: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
      timeSlots: ['Afternoon', 'Evening']
    }
  },
  {
    id: '8',
    name: arabicNames[7],
    rating: 4.2,
    category: 'Photography',
    description: arabicDescriptions[7],
    location: 'Austin, TX',
    startingPrice: 320,
    imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
    isPremium: false,
    isTopRated: false,
    completedJobs: 18,
    isIdentityVerified: true,
    availability: {
      days: ['Friday', 'Saturday', 'Sunday'],
      timeSlots: ['Morning', 'Afternoon']
    }
  },
  {
    id: '9',
    name: arabicNames[8],
    rating: 4.7,
    category: 'Event Planning',
    description: arabicDescriptions[8],
    location: 'Los Angeles, CA',
    startingPrice: 480,
    imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    isPremium: true,
    isTopRated: true,
    completedJobs: 41,
    isIdentityVerified: true,
    availability: {
      days: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      timeSlots: ['Morning', 'Afternoon', 'Evening']
    }
  },
  {
    id: '10',
    name: arabicNames[9],
    rating: 4.9,
    category: 'Personal Training',
    description: arabicDescriptions[9],
    location: 'San Francisco, CA',
    startingPrice: 380,
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    isPremium: true,
    isTopRated: true,
    completedJobs: 89,
    isIdentityVerified: true,
    availability: {
      days: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
      timeSlots: ['Morning', 'Afternoon', 'Evening']
    }
  },
  {
    id: '11',
    name: arabicNames[10],
    rating: 3.8,
    category: 'Pet Care',
    description: arabicDescriptions[10],
    location: 'New York, NY',
    startingPrice: 80,
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    isPremium: false,
    isTopRated: false,
    completedJobs: 8,
    isIdentityVerified: false,
    availability: {
      days: ['Saturday', 'Sunday'],
      timeSlots: ['Morning', 'Afternoon']
    }
  },
  {
    id: '12',
    name: arabicNames[11],
    rating: 4.6,
    category: 'Home Repair',
    description: arabicDescriptions[11],
    location: 'Chicago, IL',
    startingPrice: 440,
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    isPremium: false,
    isTopRated: true,
    completedJobs: 34,
    isIdentityVerified: true,
    availability: {
      days: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday'],
      timeSlots: ['Morning', 'Afternoon']
    }
  }
];

export const mockServiceRequests: ServiceRequest[] = [
  {
    id: 'req-1',
    title: arabicRequestTitles[0],
    description: arabicRequestDescriptions[0],
    budget: { min: 200, max: 500, currency: 'EGP' },
    location: 'New York, NY',
    postedBy: {
      id: 'user-1',
      name: arabicRequestNames[0],
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      isPremium: true
    },
    createdAt: '2024-01-15T10:30:00Z',
    preferredDate: '2024-01-20',
    status: 'open',
    category: 'Home Repair',
    urgency: 'medium',
    availability: {
      days: ['Saturday', 'Sunday'],
      timeSlots: ['Morning', 'Afternoon']
    }
  },
  {
    id: 'req-2',
    title: arabicRequestTitles[1],
    description: arabicRequestDescriptions[1],
    budget: { min: 150, max: 300, currency: 'EGP' },
    location: 'Los Angeles, CA',
    postedBy: {
      id: 'user-2',
      name: arabicRequestNames[1],
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      isPremium: false
    },
    createdAt: '2024-01-14T14:20:00Z',
    preferredDate: '2024-01-18',
    status: 'open',
    category: 'Tutoring',
    urgency: 'high',
    availability: {
      days: ['Friday', 'Saturday', 'Sunday'],
      timeSlots: ['Afternoon', 'Evening']
    }
  },
  {
    id: 'req-3',
    title: arabicRequestTitles[2],
    description: arabicRequestDescriptions[2],
    budget: { min: 800, max: 2000, currency: 'EGP' },
    location: 'Chicago, IL',
    postedBy: {
      id: 'user-3',
      name: arabicRequestNames[2],
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      isPremium: true
    },
    createdAt: '2024-01-13T09:15:00Z',
    preferredDate: '2024-02-15',
    status: 'open',
    category: 'Photography',
    urgency: 'low',
    availability: {
      days: ['Friday', 'Saturday', 'Sunday'],
      timeSlots: ['Morning', 'Afternoon']
    }
  },
  {
    id: 'req-4',
    title: arabicRequestTitles[3],
    description: arabicRequestDescriptions[3],
    budget: { min: 300, max: 800, currency: 'EGP' },
    location: 'New York, NY',
    postedBy: {
      id: 'user-4',
      name: arabicRequestNames[3],
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      isPremium: false
    },
    createdAt: '2024-01-12T16:45:00Z',
    preferredDate: '2024-01-16',
    status: 'open',
    category: 'Home Repair',
    urgency: 'high',
    availability: {
      days: ['Saturday', 'Sunday', 'Monday'],
      timeSlots: ['Morning', 'Afternoon']
    }
  },
  {
    id: 'req-5',
    title: arabicRequestTitles[4],
    description: arabicRequestDescriptions[4],
    budget: { min: 400, max: 1200, currency: 'EGP' },
    location: 'Austin, TX',
    postedBy: {
      id: 'user-5',
      name: arabicRequestNames[4],
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      isPremium: true
    },
    createdAt: '2024-01-11T11:30:00Z',
    preferredDate: '2024-01-25',
    status: 'open',
    category: 'Landscaping',
    urgency: 'medium',
    availability: {
      days: ['Saturday', 'Sunday'],
      timeSlots: ['Morning', 'Afternoon']
    }
  },
  {
    id: 'req-6',
    title: arabicRequestTitles[5],
    description: arabicRequestDescriptions[5],
    budget: { min: 600, max: 1600, currency: 'EGP' },
    location: 'San Francisco, CA',
    postedBy: {
      id: 'user-6',
      name: arabicRequestNames[5],
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      isPremium: false
    },
    createdAt: '2024-01-10T13:20:00Z',
    preferredDate: '2024-01-17',
    status: 'open',
    category: 'Cleaning',
    urgency: 'medium',
    availability: {
      days: ['Saturday', 'Sunday', 'Monday'],
      timeSlots: ['Morning']
    }
  },
  {
    id: 'req-7',
    title: arabicRequestTitles[6],
    description: arabicRequestDescriptions[6],
    budget: { min: 100, max: 200, currency: 'EGP' },
    location: 'Chicago, IL',
    postedBy: {
      id: 'user-7',
      name: arabicRequestNames[6],
      avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
      isPremium: false
    },
    createdAt: '2024-01-09T15:10:00Z',
    preferredDate: '2024-01-22',
    status: 'open',
    category: 'Tutoring',
    urgency: 'low',
    availability: {
      days: ['Friday', 'Saturday', 'Sunday'],
      timeSlots: ['Evening']
    }
  },
  {
    id: 'req-8',
    title: arabicRequestTitles[7],
    description: arabicRequestDescriptions[7],
    budget: { min: 1200, max: 3200, currency: 'EGP' },
    location: 'Austin, TX',
    postedBy: {
      id: 'user-8',
      name: arabicRequestNames[7],
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
      isPremium: true
    },
    createdAt: '2024-01-08T10:45:00Z',
    preferredDate: '2024-01-30',
    status: 'open',
    category: 'Photography',
    urgency: 'medium',
    availability: {
      days: ['Saturday', 'Sunday'],
      timeSlots: ['Morning', 'Afternoon']
    }
  },
  {
    id: 'req-9',
    title: arabicRequestTitles[8],
    description: arabicRequestDescriptions[8],
    budget: { min: 800, max: 2400, currency: 'EGP' },
    location: 'Los Angeles, CA',
    postedBy: {
      id: 'user-9',
      name: arabicRequestNames[8],
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      isPremium: false
    },
    createdAt: '2024-01-07T12:30:00Z',
    preferredDate: '2024-02-10',
    status: 'open',
    category: 'Event Planning',
    urgency: 'medium',
    availability: {
      days: ['Friday', 'Saturday', 'Sunday'],
      timeSlots: ['Morning', 'Afternoon', 'Evening']
    }
  },
  {
    id: 'req-10',
    title: arabicRequestTitles[9],
    description: arabicRequestDescriptions[9],
    budget: { min: 240, max: 480, currency: 'EGP' },
    location: 'San Francisco, CA',
    postedBy: {
      id: 'user-10',
      name: arabicRequestNames[9],
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      isPremium: true
    },
    createdAt: '2024-01-06T14:15:00Z',
    preferredDate: '2024-01-19',
    status: 'open',
    category: 'Personal Training',
    urgency: 'high',
    availability: {
      days: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday'],
      timeSlots: ['Morning', 'Afternoon']
    }
  },
  {
    id: 'req-11',
    title: arabicRequestTitles[10],
    description: arabicRequestDescriptions[10],
    budget: { min: 120, max: 320, currency: 'EGP' },
    location: 'New York, NY',
    postedBy: {
      id: 'user-11',
      name: arabicRequestNames[10],
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
      isPremium: false
    },
    createdAt: '2024-01-05T09:45:00Z',
    preferredDate: '2024-01-28',
    status: 'open',
    category: 'Pet Care',
    urgency: 'low',
    availability: {
      days: ['Saturday', 'Sunday'],
      timeSlots: ['Morning', 'Afternoon']
    }
  },
  {
    id: 'req-12',
    title: arabicRequestTitles[11],
    description: arabicRequestDescriptions[11],
    budget: { min: 400, max: 1000, currency: 'EGP' },
    location: 'Chicago, IL',
    postedBy: {
      id: 'user-12',
      name: arabicRequestNames[11],
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      isPremium: true
    },
    createdAt: '2024-01-04T16:20:00Z',
    preferredDate: '2024-01-21',
    status: 'open',
    category: 'Home Repair',
    urgency: 'high',
    availability: {
      days: ['Saturday', 'Sunday', 'Monday'],
      timeSlots: ['Morning', 'Afternoon']
    }
  }
]; 