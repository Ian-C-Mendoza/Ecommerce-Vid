import { Service, Testimonial, PortfolioItem, Order } from '../types';

export const services: Service[] = [
  {
    id: '1',
    title: 'Basic Edit',
    description: 'Essential video editing with cuts, transitions, and basic color correction',
    price: 49,
    duration: '2-3 days',
    category: 'basic',
    features: [
      'Up to 5 minutes final video',
      'Basic cuts and transitions',
      'Color correction',
      '1 revision included',
      'HD 1080p export'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1625961332635-3d18bbad67fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMGVkaXRpbmclMjB3b3Jrc3BhY2UlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzU3MTY4Mzc1fDA&ixlib=rb-4.1.0&q=80&w=400'
  },
  {
    id: '2',
    title: 'Standard Edit',
    description: 'Professional editing with advanced effects and motion graphics',
    price: 149,
    duration: '5-7 days',
    category: 'standard',
    features: [
      'Up to 15 minutes final video',
      'Advanced transitions and effects',
      'Color grading and correction',
      'Basic motion graphics',
      'Background music sync',
      '3 revisions included',
      '4K export available'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1552680324-aee2ea34b336?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjBkZXNrdG9wJTIwY29tcHV0ZXJ8ZW58MXx8fHwxNzU3MjU3NjE1fDA&ixlib=rb-4.1.0&q=80&w=400'
  },
  {
    id: '3',
    title: 'Premium Edit',
    description: 'Complete cinematic production with custom animations and effects',
    price: 299,
    duration: '10-14 days',
    category: 'premium',
    features: [
      'Up to 30 minutes final video',
      'Cinematic color grading',
      'Custom motion graphics',
      'Advanced visual effects',
      'Professional audio mixing',
      'Custom animations',
      'Unlimited revisions',
      '4K/8K export',
      'Rush delivery available'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1616444523823-b7ff9d7214ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB2aWRlbyUyMGNhbWVyYSUyMGVxdWlwbWVudHxlbnwxfHx8fDE3NTcyNTc2MTV8MA&ixlib=rb-4.1.0&q=80&w=400'
  }
];

export const addons = [
  { name: 'Subtitles/Captions', price: 25 },
  { name: 'Custom Intro/Outro', price: 50 },
  { name: 'Background Music License', price: 30 },
  { name: 'Rush Delivery (24h)', price: 100 },
  { name: 'Additional Revision', price: 20 },
  { name: 'Social Media Versions', price: 35 }
];

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    rating: 5,
    comment: 'Absolutely amazing work! The team transformed our raw footage into a stunning promotional video that exceeded our expectations.',
    project: 'Corporate Promotional Video'
  },
  {
    id: '2',
    name: 'Michael Chen',
    rating: 5,
    comment: 'Professional, timely, and creative. They understood our vision perfectly and delivered exactly what we needed for our product launch.',
    project: 'Product Launch Video'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    rating: 4,
    comment: 'Great communication throughout the process. The final wedding video was beautiful and captured all the special moments perfectly.',
    project: 'Wedding Highlight Reel'
  },
  {
    id: '4',
    name: 'David Thompson',
    rating: 5,
    comment: 'The YouTube series they edited for us saw a 300% increase in engagement. Highly recommend their services!',
    project: 'YouTube Series'
  }
];

export const portfolioItems: PortfolioItem[] = [
  {
    id: '1',
    title: 'Tech Startup Launch',
    description: 'A dynamic promotional video showcasing innovative SaaS platform features with custom animations and motion graphics',
    thumbnail: 'https://images.unsplash.com/photo-1576085898323-218337e3e43c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBtZWV0aW5nJTIwcHJlc2VudGF0aW9ufGVufDF8fHx8MTc1NzI1OTAzNHww&ixlib=rb-4.1.0&q=80&w=400',
    videoUrl: '#',
    category: 'Corporate',
    client: 'TechFlow Inc.'
  },
  {
    id: '2',
    title: 'Restaurant Brand Story',
    description: 'Cinematic storytelling highlighting farm-to-table dining experience with professional color grading',
    thumbnail: 'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwY29sbGFib3JhdGlvbiUyMG1lZXRpbmd8ZW58MXx8fHwxNzU3MTkzNTY0fDA&ixlib=rb-4.1.0&q=80&w=400',
    videoUrl: '#',
    category: 'Commercial',
    client: 'Harvest Table'
  },
  {
    id: '3',
    title: 'Film Festival Trailer',
    description: 'Dramatic trailer with cinematic color grading and professional sound design',
    thumbnail: 'https://images.unsplash.com/photo-1669622309967-e7245a3322f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5lbWF0aWMlMjBmaWxtJTIwcHJvZHVjdGlvbnxlbnwxfHx8fDE3NTcyNDMxNTN8MA&ixlib=rb-4.1.0&q=80&w=400',
    videoUrl: '#',
    category: 'Entertainment',
    client: 'Independent Film'
  },
  {
    id: '4',
    title: 'Educational Course Intro',
    description: 'Engaging animated introduction for online learning platform with custom graphics',
    thumbnail: 'https://images.unsplash.com/photo-1625961332635-3d18bbad67fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMGVkaXRpbmclMjB3b3Jrc3BhY2UlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzU3MTY4Mzc1fDA&ixlib=rb-4.1.0&q=80&w=400',
    videoUrl: '#',
    category: 'Educational',
    client: 'LearnFast Academy'
  },
  {
    id: '5',
    title: 'Luxury Real Estate Tour',
    description: 'Premium property showcase with drone footage and smooth cinematic transitions',
    thumbnail: 'https://images.unsplash.com/photo-1654175789354-0ac285596363?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWFsJTIwZXN0YXRlJTIwbHV4dXJ5JTIwaG9tZXxlbnwxfHx8fDE3NTcyNTkwMzV8MA&ixlib=rb-4.1.0&q=80&w=400',
    videoUrl: '#',
    category: 'Real Estate',
    client: 'Luxury Properties Co.'
  },
  {
    id: '6',
    title: 'Wedding Highlight Reel',
    description: 'Romantic storytelling capturing the most precious moments with emotional narrative',
    thumbnail: 'https://images.unsplash.com/photo-1631225893179-4d6e349189c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwY2VyZW1vbnklMjBjb3VwbGV8ZW58MXx8fHwxNzU3MjU5MDM1fDA&ixlib=rb-4.1.0&q=80&w=400',
    videoUrl: '#',
    category: 'Personal',
    client: 'Private Client'
  },
  {
    id: '7',
    title: 'Product Launch Campaign',
    description: 'Dynamic product showcase with professional studio lighting and visual effects',
    thumbnail: 'https://images.unsplash.com/photo-1682078234868-412ec5566118?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9kdWN0JTIwcGhvdG9ncmFwaHklMjBzdHVkaW98ZW58MXx8fHwxNzU3MjQ0MTg5fDA&ixlib=rb-4.1.0&q=80&w=400',
    videoUrl: '#',
    category: 'Commercial',
    client: 'Innovation Labs'
  },
  {
    id: '8',
    title: 'Corporate Training Series',
    description: 'Professional training videos with clear instruction flow and engaging visuals',
    thumbnail: 'https://images.unsplash.com/photo-1552680324-aee2ea34b336?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjBkZXNrdG9wJTIwY29tcHV0ZXJ8ZW58MXx8fHwxNzU3MjU3NjE1fDA&ixlib=rb-4.1.0&q=80&w=400',
    videoUrl: '#',
    category: 'Corporate',
    client: 'Global Corp'
  },
  {
    id: '9',
    title: 'Music Video Production',
    description: 'Creative music video with artistic color palette and rhythm-based editing',
    thumbnail: 'https://images.unsplash.com/photo-1616444523823-b7ff9d7214ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB2aWRlbyUyMGNhbWVyYSUyMGVxdWlwbWVudHxlbnwxfHx8fDE3NTcyNTc2MTV8MA&ixlib=rb-4.1.0&q=80&w=400',
    videoUrl: '#',
    category: 'Entertainment',
    client: 'Rising Artist'
  }
];

export const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    customerName: 'John Smith',
    email: 'john@example.com',
    services: [
      {
        service: services[1],
        quantity: 1,
        addons: ['Subtitles/Captions', 'Social Media Versions']
      }
    ],
    total: 209,
    status: 'in-progress',
    createdAt: new Date('2024-01-15'),
    deliveryDate: new Date('2024-01-22')
  },
  {
    id: 'ORD-002',
    customerName: 'Lisa Chen',
    email: 'lisa@example.com',
    services: [
      {
        service: services[2],
        quantity: 1,
        addons: ['Rush Delivery (24h)', 'Custom Intro/Outro']
      }
    ],
    total: 449,
    status: 'completed',
    createdAt: new Date('2024-01-10'),
    deliveryDate: new Date('2024-01-11')
  },
  {
    id: 'ORD-003',
    customerName: 'Michael Johnson',
    email: 'michael@company.com',
    services: [
      {
        service: services[0],
        quantity: 2,
        addons: ['Additional Revision']
      }
    ],
    total: 118,
    status: 'pending',
    createdAt: new Date('2024-01-18'),
    deliveryDate: new Date('2024-01-21')
  },
  {
    id: 'ORD-004',
    customerName: 'Sarah Wilson',
    email: 'sarah@startup.io',
    services: [
      {
        service: services[1],
        quantity: 1,
        addons: ['Custom Intro/Outro', 'Background Music License']
      }
    ],
    total: 229,
    status: 'completed',
    createdAt: new Date('2024-01-12'),
    deliveryDate: new Date('2024-01-19')
  },
  {
    id: 'ORD-005',
    customerName: 'David Brown',
    email: 'david@agency.com',
    services: [
      {
        service: services[2],
        quantity: 1,
        addons: ['Rush Delivery (24h)', 'Social Media Versions', 'Additional Revision']
      }
    ],
    total: 454,
    status: 'in-progress',
    createdAt: new Date('2024-01-16'),
    deliveryDate: new Date('2024-01-17')
  },
  {
    id: 'ORD-006',
    customerName: 'Emily Davis',
    email: 'emily@nonprofit.org',
    services: [
      {
        service: services[0],
        quantity: 1,
        addons: ['Subtitles/Captions']
      }
    ],
    total: 74,
    status: 'cancelled',
    createdAt: new Date('2024-01-14'),
    deliveryDate: new Date('2024-01-17')
  }
];

