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
      console.log('fetch', 'load happens', location.search);

      if (location.search.includes('share-target')) {
        const keys = await caches.keys();
        const sharedCache = await caches.open(keys.filter(key => key.startsWith('share-target'))[0]);
        const formData = await sharedCache.match('shared-data');
        alert(formData);
      }
    });
  }
}
