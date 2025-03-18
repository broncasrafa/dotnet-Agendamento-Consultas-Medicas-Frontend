import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";

/**
 * Função de fábrica para validar o formato da data de nascimento.
 * @param allowFutureDate Se true, permite datas futuras; caso contrário, bloqueia.
 * @returns ValidatorFn - Retorna a função de validação para ser usada no FormControl.
 */
export function dateOfBirthFormatValidator(allowFutureDate: boolean = true): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Caso o campo esteja vazio, deixa que o "required" cuide disso
    }

    const dateStr = control.value.replace(/\D/g, ''); // Remove caracteres não numéricos

    // Verifica se a data tem exatamente 8 dígitos (ddmmyyyy)
    if (dateStr.length !== 8) {
      return { dateFormatInvalid: true };
    }

    const day = parseInt(dateStr.substring(0, 2), 10);
    const month = parseInt(dateStr.substring(2, 4), 10) - 1; // Mês começa em 0
    const year = parseInt(dateStr.substring(4, 8), 10);

    const date = new Date(year, month, day);

    // Verifica se a data foi corretamente interpretada pelo objeto Date
    if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
      return { dateFormatInvalid: true };
    }

    // Verifica se a data está entre hoje e até 100 anos atrás
    const today = new Date();
    const hundredYearsAgo = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());

    if (date < hundredYearsAgo) {
      return { invalidDate: true };
    }

    if (!allowFutureDate && date > today) {
      return { invalidDateFutura: true };
    }

    return null; // Data válida
  };
}

/**
 * Função para validar o CPF
 * @param control
 * @returns ValidationErrors | null
 */
export const cpfValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const cpf = control.value ? control.value.replace(/\D/g, '') : '';
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
      return { cpfInvalid: true };
  }

  let soma = 0;
  let resto;
  for (let i = 1; i <= 9; i++) {
      soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if ((resto === 10) || (resto === 11)) {
      resto = 0;
  }
  if (resto !== parseInt(cpf.substring(9, 10))) {
      return { cpfInvalid: true };
  }

  soma = 0;
  for (let i = 1; i <= 10; i++) {
      soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }
  resto = (soma * 10) % 11;
  if ((resto === 10) || (resto === 11)) {
      resto = 0;
  }
  if (resto !== parseInt(cpf.substring(10, 11))) {
      return { cpfInvalid: true };
  }

  return null;
};

/**
 * Função para validar a complexidade da senha
 * Valida a complexidade da senha:
 * - Mínimo de 5 caracteres
 * - Pelo menos 1 letra maiúscula
 * - Pelo menos 1 letra minúscula
 * - Pelo menos 1 número
 * - Pelo menos 1 caractere especial
 * @param control
 * @returns ValidationErrors | null
 */
export function passwordComplexityValidator(control: AbstractControl): ValidationErrors | null {
  const password: string = control.value || '';

  if (!password) return null; // Deixa para o "required" validar se estiver vazio

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{5,}$/;

  return passwordRegex.test(password) ? null : { passwordInvalid: true };
}

/**
 * Função para validar se as senhas são iguais
 * @param formGroup
 * @returns ValidationErrors | null
 */
export const matchPasswordsValidator: ValidatorFn = (formGroup: AbstractControl): ValidationErrors | null => {
  const group = formGroup as FormGroup;
  const passwordControl = group.get('password');
  const confirmPasswordControl = group.get('confirmPassword');

  if (!passwordControl || !confirmPasswordControl) return null;

  const password = passwordControl.value;
  const confirmPassword = confirmPasswordControl.value;

  if (!confirmPassword) {
    return null; // Deixa o erro `required` ser tratado separadamente
  }

  if (password !== confirmPassword) {
    confirmPasswordControl.setErrors({ ...confirmPasswordControl.errors, passwordsDontMatch: true });
    return { passwordsDontMatch: true };
  }

  // Remove apenas o erro passwordsDontMatch sem apagar outros erros
  if (confirmPasswordControl.hasError('passwordsDontMatch')) {
    const newErrors = { ...confirmPasswordControl.errors };
    delete newErrors['passwordsDontMatch'];
    confirmPasswordControl.setErrors(Object.keys(newErrors).length > 0 ? newErrors : null);
  }

  return null;
};


