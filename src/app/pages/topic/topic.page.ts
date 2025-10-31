import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonBackButton, 
  IonButtons,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon,
  IonButton,
  IonSpinner,
  IonChip,
  IonLabel,
  IonText,
  IonAlert
} from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from 'src/app/services/quiz/category.service';
import { TopicService } from 'src/app/services/quiz/topic.service';
import { Question } from 'src/app/interfaces/question.interface';
import { addIcons } from 'ionicons';
import { bookOutline, calendarOutline, chevronBackOutline, chevronForwardOutline, clipboardOutline, 
  documentTextOutline, folderOutline, helpCircle, helpCircleOutline, idCardOutline, informationCircleOutline,
   listOutline, playOutline, refreshOutline, schoolOutline, starOutline, timeOutline, flameOutline, flame, flameSharp, 
   diamondOutline, radioButtonOnOutline, checkmarkCircleOutline} from 'ionicons/icons';
import { User } from 'src/app/interfaces/user.interface';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { ToastService } from 'src/app/components/toast/toast.service';

@Component({
  selector: 'app-topic',
  templateUrl: './topic.page.html',
  styleUrls: ['./topic.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    IonBackButton, 
    IonButtons,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonIcon,
    IonButton,
    IonSpinner,
    IonChip,
    IonLabel,
    IonText,
    IonAlert,
  ]
})
export class TopicPage implements OnInit, OnDestroy {

  temas = computed<any[]>(()=> this.categoryS.topics()!); 
  dataTopic: any = null;

  private categoryS = inject(CategoryService);

  preguntas: Question[] = [];
  preguntasPaginadas: Question[] = [];

  isLoading = signal<boolean>(false); // Loading state
  private topicService = inject(TopicService);
  
  // Variables de paginación
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 0;
  
  // Función Math para usar en el template
  Math = Math;



  private toastS = inject(ToastService);

  // limitar acceso
  currentUser!: User;      // usuario de tipo User
  private userSubscription: Subscription | null = null; // Suscripción al BehaviorSubject del servicio
  private authS = inject(AuthService);
  

  // alert variables
  isSubmitConfirm = signal<boolean>(false);
  alertButtons = signal<any>(['Action']);
  alertMessage = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.dataTopic = this.categoryS.topic_selected();
    console.log("dataTopic ---> :", this.dataTopic);

    addIcons({
      informationCircleOutline,
      schoolOutline,
      bookOutline,
      clipboardOutline,
      folderOutline,
      listOutline,
      starOutline,
      calendarOutline,
      idCardOutline,
      helpCircleOutline,
      documentTextOutline,
      playOutline,
      refreshOutline,
      chevronBackOutline,
      chevronForwardOutline,
      helpCircle,
      timeOutline,
      flameOutline,
      flame,
      flameSharp,
      diamondOutline,
      radioButtonOnOutline,
      checkmarkCircleOutline
    })

