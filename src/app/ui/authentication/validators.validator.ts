import { FormControl, AbstractControl } from '@angular/forms';

export interface ValidationResult {
    [key: string]: boolean;
}

export class PasswordValidator {

    public static strong(control: FormControl): ValidationResult {
      const hasNumber = /\d/.test(control.value);
      const hasUpper = /[A-Z]/.test(control.value);
      const hasLower = /[a-z]/.test(control.value);
      // console.log('Num, Upp, Low', hasNumber, hasUpper, hasLower);
      const valid = hasNumber && hasUpper && hasLower;
      if (!valid) {
        return { strong: true };
      }
      return null;
    }

    public static match(control: AbstractControl): ValidationResult {
      if (control.get('password').value === control.get('repeatPassword').value) {
        return null;
      }
      return {match: false};
    }
}

