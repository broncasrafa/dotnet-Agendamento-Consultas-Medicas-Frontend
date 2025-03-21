import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { JwtModule } from '@auth0/angular-jwt';

import { routes } from 'src/app/app.routes';
import { jwtInterceptor } from 'src/app/core/interceptors/jwt.interceptor';
import { authInterceptor } from 'src/app/core/interceptors/auth.interceptor';
import { loadingInterceptor } from 'src/app/core/interceptors/loading.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([jwtInterceptor, authInterceptor, loadingInterceptor])
    ),
    provideAnimations(),
    provideToastr(),
    provideEnvironmentNgxMask(),
    importProvidersFrom([
      JwtModule.forRoot({
        config: {
          tokenGetter: () => localStorage.getItem('JWT_TOKEN'),
      }
      })
    ])
    // importProvidersFrom(CookieModule.withOptions()),
  ]
};
