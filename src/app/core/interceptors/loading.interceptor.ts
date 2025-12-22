import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { DISABLE_GLOBAL_LOADING } from 'src/app/core/interceptors/loading-context';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  const disableLoading = req.context.get(DISABLE_GLOBAL_LOADING);

  if (!disableLoading) {
    loadingService.show();
  }

  return next(req).pipe(
    finalize(() => {
      if (!disableLoading) {
        loadingService.hide();
      }
    })
  );
};
