import { Component, inject, Inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonButtons, IonMenu, IonMenuButton, IonIcon, IonHeader, IonToolbar, IonTitle, IonList, IonItem, IonAvatar, IonLabel, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonCardSubtitle, IonSearchbar } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { bookOutline, clipboardOutline, exitOutline, folderOutline, helpOutline, listOutline, menu, notificationsOutline, personOutline, settingsOutline, starOutline } from 'ionicons/icons';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/interfaces/user.interface';
import { ToastService } from 'src/app/components/toast/toast.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonSearchbar, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonLabel, IonAvatar, IonItem, IonList, IonIcon, IonButtons, IonContent, IonMenu, IonMenuButton,
           CommonModule, FormsModule,ReactiveFormsModule ]
})
export class HomePage implements OnInit, OnDestroy {

    // usuario de tipo User
    currentUser!: User;
    private userSubscription: Subscription | null = null; // Suscripción al BehaviorSubject del servicio

    private authS = inject(AuthService);

  selectTab = signal<string>('cursos');

  private router = inject(Router);
  private toastS = inject(ToastService);

  constructor() {
  }

  ngOnInit() {
    addIcons({
      menu,
      personOutline,
      bookOutline,
      clipboardOutline,
      folderOutline,
      listOutline,
      starOutline,
      notificationsOutline,
      settingsOutline,
      helpOutline,
      exitOutline
    })


     // Nos suscribimos al BehaviorSubject del servicio
     this.userSubscription = this.authS.currentUser.subscribe({
      next: (user) => {
        this.currentUser = user;
        console.log('Usuario actual:', this.currentUser);
      },
      error: (err) => {
        console.error('Error al obtener datos del usuario:', err);
      },
      complete: () => {
        console.log('Suscripción completada');
      }
    });
 
  }

  ngOnDestroy(): void {// Es importante desuscribirse para evitar memory leaks
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
  
  logout(){
    localStorage.removeItem('x-token');
    this.router.navigate(['/login']);

  }

  onNaviate(navegar: string) {
    this.router.navigate([navegar]);

  }


}
