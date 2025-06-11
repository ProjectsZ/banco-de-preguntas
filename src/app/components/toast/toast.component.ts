import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonText, IonIcon } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { alertCircleOutline, alertOutline, checkmarkCircle, checkmarkDoneCircle, closeCircleOutline, closeOutline } from 'ionicons/icons';
import { TextHighlightPipe } from 'src/app/pipes/text-highlight.pipe';
import { TextLimitPipe } from 'src/app/pipes/text-limit.pipe';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  imports: [IonIcon, IonText, CommonModule, TextHighlightPipe]
})
export class ToastComponent  implements OnInit {

  icon: string = 'checkmark-done-outline';
  colorIcon: string = 'dark'; // verde por defecto

  @Input() message!: string;
  @Input() color: 'success' | 'danger' | 'warning' = 'success';
  @Input() feeling: 'happy' | 'curious' | 'annoyed' | 'proud' | 'confused' | 'affectionate' | 'angry' | 'playful' | 'offended' | 'sad' | 'suspicious' = 'proud';
  @Input() level_state: number = 0; // 0 = no se repite, 1 = se repite, 2 = se repite con sonido
 
  constructor() { }

  ngOnInit() {
    addIcons({
      checkmarkCircle,
      alertOutline,
      closeOutline,
      closeCircleOutline,
      alertCircleOutline
    })
  }

  getColor(color: string): string {
    switch (color) {
      case 'success':
        this.icon = 'checkmark-circle';
        this.colorIcon = 'light';
        return '#28a745'; // verde
      case 'danger':
        this.icon = 'close-circle-outline';
        this.colorIcon = 'light';
        return '#dc3545'; // rojo
      case 'warning':
        this.icon = 'alert-circle-outline';
        this.colorIcon = 'light';
        return '#ffc107'; // amarillo
      default:
        this.icon = 'checkmark-done-circle';
        this.colorIcon = 'dark';
        return '#333';     // gris por defecto
    }
  }


  /**
   * 
   * "feeling" ('curious' | 'annoyed' | 'proud' | 'confused' | 'affectionate' | 'angry' | 'playful' | 'offended' | 'sad' | 'suspicious') segun como cree que se sienta al decir esas palabras y el nivel de severidad o grado fuerte en "several_times" (del 1 al 10) que no deberia decirse mucho
   * 
   * 
   */

}
