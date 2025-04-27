import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',  // Esto asegura que el servicio esté disponible globalmente.
})
export class DataArr{

    /** Método para mezclar un arreglo de manera aleatoria */
    shuffleArray(array: any[]): any[] {
        for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Intercambiar los elementos
        }
        return array;
    }

}