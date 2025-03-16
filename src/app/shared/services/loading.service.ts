import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$: Observable<boolean> = this.loadingSubject.asObservable();

  constructor() { }

  show() {
    this.loadingSubject.next(true);
  }

  hide() {
    setTimeout(() => this.loadingSubject.next(false), 300); // Pequeno delay para evitar flickering
  }
}
