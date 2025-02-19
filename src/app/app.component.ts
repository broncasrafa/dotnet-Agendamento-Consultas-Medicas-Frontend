import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import * as AOS from 'aos';
import { MenuHeaderComponent } from './components/menu-header/menu-header.component';
import { FooterComponent } from './components/footer/footer.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MenuHeaderComponent,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  title = 'frontend';

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngOnInit(): void {

    if (isPlatformBrowser(this.platformId)) {
      AOS.init({
        duration: 600, // duração em milissegundos
        easing: 'ease-in-out', // tipo de easing
        once: true, // animação só ocorre uma vez
        mirror: false
    });
      window.addEventListener('load', AOS.refresh);
    }



  }
}
