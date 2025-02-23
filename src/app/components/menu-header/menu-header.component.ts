import { Component, HostListener, AfterViewInit, ElementRef, ViewChild, inject } from '@angular/core';
import { RouterLinkActive, RouterModule, RouterLink, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/authentication.service';

@Component({
  selector: 'app-menu-header',
  standalone: true,
  imports: [
    RouterModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './menu-header.component.html',
  styleUrl: './menu-header.component.css'
})
export class MenuHeaderComponent implements AfterViewInit  {
  emailContact = "rsfrancisco.applications@gmail.com";

  @ViewChild('mobileNavToggleBtn') mobileNavToggleBtn!: ElementRef;

  // private mobileNavToggleBtn!: HTMLElement | null;
  private authService = inject(AuthenticationService);
  private router = inject(Router);

  isLogged = this.authService.isLoggedIn();

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    // this.mobileNavToggleBtn = this.el.nativeElement.querySelector('.mobile-nav-toggle');
    // if (this.mobileNavToggleBtn) {
    //   this.mobileNavToggleBtn.addEventListener('click', () => this.toggleMobileNav());
    // }
    // Verifica se o botão foi encontrado antes de prosseguir
    if (!this.mobileNavToggleBtn) {
      console.error('Botão do menu mobile não encontrado!');
    }
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    const body = document.body;
    const header = document.querySelector('#header');
    if (!header) return;
    if (window.scrollY > 100) {
      body.classList.add('scrolled');
    } else {
      body.classList.remove('scrolled');
    }
  }

  toggleMobileNav(): void {
    const body = document.body;

    if (body) {
      body.classList.toggle('mobile-nav-active');

      if (this.mobileNavToggleBtn) {
        const btn = this.mobileNavToggleBtn.nativeElement;
        btn.classList.toggle('bi-list');
        btn.classList.toggle('bi-x');
      }
    }
    // document.body.classList.toggle('mobile-nav-active');
    // if (this.mobileNavToggleBtn) {
    //   this.mobileNavToggleBtn.classList.toggle('bi-list');
    //   this.mobileNavToggleBtn.classList.toggle('bi-x');
    // }
  }

  closeMobileNavOnLinkClick(): void {
    if (document.body.classList.contains('mobile-nav-active')) {
      this.toggleMobileNav();
    }
  }

  toggleDropdown(event: Event): void {
    // event.preventDefault();
    // const target = event.currentTarget as HTMLElement;
    // target.parentElement?.classList.toggle('active');
    // target.parentElement?.nextElementSibling?.classList.toggle('dropdown-active');
    // event.stopImmediatePropagation();
    event.preventDefault();
    event.stopImmediatePropagation();

    const target = event.target as HTMLElement;
    const parentLi = target.closest('li');

    if (parentLi) {
      parentLi.classList.toggle('active');

      const submenu = parentLi.querySelector('ul');
      if (submenu) {
        submenu.classList.toggle('dropdown-active');
      }
    }
  }



  onLogout(): void {
    this.authService.logout();
    window.location.href = '/inicio';
  }
}