    // Nos suscribimos al BehaviorSubject del servicio
    this.userSubscription = this.authS.currentUser.subscribe({
      next: (user) => {
        this.currentUser = user;
      },
      error: (err) => {
        console.error('Error al obtener datos del usuario:', err);
      },
      complete: () => {
        console.log('Suscripción completada');
      }
    });


  }  

  ngOnInit() {
    // screen path topic/:id
    this.route.queryParams.subscribe(params => {
      console.log(params['id']);
      // filtrar por cat_title es el id
      this.temas = computed<any[]>(()=> this.categoryS.topics()!.filter((tema: any) => tema.cat_title === params['id']));
      console.log(this.temas());
    });

    this.cargarPreguntas();
  }

  ngOnDestroy(): void {
    
      // Es importante desuscribirse para evitar memory leaks
      if (this.userSubscription) {
        this.userSubscription.unsubscribe();
      }

  }

  async cargarPreguntas() {
    this.isLoading.set(true);
    try {
      // Ejemplo: Cargar las primeras 15 preguntas
      this.preguntas = await this.topicService.getPreguntasPaginadas({ limit: 15, offset: 0 });
      console.log('Preguntas cargadas:', this.preguntas);
      
      // Calcular paginación
      this.calcularPaginacion();
    } catch (error) {
      console.error('Error al cargar las preguntas', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  // Métodos de paginación
  calcularPaginacion() {
    this.totalPages = Math.ceil(this.preguntas.length / this.itemsPerPage);
    this.currentPage = 1;
    this.actualizarPreguntasPaginadas();
  }

  actualizarPreguntasPaginadas() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.preguntasPaginadas = this.preguntas.slice(startIndex, endIndex);
  }

  irAPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPages) {
      this.isLoading.set(true);
      this.currentPage = pagina;
      this.actualizarPreguntasPaginadas();
      
      // Simular un pequeño delay para mostrar el loading
      setTimeout(() => {
        this.isLoading.set(false);
      }, 300);
    }
  }

  obtenerRangoPaginas(): number[] {
    const paginas: number[] = [];
    const maxPaginasVisibles = 5;
    
    let inicio = Math.max(1, this.currentPage - Math.floor(maxPaginasVisibles / 2));
    let fin = Math.min(this.totalPages, inicio + maxPaginasVisibles - 1);
    
    if (fin - inicio + 1 < maxPaginasVisibles) {
      inicio = Math.max(1, fin - maxPaginasVisibles + 1);
    }
    
    for (let i = inicio; i <= fin; i++) {
      paginas.push(i);
    }
    
    return paginas;
  }

  // Métodos de utilidad para el template
  formatDescription(description: string): string {
    if (!description) return '';
    return description.replace(/\n/g, '<br>');
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatDateShort(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  }

  onImageError(event: any) {
    event.target.style.display = 'none';
  }

  trackByQuestion(index: number, pregunta: Question): string {
    return pregunta.pr_id || pregunta.pr_question || index.toString();
  }

  iniciarQuiz() {
    if (this.preguntas.length > 0) {
      // Navegar a la página de quiz con los datos necesarios
      this.router.navigate(['/quiz'], {
        queryParams: {
          topicId: this.dataTopic?.grouped_data[0]?.cat_id,
          questionCount: this.preguntas.length
        }
      });
    }
  }

  // Métodos para manejar la dificultad
  getDifficultyIcon(difficulty: string): string {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'flame-outline';
      case 'medium':
        return 'flame';
      case 'hard':
        return 'flame-sharp';
      default:
        return 'flame-outline';
    }
  }

  getDifficultyColor(difficulty: string): string {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'success';
      case 'medium':
        return 'warning';
      case 'hard':
        return 'danger';
      default:
        return 'primary';
    }
  }

  getQuestionTypeIcon(questionType: string): string {
    switch (questionType?.toLowerCase()) {
      case 'single':
        return 'radio-button-on-outline';
      case 'multiple':
        return 'checkmark-circle-outline';
      default:
        return 'document-text-outline';
    }
  }


  setAlertMessage(msg: string | null){
    this.alertMessage.set(msg);
  }

  setIsSubmitConfirm(val: boolean, isGoBack = false){
    if(isGoBack){
      this.setAlertMessage(null);
    }

    this.isSubmitConfirm.set(val);
  }

  onActiveCatAnswer(question: Question, index: number, payment: number = 2){
    console.log("activeCatAnswer: ", question);
    this.setAlertMessage(`¿Está seguro de que desea pagar ${payment} monedas para ver la respuesta?`); 
    
    this.setIsSubmitConfirm(true);

    this.alertButtons.set([
      {
        text: 'No',
        role: 'cancel',
      }, {
        text: 'Si',
        handler: () => {
          if(this.alertMessage()){
            console.log("si: ");
            this.setActiveCatAnswer(question, index, payment);
          }
        }
      }
    ]);
  }

  setIsLoading(loading: boolean){
    this.isLoading.set(loading);
  }



  setActiveCatAnswer(question: Question, index: number, payment: number = 2){
      console.log("setActiveCatAnswer: ", question);

      if(this.currentUser?.usr_coin == 0){
        this.toastS.openToast("Usted no tiene monedas suficientes, no insista!","danger", "angry", true); 
        return
      }
    
      // Validar si existe el usuario antes de proceder
      if (!this.currentUser?.usr_id) {
        console.error('Usuario no autenticado');
        return;
      }

      // Activar loading
      this.setIsLoading(true);

      // Actualizar moneditas
      this.userSubscription = this.authS.updateCoin(this.currentUser.usr_id, payment).subscribe({
        next: (success) => {
          if (success) {
            console.log('Monedas actualizadas correctamente');

            // desactivando loading
            this.setIsLoading(false);

            // this.questions()[index].viewAnswer = true;

            this.toastS.openToast("la respuesta podra ser", "success", "happy", true, question.pr_answer, ".", 6400);

          } else {         
            this.toastS.openToast("Error al pagar con las monedas, intente luego!","danger", "angry", true);
          }
        },
        error: (err) => {
          console.error('Error en la suscripción de updateCoin:', err);
        }
      });
  }

}