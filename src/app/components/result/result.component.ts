import { Component, inject, input, OnDestroy, OnInit, output, signal } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonText, IonButton, IonButtons, IonIcon, IonContent, IonLabel, IonCard, IonGrid, IonRow, IonCol, IonChip } from "@ionic/angular/standalone";
import { CircleTextComponent } from "./../widgets/circle-text/circle-text.component";
import { addIcons } from 'ionicons';
import { arrowBack, giftOutline, reloadOutline } from 'ionicons/icons';
import { User } from 'src/app/interfaces/user.interface';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from '../toast/toast.service';


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
  // usuario
  currentUser!: User;      // usuario de tipo User
  private userSubscription: Subscription | null = null; // Suscripción al BehaviorSubject del servicio
  private authS = inject(AuthService);
  private toastS = inject(ToastService); // Servicio de Toast

  constructor() {
    addIcons({
      reloadOutline,
      giftOutline,
      arrowBack
    });
  }
  ngOnDestroy(): void {
      // Es importante desuscribirse para evitar memory leaks
      if (this.userSubscription) {
        this.userSubscription.unsubscribe();
      }
  }

  ngOnInit() {
    const resultData = this.result();
    
    if (resultData && resultData.totalPoints && resultData.score !== undefined) {
      if(resultData.totalPoints >= 10 && resultData.totalPoints <= 20 && resultData.score >= (resultData.totalPoints -2)){
        this.coin_win = 7
      }else if(resultData.totalPoints > 20 && resultData.totalPoints <= 30 && resultData.score >= (resultData.totalPoints -3)){
        this.coin_win = 10
      }else if(resultData.totalPoints > 30 && resultData.score >= (resultData.totalPoints -5)){
        this.coin_win = 20
      }else{
        this.coin_win = 0
      }
    } else {
      this.coin_win = 0;
    }

    // Nos suscribimos al BehaviorSubject del servicio
    this.userSubscription = this.authS.currentUser.subscribe({
      next: (user) => {
        this.currentUser = user;
        // console.log('Usuario actual:', this.currentUser);
      },
      error: (err) => {
        console.error('Error al obtener datos del usuario:', err);
      },
      complete: () => {
        console.log('Suscripción completada');
      }
    });

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

  canjearPremio(){
    if(this.currentUser?.usr_coin == 0){
      this.toastS.openToast("Usted no tiene monedas suficientes, no insista!","danger", 'angry', true); 
      return
    }
  
    // Validar si existe el usuario antes de proceder
    if (!this.currentUser?.usr_id) {
      console.error('Usuario no autenticado');
      return;
    }

    // Activar loading
    this.setIsLoading(true);
    console.log('--> Monedas a canjear:', this.coin_win);
    // Actualizar moneditas
    this.userSubscription = this.authS.updateCoin(this.currentUser.usr_id,0, this.coin_win).subscribe({
      next: (success) => {
        if (success) {
          console.log('Monedas actualizadas correctamente');

          // desactivando loading
          this.setIsLoading(false);

          // this.questions()[index].viewAnswer = true;
          this.coin_win = 0; // Reiniciar el valor de las monedas ganadas
          this.toastS.openToast("Se canjeo el regalo, chevere!", "success", "happy", true); // Mensaje de éxito

        } else {         
          this.toastS.openToast("Error al pagar con las monedas, intente luego!","danger", "annoyed", true);
        }
      },
      error: (err) => {
        console.error('Error en la suscripción de updateCoin:', err);
      }
    });
  }

}
