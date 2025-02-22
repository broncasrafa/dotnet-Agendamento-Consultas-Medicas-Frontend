import { OnInit, AfterViewInit, Component, ElementRef, Renderer2, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import * as AOS from 'aos';
import { MenuHeaderComponent } from '../menu-header/menu-header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    MenuHeaderComponent,
    FooterComponent
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit, AfterViewInit {

  @ViewChild('preloader') preloader!: ElementRef;

  constructor(private renderer: Renderer2) {}


  ngOnInit(): void {

    AOS.init({
      duration: 600, // duração em milissegundos
      easing: 'ease-in-out', // tipo de easing
      once: true, // animação só ocorre uma vez
      mirror: false
  });
    window.addEventListener('load', AOS.refresh);
  }

  ngAfterViewInit(): void {
    if (this.preloader) {
      this.renderer.removeChild(document.body, this.preloader.nativeElement);
    }
  }

}
