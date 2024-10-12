import {Component, HostListener, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'angular-pwa';

  public promptEvent!: any;

  @HostListener('window:beforeinstallprompt', ['$event'])
  onbeforeinstallprompt(e: any) {
    e.preventDefault();
    this.promptEvent = e;
  }

  public installPWA() {
    this.promptEvent.prompt();
  }

  public shouldInstall(): boolean {
    return !this.isRunningStandalone() && this.promptEvent;
  }

  public isRunningStandalone(): boolean {
    return (window.matchMedia('(display-mode: standalone)').matches);
  }

  ngOnInit() {
    window.addEventListener('load', async () => {
      if (location.search.includes('share-target')) {
        const keys = await caches.keys();
        const sharedCache = await caches.open(
            keys.filter((key) => key.startsWith('share-target'))[0]
        );
        const image = await sharedCache.match('shared-image');

        if (image) {
          const blob = await image.blob();
          await sharedCache.delete('shared-image');

          const blobUrl = URL.createObjectURL(blob);

          const img = document.createElement('img');

          img.src = blobUrl;

          img.width = 300;
          img.height = 200;

          document.body.appendChild(img);
        }
      }
    });
  }
}
