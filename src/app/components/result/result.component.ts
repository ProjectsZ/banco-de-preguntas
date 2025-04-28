import { Component, inject, input, OnDestroy, OnInit, output, signal } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonText, IonButton, IonButtons, IonIcon, IonContent, IonLabel, IonCard, IonGrid, IonRow, IonCol, IonChip } from "@ionic/angular/standalone";
import { CircleTextComponent } from "./../widgets/circle-text/circle-text.component";
import { addIcons } from 'ionicons';
import { giftOutline, reloadOutline } from 'ionicons/icons';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
  imports: [IonChip, IonCol, IonRow, IonGrid, IonLabel, IonContent, IonIcon, IonButtons, IonButton, IonText, IonTitle, IonToolbar, IonHeader,
    CircleTextComponent,
   ]
})
export class ResultComponent  implements OnInit, OnDestroy {

  readonly result = input<any>(null);

  userSTATUS = input<string>('ESTUDIANTE');

  close = output<boolean>();
  answer = output<boolean>();
  restart = output<boolean>();

  coin_win: number = 0;
  
  isLoading = signal<boolean>(false); // Loading state

  private userSubscription: Subscription | null = null; // Suscripción al BehaviorSubject del servicio

  constructor() {
    addIcons({
      reloadOutline,
      giftOutline
    });
  }
  ngOnDestroy(): void {
      // Es importante desuscribirse para evitar memory leaks
      if (this.userSubscription) {
        this.userSubscription.unsubscribe();
      }
  }

  ngOnInit() {
    if(this.result().totalPoints >= 10 && this.result().totalPoints <= 20 && this.result().score >= (this.result().totalPoints -2)){
      this.coin_win = 7
    }else if(this.result().totalPoints > 20 && this.result().totalPoints <= 30 && this.result().score >= (this.result().totalPoints -3)){
      this.coin_win = 10
    }else if(this.result().totalPoints > 30 && this.result().score >= (this.result().totalPoints -5)){
      this.coin_win = 20
    }else{
      this.coin_win = 0
    }

  }

  closeModal(){
    this.close.emit(true);
  }

  replay(){
    this.restart.emit(true);
  }

  viewAnswers(){
    this.answer.emit(true);
  }

  // loading
  setIsLoading(loading: boolean){
    this.isLoading.set(loading);
  }


}
