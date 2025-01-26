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

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, ToolbarComponent, NgxParticlesModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'ChewiCheck';
  tg: any;
  tgId: number;

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

  constructor(private store: Store, private readonly ngParticlesService: NgParticlesService) {

  }

  ngOnInit(): void {
    this.initTelegramWebApp();
    this.ngParticlesService.init(async (engine: Engine) => {
      await loadSlim(engine);
    });
  }

  particlesLoaded(container: any): void {
    console.log(container);
}

  initTelegramWebApp() {
    if (window.Telegram.WebApp) {
      console.log(window.Telegram.WebApp, 'CHECK TELEGRAM')
      this.tg = window.Telegram.WebApp;
      this.tgId = window.Telegram.WebApp?.initDataUnsafe?.user?.id;
      window.Telegram.WebApp.ready();
    } else {
      return;
    }
  }
}
