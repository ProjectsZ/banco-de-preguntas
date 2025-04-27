import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { Injectable } from '@angular/core';
import { time } from "ionicons/icons";

@Injectable({
  providedIn: 'root',  // Esto asegura que el servicio esté disponible globalmente.
})
export class Duration {

    getDateFromTime(defaultTiming: string): Date {
        const [hours, minutes] = defaultTiming.split(':').map(Number);    
        return new Date(1970, 0, 1, hours, minutes);
    }

    toIsoDateTime(defaultTiming: any): string {
        const date = this.getDateFromTime(defaultTiming);
    
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const dateOfMonth = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
    
        return `${year}-${month}-${dateOfMonth}T${hours}:${minutes}:00`;
    }

    durationValidator(): ValidatorFn{
        return (control: AbstractControl): ValidationErrors | null => {
            return this.parseDuration(control.value) === 0
            ? { invalidDuration: 'Formato de duración inválido' } : null;
        };
    }
   
    parseDuration(duration: string): number {
        if(!duration || !duration.includes('T')) return 0;

        const timePart = duration.split('T')[1]; // extract HH:mm:ss part
        if(!timePart) return 0;
        const [hours, minutes, seconds] = timePart.split(':').map(Number);

        return(
            (hours || 0) * 3600 * 1000 + // convert hours to milliseconds
            (minutes || 0) * 60 * 1000 + // convert minutes to milliseconds 
            (seconds || 0) * 1000 // convert seconds to milliseconds
        );
    }

    formatTime(milliseconds: number): string {
        const hours = Math.floor(milliseconds / (1000 * 60 * 60));
        const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

        return `${ hours.toString().padStart(2, '0') }: 
                ${ minutes.toString().padStart(2, '0') }:
                ${ seconds.toString().padStart(2, '0') }`;
    }

    acumularTiempos(cantidad: number, incremento: number = 120) {
        let hours;
        let minutes;
        let seconds;

        let totalSegundos = 0;
        // 1 minuto 30 segundos = 90 segundos
      
        for (let i = 0; i < cantidad; i++) {
          totalSegundos += incremento;
          hours = Math.floor(totalSegundos / 3600);
          minutes = Math.floor((totalSegundos % 3600) / 60);
          seconds = totalSegundos % 60;     
        }
        
     //   console.log(`${ hours?.toString().padStart(2, '0') }:${ minutes?.toString().padStart(2, '0') }:${ seconds?.toString().padStart(2, '0') }`);

        return  `${ hours?.toString().padStart(2, '0') }:${ minutes?.toString().padStart(2, '0') }`;

    }
}
