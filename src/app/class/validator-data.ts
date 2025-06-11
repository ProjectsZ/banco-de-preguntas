import { AbstractControl, FormGroup, ValidationErrors } from "@angular/forms";
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',  // Esto asegura que el servicio esté disponible globalmente.
})
export class ValidatorData {

    /**
     * 
     * @param maxNumber 
     * @returns 
     * ejemplo en *.html: 
     * @let is_error_message = formData.get('question_count')?.errors?.['maxLimit']; 
     */
    maxQuestionCountValidator(maxNumber: number){
        return (control: AbstractControl): ValidationErrors | null => {
            return control.value != null && control.value > maxNumber 
            ? { maxLimit: `No puede exceder las ${maxNumber} preguntas` } : null;
        };
    }

    passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
        const value: string = control.value || '';
      
        if (!value) return null;
      
        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);
        const hasNumber = /[0-9]/.test(value);
        const hasSymbol = /[^A-Za-z0-9]/.test(value); // cualquier símbolo
      
        const valid = hasUpperCase && hasLowerCase && hasNumber && hasSymbol;
      
        return !valid ? {
              passwordStrength: {
                hasUpperCase,
                hasLowerCase,
                hasNumber,
                hasSymbol,
              },
            }
          : null;
    }

    passwordsMatchValidator(group: FormGroup): ValidationErrors | null {
      const password = group.get('usr_newPassword0')?.value;
      const confirm = group.get('usr_newPassword')?.value;
      // console.log("-----> : ", group);
      return password === confirm ? null : { passwordsMismatch: true };
    }

}
