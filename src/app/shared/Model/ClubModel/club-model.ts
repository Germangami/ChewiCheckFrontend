export interface Trainer {
  name: string;
  experience: string;
  achievements: string[];
  photo?: string;
}

export interface Schedule {
  monday: string[];
  tuesday: string[];
  wednesday: string[];
  thursday: string[];
  friday: string[];
  saturday: string[];
  sunday: string[];
}

export interface Club {
  id: number;
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  description: string;
  mapUrl: string;
  photo?: string;
  trainers: Trainer[];
  schedule: Schedule;
  price: {
    single: string;
    monthly: string;
    yearly: string;
  };
  facilities: string[];
  rating: number;
  reviews: number;
} 