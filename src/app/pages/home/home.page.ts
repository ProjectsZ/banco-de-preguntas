import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, ElementRef, inject, Inject, OnDestroy, OnInit, signal, viewChild } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonButtons, IonMenu, IonMenuButton, IonIcon, IonList, IonItem, IonLabel, IonCard, IonCardTitle, IonCardContent, IonSearchbar } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { bookOutline, clipboardOutline, exitOutline, folderOutline, helpOutline, languageOutline,
   listOutline, menu, notificationsOutline, personOutline, settingsOutline, starOutline, personCircleOutline } from 'ionicons/icons';
import { Router, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/interfaces/user.interface';
import { ToastService } from 'src/app/components/toast/toast.service';
import { Category } from 'src/app/interfaces/category.interface';
import { CategoryService } from 'src/app/services/quiz/category.service';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { TextLimitPipe } from 'src/app/pipes/text-limit.pipe';
import { AdvertisingComponent } from 'src/app/components/advertising/advertising.component';
import { PublicityService } from 'src/app/services/publicidad/publicity.service';
import { Publicity } from 'src/app/interfaces/publicity.interface';

import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonSearchbar, IonCardContent, IonCardTitle,IonCard, IonLabel, IonItem, IonList, IonIcon, IonButtons, IonContent, IonMenu, IonMenuButton,
    IonMenu, 
           CommonModule, FormsModule,ReactiveFormsModule, SpinnerComponent, RouterOutlet, AdvertisingComponent, TranslateModule,  TextLimitPipe ],
})
export class HomePage implements OnInit, OnDestroy {

    // usuario de tipo User
  currentUser!: User;
  private userSubscription: Subscription | null = null; // Suscripción al BehaviorSubject del servicio

  private authS = inject(AuthService);
  private translate = inject(TranslateService);

  selectTab = signal<string>('temas');
  currentLang = signal<string>('es');

  temas = computed<any[]>(()=> this.categoryS.topics()!); 

  private router = inject(Router);
  private toastS = inject(ToastService);
  private categoryS = inject(CategoryService);
  private publicityS = inject(PublicityService);

  randomSelectNumber = signal<number>(0); // Número aleatorio para la selección de temas  
  
  isLoading = signal<boolean>(false); // Loading state

  //PUBLICIDAD
  banner: any[] = [];

  mostrarTodosRecomendados = true;

  verTodosRecomendados() {
    this.mostrarTodosRecomendados = !this.mostrarTodosRecomendados;
  }

  cerrarTodosRecomendados() {
    this.mostrarTodosRecomendados = false;
  }
  
  constructor() {
    // Set default language
    this.translate.setDefaultLang('es');
    // Get browser language or use default
    const browserLang = this.translate.getBrowserLang();
    const lang = browserLang?.match(/es|en/) ? browserLang : 'es';
    this.translate.use(lang);
    this.currentLang.set(lang);
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
      exitOutline,
      languageOutline,
      personCircleOutline,
      
    })

    this.isLoading.set(true); // Set loading state to true
    this.categoryS.getAllCategoriesWithCatDoc().then((res) => {
      // console.log(this.temas());
      if(res){        
        this.isLoading.set(false); // Set loading state to false
        this.randomSelectNumber.set(Math.floor(Math.random() * this.temas().length)); // Set random number
        console.log('Categorias:', res);
      }
    }).catch((err) => {
      console.error('Error al obtener categorias:', err);
    });


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

    this.getBanner();
  }

  async getBanner(){
    const {data, total}: any = await this.publicityS.getBanner(this.currentUser.usr_r_id!.r_name);
    
    if(data){
      // console.log("Banner ---> :", data);
      this.banner.push(...data);
    }

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

  changeLanguage(lang: string) {
    this.translate.use(lang);
    this.currentLang.set(lang);
  }

  // path navigation topic/:id
  onTopicSelectItem(topic: Category){
    console.log("topic ---> :", topic);
    this.categoryS.topic_selected.set(topic);
    this.router.navigate(['/tabs/tab1/topic'], { queryParams: { id: topic.cat_title } });
  }

  onTheneSelectItem(theme: any){
    console.log("theme ---> :", theme);
    this.categoryS.theme_selected.set(theme);
    this.router.navigate(['/tabs/tab1/theme'], { queryParams: { id: theme.cat_title } });
  }


}
