import { inject, Injectable, signal } from '@angular/core';

import { ModalController, AnimationController } from '@ionic/angular/standalone';
import { ToastComponent } from './toast.component';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private modalC = inject(ModalController);
  private animationC = inject(AnimationController);
  private httpC = inject(HttpClient);

  // toastMessages: any[] = [];
  toastMessages = signal<any[] | null>(null);

  dataNivel_numerico: any[] = [];

  constructor() {}

  // crear un httpC que abra la data json de toast.json en un array de objetos
  async loadToastData(message: string, color: 'success' | 'danger' | 'warning',
     feeling: 'happy' | 'curious' | 'annoyed' | 'proud' | 'confused' | 'affectionate' | 'angry' | 'playful' | 'offended' | 'sad' | 'suspicious',
     nivel_numerico: number, opcion1: string = '', opcion2: string= ''): Promise<{speak: string, feeling: string, color: 'success' | 'danger' | 'warning', level_state: number}> {
    if(message === "") {
      return {
        speak: message, // devuelve el mismo mensaje si no encuentra nada
        feeling: feeling,
        color: color,
        level_state: 0
      }; // devuelve el mismo mensaje si no encuentra nada
    }
    if (this.toastMessages.length === 0 || !this.toastMessages()) { // solo carga una vez
      const data = await lastValueFrom(this.httpC.get<any[]>('assets/data/cat-prompt.json'));
      // console.log("Toast data cargada:", data);
      // this.toastMessages = data;
      this.toastMessages.set(data);
    }
  
    const encontrado = this.toastMessages()?.find(toast => (toast.key_phrase === message));
  
    if (encontrado && encontrado.message.length > 0) {
      
      // Filtrar mensajes que tengan several_times >= nivel
      const filtrados = encontrado.message.filter((m: {speak: string, feeling: string, several_times: number}) => m.several_times >= nivel_numerico);

      // Si hay resultados filtrados, escoger uno al azar de ellos
      if (filtrados.length > 0) {
        const indice = Math.floor(Math.random() * filtrados.length);

        if(opcion1 !== "" && opcion2 !== ""){
            // buscar en la frase si existe **** y si existe reemplazar por la palabra1 y palabra2
            let mensaje_speak1 = filtrados[indice].speak.replace("****", `${opcion1} ${opcion2}`);
                  
            return {
              speak: mensaje_speak1, // devuelve un mensaje aleatorio
              feeling: filtrados[indice].feeling,
              color: encontrado.color,
              level_state: filtrados[indice].several_times
            }
        }else{

          return {
            speak: filtrados[indice].speak, // devuelve un mensaje aleatorio
            feeling: filtrados[indice].feeling,
            color: encontrado.color,
            level_state: filtrados[indice].several_times
          }
        }


      }  // Si no hay mensajes que cumplan, escoger cualquiera al azar
      else {
        
        const randomIndex = Math.floor(Math.random() * encontrado.message.length);

        
        return {
            speak: encontrado.message[randomIndex].speak, // devuelve un mensaje aleatorio
            feeling: encontrado.message[randomIndex].feeling,
            color: encontrado.color,
            level_state: encontrado.message[randomIndex].several_times
        }
        

      }

    } else {
      return {        
        speak: message, // devuelve el mismo mensaje si no encuentra nada
        feeling: feeling,
        color: color,
        level_state: 0
      }; // devuelve el mismo mensaje si no encuentra nada
    }
  }

  /**
   * Abre un modal de tipo ToastComponent con el mensaje y color especificados.
   * @param message Mensaje a mostrar en el toast.
   * @param color Color del toast (success, danger, warning).
   * @param noCerrarElAnterior Si es true, no cierra el modal anterior. */  
  async openToast(message: string, color: 'success' | 'danger' | 'warning' = 'success', 
    emotion: 'happy' | 'curious' | 'annoyed' | 'proud' | 'confused' | 'affectionate' | 'angry' | 'playful' | 'offended' | 'sad' | 'suspicious' = 'happy', 
    noCerrarElAnterior: boolean = false,
    opcion1: string="", opcion2: string="", time_duration: number = 3200) {

    const numero = this.onCountNivelNumeric(message.toLowerCase());
      console.log("numero count:", numero);
    // Cerrar cualquier modal existente antes de abrir uno nuevo
    let { speak, feeling, color: my_color, level_state } = await 
    this.loadToastData(message.toLowerCase(), color, emotion, numero, opcion1, opcion2);

    const existingModal = await this.modalC.getTop();
    if (existingModal && !noCerrarElAnterior) {
      await existingModal.dismiss();
    }
    const modal = await this.modalC.create({
      component: ToastComponent,
      componentProps: {
        message: speak,
        feeling: feeling,
        color: my_color,
        level_state: level_state,
      },
      cssClass: 'toast-modal',
      backdropDismiss: false,
      showBackdrop: false,
      animated: true
    });

    
    await modal.present();

    
    // Cerrar automáticamente en 4.8 segundos
    setTimeout(() => modal.dismiss(), time_duration);
  }

  onCountNivelNumeric(message: string): number {
    // Buscar si el mensaje ya existe en el array
    const index = this.dataNivel_numerico.findIndex(item => item.mensaje === message);
  
    if (index !== -1) {
      // Si existe, sumar 1 al nivel
      this.dataNivel_numerico[index].nivel += 1;

      if(this.dataNivel_numerico[index].nivel > 10){
        this.dataNivel_numerico[index].nivel = 1; // Limitar el nivel a 1
      }
      return this.dataNivel_numerico[index].nivel;
    } else {
      // Si no existe, agregar nuevo
      this.dataNivel_numerico.push({ mensaje: message, nivel: 1 });    
      return 1;  
    }

    
  }

  /**
   * ahora agrega mas para "key_phrase": "usuario correcto", recuerda que los valores de  feeling es  'happy' | 'curious' | 'annoyed' | 'proud' | 'confused' | 'affectionate' | 'angry' | 'playful' | 'offended' | 'sad' | 'suspicious'   y los several_times son niveles o grados del 1 a 10 (donde los primeros numeros son mas formales y los ultimos son mas coloquiales los mensajes)
   * 
   */


}