export const revenueData = [
  { month: 'Jan', revenue: 2400, orders: 12 },
  { month: 'Feb', revenue: 3200, orders: 18 },
  { month: 'Mar', revenue: 2800, orders: 15 },
  { month: 'Apr', revenue: 4100, orders: 22 },
  { month: 'May', revenue: 3600, orders: 19 },
  { month: 'Jun', revenue: 4800, orders: 28 }
];

export const customerData = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    totalOrders: 3,
    totalSpent: 627,
    lastOrder: new Date('2024-01-15'),
    status: 'active'
  },
  {
    id: '2',
    name: 'Lisa Chen',
    email: 'lisa@example.com',
    totalOrders: 5,
    totalSpent: 1245,
    lastOrder: new Date('2024-01-10'),
    status: 'active'
  },
  {
    id: '3',
    name: 'Michael Johnson',
    email: 'michael@company.com',
    totalOrders: 2,
    totalSpent: 298,
    lastOrder: new Date('2024-01-18'),
    status: 'new'
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah@startup.io',
    totalOrders: 4,
    totalSpent: 896,
    lastOrder: new Date('2024-01-12'),
    status: 'active'
  },
  {
    id: '5',
    name: 'David Brown',
    email: 'david@agency.com',
    totalOrders: 1,
    totalSpent: 454,
    lastOrder: new Date('2024-01-16'),
    status: 'new'
  }
];