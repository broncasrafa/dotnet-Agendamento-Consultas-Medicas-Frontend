import { OnInit, AfterViewInit, Component, ElementRef, Renderer2, ViewChild, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import * as AOS from 'aos';
import { MenuHeaderComponent } from 'src/app/components/menu-header/menu-header.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { LoadingService } from 'src/app/shared/services/loading.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MenuHeaderComponent,
    FooterComponent
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit, AfterViewInit {

  // @ViewChild('preloader') preloader!: ElementRef;

  isLoading$: Observable<boolean>;

  constructor(
    //private renderer: Renderer2,
    private loadingService: LoadingService,
    private cdr: ChangeDetectorRef) {
      this.isLoading$ = this.loadingService.isLoading$;
    }


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
    // ⚠️ IMPORTANTE: Forçar detecção de mudanças após a inicialização da view
    setTimeout(() => this.cdr.detectChanges());

    // if (this.preloader) {
    //   this.renderer.removeChild(document.body, this.preloader.nativeElement);
    // }
  }

}
