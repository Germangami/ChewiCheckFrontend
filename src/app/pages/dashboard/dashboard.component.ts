import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { ApiService } from '../../shared/services/api.service';
import { Client } from '../../shared/Model/ClientModel/client-model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';

interface Trainer {
  name: string;
  experience: string;
  achievements: string[];
  photo?: string;
}

interface Schedule {
  monday: string[];
  tuesday: string[];
  wednesday: string[];
  thursday: string[];
  friday: string[];
  saturday: string[];
  sunday: string[];
}

interface Club {
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
  rating?: number;
  reviews?: number;
  placeId?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    MatListModule,
    MatChipsModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  tgId: number;
  currentClient: Client;
  mail = `chwalibogboxing@gmail.com`;

  clubs: Club[] = [
    {
      id: 1,
      name: "Chwalibog Boxing Club",
      address: "ul. Sportowa 123",
      city: "Warsaw",
      phone: "+48 123 456 789",
      email: "info@chwalibogboxing.com",
      description: "Professional boxing club with experienced trainers and modern equipment. Perfect for both beginners and advanced boxers.",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2443.9714130722027!2d20.942570376735027!3d52.22573717198549!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471ecb0d884fe4e1%3A0x53bc23387facfec1!2sKlub%20bokserski%20Chwali%20B%C3%B3g%20Boxing!5e0!3m2!1sru!2spl!4v1737287910087!5m2!1sru!2spl",
      trainers: [
        {
          name: "John Smith",
          experience: "15 years of professional boxing experience",
          achievements: ["National Champion", "European Championship Bronze", "Olympic Team Member"]
        },
        {
          name: "Maria Kowalski",
          experience: "10 years of coaching experience",
          achievements: ["WBC Certified Trainer", "Youth Championship Gold"]
        }
      ],
      schedule: {
        monday: ["Dzieci(5-10lat)-16:00", "Grupa początkująca-17:00", "Grupa zaawansowana-20:30"],
        tuesday: ["Kobiety-18:00", "Grupa mix-21:00"],
        wednesday: ["Dzieci(5-10lat)-16:00", "Grupa początkująca-17:00", "Grupa zaawansowana-20:30"],
        thursday: ["Kobiety-18:00", "Grupa mix-21:00"],
        friday: ["Dzieci(5-10lat)-16:00", "Grupa mix-17:00", "Grupa mix-20:30"],
        saturday: [],
        sunday: []
      },
      price: {
        single: "50 PLN",
        monthly: "400 PLN",
        yearly: "4000 PLN"
      },
      facilities: ["Professional Ring", "Weight Room", "Shower", "Locker Room", "Parking"]
    },
    {
      id: 2,
      name: "Elite Boxing Academy",
      address: "ul. Champions 45",
      city: "Krakow",
      phone: "+48 987 654 321",
      email: "contact@eliteboxing.pl",
      description: "Modern boxing academy with focus on professional development and competition preparation.",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2561.1234567890123!2d19.944544!3d50.064650!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTDCsDAzJzUyLjciTiAxOcKwNTYnNDAuNCJF!5e0!3m2!1sen!2spl!4v1234567890123!5m2!1sen!2spl",
      trainers: [
        {
          name: "Piotr Nowak",
          experience: "20 years of professional boxing experience",
          achievements: ["World Championship Silver", "European Champion", "Olympic Games Participant"]
        }
      ],
      schedule: {
        monday: ["Junior Group(8-12)-15:00", "Beginners-17:30", "Pro Group-19:00"],
        tuesday: ["Women's Boxing-16:00", "Advanced-18:30", "Sparring-20:00"],
        wednesday: ["Junior Group(8-12)-15:00", "Beginners-17:30", "Pro Group-19:00"],
        thursday: ["Women's Boxing-16:00", "Advanced-18:30", "Sparring-20:00"],
        friday: ["Junior Group(8-12)-15:00", "Open Training-17:00", "Competition Prep-19:00"],
        saturday: ["Open Gym-10:00"],
        sunday: []
      },
      price: {
        single: "60 PLN",
        monthly: "450 PLN",
        yearly: "4500 PLN"
      },
      facilities: ["Competition Ring", "Fitness Area", "Sauna", "Cafeteria", "Underground Parking"],
      rating: 4.9,
      reviews: 98
    },
    {
      id: 3,
      name: "Boxing Pro Center",
      address: "ul. Boxing 78",
      city: "Gdansk",
      phone: "+48 456 789 123",
      email: "info@boxingpro.pl",
      description: "Family-friendly boxing center with programs for all ages and skill levels.",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2324.1234567890123!2d18.646638!3d54.352025!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTTCsDIxJzA3LjMiTiAxOMKwMzgnNDcuOSJF!5e0!3m2!1sen!2spl!4v1234567890123!5m2!1sen!2spl",
      trainers: [
        {
          name: "Anna Zielinska",
          experience: "12 years of coaching experience",
          achievements: ["National Youth Coach", "Regional Championship Gold"]
        },
        {
          name: "Tomasz Kowalczyk",
          experience: "8 years of professional experience",
          achievements: ["National Championship Bronze"]
        }
      ],
      schedule: {
        monday: ["Kids Boxing(6-10)-15:30", "Teen Group(11-16)-17:00", "Adult Beginners-19:00"],
        tuesday: ["Morning Training-07:00", "Women's Class-18:00", "Mixed Level-20:00"],
        wednesday: ["Kids Boxing(6-10)-15:30", "Teen Group(11-16)-17:00", "Adult Advanced-19:00"],
        thursday: ["Morning Training-07:00", "Women's Class-18:00", "Mixed Level-20:00"],
        friday: ["Kids Boxing(6-10)-15:30", "Family Class-17:00", "Open Training-19:00"],
        saturday: ["Weekend Warriors-11:00"],
        sunday: []
      },
      price: {
        single: "45 PLN",
        monthly: "350 PLN",
        yearly: "3500 PLN"
      },
      facilities: ["Training Ring", "Kids Area", "Cafeteria", "Free Parking", "Changing Rooms"],
      rating: 4.7,
      reviews: 203
    }
  ];

  constructor(
    private router: Router,
    private apiService: ApiService,
  ) {}

  ngOnInit(): void {
    if (window.Telegram.WebApp) {
      this.tgId = window.Telegram.WebApp?.initDataUnsafe?.user?.id;
    }
  }

  getScheduleForDay(club: Club, day: string): string[] {
    const dayKey = day.toLowerCase() as keyof Schedule;
    return club.schedule[dayKey];
  }

  getRatingStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  openGoogleReviews(placeId: string) {
    if (placeId) {
      window.open(`https://www.google.com/maps/place/?q=place_id:${placeId}`, '_blank');
    }
  }
}
