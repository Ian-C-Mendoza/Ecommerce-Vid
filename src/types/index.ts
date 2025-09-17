export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  features: string[];
  category: 'basic' | 'standard' | 'premium';
  thumbnail?: string;
}

export interface CartItem {
  service: Service;
  quantity: number;
  addons: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  rating: number;
  comment: string;
  avatar?: string;
  project: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  category: string;
  client: string;
  duration?: string;
  tags?: string[];
  completedDate?: Date;
  projectDetails?: {
    challenge: string;
    solution: string;
    results: string;
    technologies: string[];
  };
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  services: CartItem[];
  total: number;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: Date;
  deliveryDate: Date;
}