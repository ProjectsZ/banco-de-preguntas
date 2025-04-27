import { AbstractControl, ValidationErrors } from "@angular/forms";
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

}
