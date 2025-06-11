import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, ToastController, IonButtons, IonMenuButton, IonList, IonItem, IonLabel, IonToggle, IonModal, IonSpinner, IonIcon } from '@ionic/angular/standalone';
import { QuestionService } from 'src/app/services/question.service';
import { AddQuestionsComponent } from 'src/app/components/add-questions/add-questions.component';
import { arrowBack, arrowBackOutline, closeOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonIcon, SpinnerComponent, IonModal, IonLabel, IonItem, IonList, IonButtons, IonMenuButton, IonContent, IonHeader,
     IonTitle, IonToolbar, AddQuestionsComponent]
})
export class SettingsPage implements OnInit {

  bulkInsert = signal<boolean>(false);
  isLoading = signal<boolean>(false);

  private questionS = inject(QuestionService);
  private toastC = inject(ToastController);

  constructor() {
    addIcons({
      arrowBackOutline,
      closeOutline
    });

   }

  ngOnInit() {
    
  }

  setBulkInsert(value: boolean){
    this.bulkInsert.set(value);
  }

  setIsLoading(value: boolean){
    this.isLoading.set(value);
  }

  async onFileImportFromExcel(event: any){
    try{
      this.setIsLoading(true);
      const data = await this.questionS.importQuestionFromExcel(event)
      console.log(data);
      if(data){
        this.presentToast("Agregado correctamente! ...", 'top', 5000, 'checkmark', 'success');
      }

    }catch(e){
      console.error(e);
    } finally{
      this.presentToast( "Se produjo un error inesperado!", 'top', 5000, 'close', 'danger');
    }
  }

  async presentToast( message?: string, position: 'top' | 'middle' | 'bottom' = 'top', 
    duration: number = 50500, icon?: string, color: 'success' | 'warning' | 'danger' | 'primary' | 'tertiary' | 'light' | 'dark' | 'medium' = 'success',
    ) {
    const toast = await this.toastC.create({
      message: `${message}`,
      animated: true,  
      color: color,
      icon: 'checkmark', 
      cssClass: 'toast',
      duration: duration,
      position: position,
    });

    await toast.present();
  }

}
