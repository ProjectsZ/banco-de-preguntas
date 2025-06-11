import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem,  IonLabel, IonMenuButton,ToastController,
  InfiniteScrollCustomEvent,  IonNote, IonIcon, IonModal, IonButton, IonButtons, IonImg, IonSpinner, IonAccordionGroup, IonAccordion } from '@ionic/angular/standalone';

import { Dictionary, OrderCatDictionary } from '../interfaces/dictionary.interface';
import { addOutline, chatbubbleEllipsesOutline, chevronBackOutline, documentOutline, layersOutline, shareSocialOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { TextHighlightPipe } from '../pipes/text-highlight.pipe';
import { DictionaryService } from '../services/dictionary.service';
import { SpinnerComponent } from "../components/spinner/spinner.component";
import { c } from '@angular/core/event_dispatcher.d-pVP0-wST';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { User } from '../interfaces/user.interface';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [IonAccordion, IonAccordionGroup, IonButtons, IonButton, IonModal, IonIcon, IonLabel, IonItem, IonList, IonHeader, IonToolbar, IonTitle, IonContent, 
    TextHighlightPipe, SpinnerComponent]
})
export class Tab2Page implements OnInit, OnDestroy {

  // usuario de tipo User
  currentUser!: User;

  // wordsAll = signal<Dictionary[]>([]); // Signal to hold words
  wordsAll = signal<OrderCatDictionary[]>([]); // Signal to hold words
  
    
  isloading = signal<boolean>(false);

  isModalOpen = signal<boolean>(false);
  itemSelected = signal<Dictionary | null>(null);

private userSubscription: Subscription | null = null; // Suscripción al BehaviorSubject del servicio

  private dictionaryS = inject(DictionaryService);
  private authS = inject(AuthService);
  private toastC = inject(ToastController);
  
  constructor() {
    addIcons({
      chevronBackOutline,
      chatbubbleEllipsesOutline,
      addOutline,
      documentOutline,
      layersOutline,
      shareSocialOutline
    })

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

  ngOnInit(): void {
      this.getWordAll();
  }

  ngOnDestroy(): void {// Es importante desuscribirse para evitar memory leaks
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }

    this.dictionaryS.setDictionary(null);

  }

  setIsLoading(loading: boolean){
    this.isloading.set(loading);
  }

  async getWordAll(newData: boolean = false){
    try{
      this.setIsLoading(true);
      const { data, total }: any = await this.dictionaryS.getDictionary(newData)      
      // this.categories.set(data);
      // console.log(data, total);
      if(data){
        const groupedData = data.reduce((acc: any, item: any) => {
          // Buscamos si ya existe una categoría en el acumulador
          const existingCategory = acc.find((group: any) => group.categoria_title === item.categorias.cat_title);
          
          // Si la categoría ya existe, añadimos el item a su array data_dic
          if (existingCategory) {
            existingCategory.data_dic.push(item);
          } else {
            // Si no existe, creamos una nueva categoría con el primer item
            acc.push({
              categoria_title: item.categorias.cat_title,
              data_dic: [item]
            });
          }
        
          return acc;
        }, []);
        // console.log('newData: ', groupedData);
        this.wordsAll.set(groupedData);
      }
      
    console.log(this.wordsAll());
      
    }catch(e){
      console.error(e);
    }finally{
      this.setIsLoading(false);
    }
  }


  onIonInfinite(event: InfiniteScrollCustomEvent): void {
    setTimeout(() => {
      event.target.complete();
    }, 500);
  }

  onLike(index: number, aumentar: number, wordsAll: any): void {
    const words = [...wordsAll];  // Copiamos el array original.
  
    if (index >= 0 && index < words.length) {
      const word = words[index];
  
      if (word.dic_like >= 0) {
        if (aumentar < 0 && word.dic_like === 0) {
          word.dic_like = 0;  // No bajamos de 0.
        } else {
          word.dic_like += aumentar;
        }
      }
  
      this.wordsAll.set(words);  // Actualizamos el signal.
    }
  }

  onClickModel(){

  }

  async onFileImportFromExcelDictionary(event: any){
      try{
        this.setIsLoading(true);
        const data = await this.dictionaryS.importQuestionFromExcel(event).then((data: any) => {
          console.log('data: ', data);

          this.setIsLoading(false);
          return data;
        }).catch((error: any) => {
          console.error('Error: ', error);
          this.presentToast( "Se produjo un error inesperado!", 'top', 5000, 'close', 'danger');
          this.setIsLoading(false);
          return error;
        });
        console.log(data);
        if(data){
          this.getWordAll(true);
          this.setIsLoading(false); // Se produjo un error inesperado!
          this.presentToast("Agregado correctamente! ...", 'top', 5000, 'checkmark', 'success');
        }
  
      }catch(e){
        console.error(e);
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

  onModalDismiss(event: any){
    this.isModalOpen.set(false);
    console.log('event: ', event);
  }

  loadDataDiccionario(item:any){
    this.itemSelected.set(item);
    // console.log('item: ', this.itemSelected());
    this.isModalOpen.set(!this.isModalOpen());
    // console.log('isModalOpen: ', this.isModalOpen());
  }

}
