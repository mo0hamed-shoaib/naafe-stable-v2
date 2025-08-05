import { 
  Wrench, 
  CheckSquare, 
  Book, 
  Dumbbell, 
  Calendar, 
  Heart, 
  Scissors, 
  Camera 
} from 'lucide-react';
import { ServiceCategory } from '../types';

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'home-repair',
    name: 'إصلاح المنزل',
    serviceCount: 120,
    startingPrice: 50,
    icon: Wrench,
    dateAdded: '2024-01-15',
  },
  {
    id: 'cleaning',
    name: 'خدمات التنظيف',
    serviceCount: 150,
    startingPrice: 30,
    icon: CheckSquare,
    dateAdded: '2024-01-10',
  },
  {
    id: 'tutoring',
    name: 'الدراسة',
    serviceCount: 80,
    startingPrice: 25,
    icon: Book,
    dateAdded: '2024-02-01',
  },
  {
    id: 'personal-training',
    name: 'التدريب الشخصي',
    serviceCount: 60,
    startingPrice: 40,
    icon: Dumbbell,
    dateAdded: '2024-02-15',
  },
  {
    id: 'event-planning',
    name: 'تخطيط الفعاليات',
    serviceCount: 45,
    startingPrice: 60,
    icon: Calendar,
    dateAdded: '2024-03-01',
  },
  {
    id: 'pet-care',
    name: 'رعاية الحيوانات الأليفة',
    serviceCount: 75,
    startingPrice: 20,
    icon: Heart,
    dateAdded: '2024-03-10',
  },
  {
    id: 'landscaping',
    name: 'تنسيق الحدائق',
    serviceCount: 90,
    startingPrice: 35,
    icon: Scissors,
    dateAdded: '2024-01-20',
  },
  {
    id: 'photography',
    name: 'التصوير',
    serviceCount: 55,
    startingPrice: 75,
    icon: Camera,
    dateAdded: '2024-02-20',
  },
];

export const sortOptions = [
  { value: 'recommended', label: 'الاختيارات الذكية (موصى به)' },
  { value: 'most-popular', label: 'الأكثر شعبية' },
  { value: 'price-low', label: 'أقل سعر بداية' },
  { value: 'price-high', label: 'أعلى سعر بداية' },
  { value: 'alphabetical', label: 'ترتيب أبجدي (أ-ي)' },
  { value: 'recently-added', label: 'المضاف حديثاً' },
];