import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormcontrolValidatorsService {

  constructor() { }

  emailValidator(control: FormControl) {
    const value = control.value || '';
    const errorMessage = 'E-mail em formato inválido';

    if (value === null)
      return null;

    const pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(value) ? null : {'invalidEmail': errorMessage};
  }

  checkPasswords: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    let password = group.get('password')!.value;
    let confirmPassword = group.get('confirmPassword')!.value;
    return password === confirmPassword ? null : { mismatch: true};
  }
}
