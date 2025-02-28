import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { ScriptLoaderUtil } from 'src/app/core/utils/script-loader.util';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [
    RouterModule
  ],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css'
})
export class NotFoundComponent implements OnInit {
  private router = inject(Router);



  ngOnInit() {
    ScriptLoaderUtil.loadScript('https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.9.6/lottie.min.js')
      .then(() => {
        const animation = (window as any).lottie.loadAnimation({
          container: document.querySelector('.lottie-animation'),
          renderer: 'svg',
          loop: true,
          autoplay: true,
          path: 'https://lottie.host/d987597c-7676-4424-8817-7fca6dc1a33e/BVrFXsaeui.json'
        });
      })
      .catch(error => console.error(error));
  }


  onVoltarInicio() {
    this.router.navigateByUrl('/inicio');
  }
}