/**
 * Função para validar se os e-mails são iguais
 * @param formGroup
 * @returns ValidationErrors | null
 */
export const matchEmailsValidator: ValidatorFn = (formGroup: AbstractControl): ValidationErrors | null => {
  const group = formGroup as FormGroup;
  const emailControl = group.get('email');
  const confirmEmailControl = group.get('confirmEmail');

  if (!emailControl || !confirmEmailControl) return null;

  const email = emailControl.value;
  const confirmEmail = confirmEmailControl.value;

  if (!confirmEmail) {
    return null; // Deixa o erro `required` ser tratado separadamente
  }

  if (email !== confirmEmail) {
    confirmEmailControl.setErrors({ ...confirmEmailControl.errors, emailsDontMatch: true });
    return { emailsDontMatch: true };
  }

  // Remove apenas o erro emailsDontMatch sem apagar outros erros
  if (confirmEmailControl.hasError('emailsDontMatch')) {
    const newErrors = { ...confirmEmailControl.errors };
    delete newErrors['emailsDontMatch'];
    confirmEmailControl.setErrors(Object.keys(newErrors).length > 0 ? newErrors : null);
  }

  return null;
};

/**
 * Função que cria um validador personalizado para verificar se todos os dígitos são iguais, excluindo o DDD e o dígito 9 inicial
 * @returns ValidationErrors | null
 */
export function allDigitsEqualValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      // Remove caracteres não numéricos
      const numericValue = value.replace(/\D/g, '');

      // Verifica se o número possui ao menos 11 dígitos (incluindo DDD e dígito 9 inicial)
      if (numericValue.length < 11) return null;

      // Considera apenas os 8 dígitos principais (excluindo os primeiros 3 dígitos que seriam o DDD e o dígito 9 inicial)
      const mainNumber = numericValue.substring(3);

      // Verifica se todos os dígitos do número principal são iguais
      const allEqual = mainNumber.split('').every((char: any) => char === mainNumber[0]);

      return allEqual ? { allDigitsEqual: true } : null;
  };
}

/**
 * Valida números de telefone:
 * - Pode ter 10 dígitos (fixo) ou 11 dígitos (celular).
 * - Não pode conter números consecutivos iguais (ex: 1111111111).
 */
export function phoneNumberValidator(control: AbstractControl): ValidationErrors | null {
  const phone: string = control.value || '';

  if (!phone) return null; // Deixa `Validators.required` cuidar disso

  // Expressão regular para validar números com 10 ou 11 dígitos
  const phoneRegex = /^\d{10,11}$/;
  if (!phoneRegex.test(phone)) {
    return { phoneInvalid: 'O telefone deve ter 10 ou 11 dígitos numéricos.' };
  }

  // Verifica se todos os dígitos são iguais (ex: 1111111111, 99999999999)
  if (/^(\d)\1+$/.test(phone)) {
    return { phoneInvalid: 'Número de telefone inválido.' };
  }

  return null; // Telefone válido
}

/**
 * Função para validar o nome completo
 * @param control
 * @returns ValidationErrors | null
 */
export function fullNameValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value as string;

  // Expressão regular para verificar se há pelo menos duas palavras separadas por espaço
  const isValid = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?: [A-Za-zÀ-ÖØ-öø-ÿ]+)+$/.test(value.trim());

  return isValid ? null : { fullName: 'Digite seu nome completo (nome e sobrenome)' };
}

/**
 * Valida se o campo de seleção foi preenchido
 * @param control
 * @returns ValidationErrors | null
 */
export function selectValidator(control: AbstractControl): ValidationErrors | null {
  return control.value && control.value.trim() !== '' ? null : { invalidSelect: true };
}

/**
 * Valida se o checkbox foi marcado
 * @returns ValidationErrors | null
 */
export function checkboxRequiredValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return control.value === true ? null : { isCheckboxInvalid: true };
  };
}
