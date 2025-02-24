import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { provideEnvironmentNgxMask } from 'ngx-mask';

import { routes } from 'src/app/app.routes';
import { JwtModule } from '@auth0/angular-jwt';
import { jwtInterceptor } from 'src/app/core/interceptors/jwt.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([jwtInterceptor])
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
