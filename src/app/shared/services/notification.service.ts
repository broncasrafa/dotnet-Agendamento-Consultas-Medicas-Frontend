import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppUtils } from 'src/app/core/utils/app.util';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastr: ToastrService) { }

  showSuccessNotification(title: string, message: string) {
    this.toastr.success(message, title);
  }

  showErrorNotification(title: string, message: string){
    this.toastr.error(message, title)
  }
  showHttpResponseErrorNotification(httpError: HttpErrorResponse) {
    const { title, errorMessage } = AppUtils.handleHttpError(httpError);
    this.toastr.error(errorMessage, title)
  }

  showInfoNotification(title: string, message: string) {
    this.toastr.info(message, title)
  }

  showWarningNotification(title: string, message: string) {
    this.toastr.warning(message, title)
  }
}
