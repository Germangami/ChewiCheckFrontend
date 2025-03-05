import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngxs/store';
import { ToolbarComponent } from "./shared/toolbar/toolbar.component";

import { 
  MoveDirection,
  OutMode,
  Engine,
} from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";
import { NgParticlesService } from "@tsparticles/angular";
import { NgxParticlesModule } from "@tsparticles/angular";
import { AuthService } from './shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { delay } from 'rxjs';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, ToolbarComponent, NgxParticlesModule, CommonModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'ChewiCheck';
  tg: any;
  tgId: number; // Явно задаем ID тренера

  id = "tsparticles";
  particlesUrl = "http://foo.bar/particles.json";

  particlesOptions = {
    background: {
      color: {
        value: 'var(--tg-theme-bg-color)',
      },
    },
    fpsLimit: 120,
    interactivity: {
      events: {
        onClick: {
          enable: true,
          mode: [],
        },
        onHover: {
          enable: true,
          mode: [],
        },
        resize: {
          enable: true,
        },
      },
      modes: {
        push: {
          quantity: 4,
        },
        repulse: {
          distance: 200,
          duration: 0.4,
        },
      },
    },
    particles: {
      color: {
        value: '#d3d3d3',
      },
      links: {
        color: '#d3d3d3',
        distance: 200,
        enable: true,
        opacity: 0.5,
        width: 1,
      },
      move: {
        direction: MoveDirection.none,
        enable: true,
        outModes: {
          default: OutMode.bounce,
        },
        random: false,
        speed: 2.5,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: 160,
      },
      opacity: {
        value: 0.2,
      },
      shape: {
        type: 'circle',
      },
      size: {
        value: { min: 1, max: 5 },
      },
    },
    detectRetina: true,
  };

  constructor(private store: Store, 
    private readonly ngParticlesService: NgParticlesService, 
    public authService: AuthService) {
  }

  ngOnInit(): void {
    this.initTelegramWebApp();
    this.ngParticlesService.init(async (engine: Engine) => {
      await loadSlim(engine);
    });
    
    // Принудительно запускаем проверку роли с ID тренера
    console.log('ЯВНО ВЫЗЫВАЕМ ПРОВЕРКУ РОЛИ С ID ТРЕНЕРА:', this.tgId);
    this.authService.checkUserRole(this.tgId);
    
    // Проверяем роль через 3 секунды после инициализации
    setTimeout(() => {
      console.log('ПРОВЕРКА РОЛИ ЧЕРЕЗ 3 СЕКУНДЫ:');
      console.log('userRole:', this.authService.userRole);
      console.log('isTrainer:', this.authService.isTrainer());
      console.log('currentTrainer:', this.authService.currentTrainer);
      console.log('currentClient:', this.authService.currentClient);
    }, 3000);
  }

  particlesLoaded(container: any): void {
  }

  initTelegramWebApp() {
    if (window.Telegram.WebApp) {
      this.tg = window.Telegram.WebApp;
      
      // Не перезаписываем tgId, используем заданный выше
      this.tgId = window.Telegram.WebApp?.initDataUnsafe?.user?.id;
      
      console.log('Используем тестовый ID тренера:', this.tgId);
      window.Telegram.WebApp.ready();
    } else {
      console.log('Telegram WebApp недоступен, используем тестовый ID');
    }
  }
}
