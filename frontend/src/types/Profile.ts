export interface ProfileData {
  id: string;
  name: string;
  title: string;
  location: string;
  rating: number;
  reviewCount: number;
  avatar: string;
  isVerified: boolean;
  phone?: string;
  email?: string;
  bio: string;
  services: Service[];
  reviews: Review[];
  portfolio: PortfolioItem[];
  testimonials: Testimonial[];
}

export interface Service {
  id: string;
  title: string;
  description: string;
  image: string;
  category: 'residential' | 'commercial' | 'all';
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface PortfolioItem {
  id: string;
  image: string;
  title?: string;
}

export interface Testimonial {
  id: string;
  author: string;
  comment: string;
  image: string;
}

export interface EditableFields {
  phone: string;
  email: string;
  location: string;
  bio: string;
} 