import { Component, computed, inject, OnDestroy, OnInit, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonSelect, IonTitle, IonToolbar, IonButtons, IonSelectOption, IonTextarea, IonSearchbar, IonBackButton, IonIcon, IonButton, IonItem, IonAvatar, IonImg, IonLabel, IonList, IonModal, IonFooter, IonInput, IonAlert, IonCheckbox, IonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, arrowBackOutline, arrowForwardCircleOutline, arrowForwardOutline, heartOutline, lockClosedOutline, lockOpenOutline } from 'ionicons/icons';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/interfaces/user.interface';
import { ExamService } from 'src/app/services/exam.service';
import { Exam } from 'src/app/interfaces/exam.interface';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { QuizService } from 'src/app/services/quiz/quiz.service';
import { Question } from 'src/app/interfaces/question.interface';
import { TextLimitPipe } from 'src/app/pipes/text-limit.pipe';
import { ToastService } from 'src/app/components/toast/toast.service';
import { Course } from 'src/app/interfaces/course.interface';
import { CourseService } from 'src/app/services/quiz/course.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./../home/home.page.scss','./favorites.page.scss'],
  standalone: true,
  imports: [IonInput, IonSelect, IonSelectOption, IonTextarea, IonFooter, IonModal, IonList, IonLabel, IonImg, IonAvatar, IonItem, IonButton, IonIcon , IonSearchbar, IonButtons, IonContent, IonTitle, IonToolbar, 
    CommonModule, FormsModule, SpinnerComponent, TextLimitPipe, ReactiveFormsModule ]
})
export class FavoritesPage implements OnInit, OnDestroy {

  currentUser!: User;
  dataExams: Exam[] = []; // Arreglo para almacenar los exámenes
  dataExamsBackup: Exam[] = []; // respaldo inmutable

  selectExam!: Exam; // Examen seleccionado

  isLoading = signal<boolean>(false); // Loading state

  isModalOpen = signal<boolean>(false);

  
  questions = signal<Question[] | null>(null);

  private router = inject(Router);
  private userSubscription: Subscription | null = null; // Suscripción al BehaviorSubject del servicio
  
  private authS = inject(AuthService);
  private examS = inject(ExamService);
  private quizS = inject(QuizService);
  private toastS= inject(ToastService);

  // agregar examenes - exam modal
  isModalExam = signal<boolean>(false);
  reviewModal = viewChild<IonModal>('review_quiz_modal');
  
  examForm: FormGroup = new FormGroup({});

  Courses = computed<Course[]>(()=> this.courseS.courses()!); // Signal to hold courses
  
  private courseS = inject(CourseService);

  constructor() {


    this.examForm = new FormGroup({
      exm_name: new FormControl('', [ Validators.required ]),
      exm_description: new FormControl('', [Validators.required, Validators.minLength(8) ]),
      exm_state: new FormControl('public', [Validators.required ]),
      exm_crs_id: new FormControl('', [Validators.required ]),
    });

  }

  async onExamSubmit(){
    if(this.examForm.valid){
      console.log('Formulario válido:', this.examForm.value);
      // Aquí puedes realizar la lógica para enviar el formulario
      const { data, error } = await this.examS.createExam(this.currentUser.usr_id + '', this.examForm.value);
      
      console.log('Examen creado:', data, error); 
            
      if(data){
        this.dataExams.push(data); // Agregar el nuevo examen al arreglo de exámenes
        this.isModalOpen.set(false); // Cerrar el modal
        this.toastS.openToast('examenes cargadados', 'success', "happy", true);
      }
    }else{
      this.toastS.openToast('error al agregar examen', 'warning', "angry", true);
    }
  }

  
  setIsLoading(loading: boolean){
    this.isLoading.set(loading);
  }

  ngOnInit() {
    addIcons({
      arrowBackOutline,
      lockClosedOutline,
      lockOpenOutline,
      heartOutline,
      arrowForwardCircleOutline,
      addOutline
    })
    
     // Nos suscribimos al BehaviorSubject del servicio
     this.userSubscription = this.authS.currentUser.subscribe({
      next: async (user) => {
        this.currentUser = user;
        console.log('Usuario actual:', this.currentUser);
        const { data, total }: any = await this.examS.getExams(user.usr_id)      
        // this.categories.set(data);
        // console.log(data, total);
        if(data){
          this.dataExams = data;
          this.dataExamsBackup = data; // Guardar una copia de seguridad de los datos originales
          console.log('Exámenes:', this.dataExams);          
          this.setIsLoading(true);
          this.toastS.openToast('examenes cargadados', 'success');
        }
      },
      error: (err) => {
        console.error('Error al obtener datos del usuario:', err);
        this.toastS.openToast('error usuario', 'danger');
      },
      complete: () => {
        console.log('Suscripción completada');
        this.toastS.openToast('miau maiu', 'success');
      }
    });
  }

  ngOnDestroy(): void {// Es importante desuscribirse para evitar memory leaks
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    this.isModalOpen.set(false);
  }

  // mostrar el modal agregar preguntas a mis examenes
  setIsExam(value: boolean){
    // this.isExam.set(value);
    this.isModalExam.set(value);
  }
  
  goBack(){
    this.router.navigate(['tabs/tab1']);
  }

  
  onModalDismiss(event: any){
    this.isModalOpen.set(false);
    console.log('event: ', event);
  }

  async goModalExam(exam: Exam){

    try {
      if(exam.exm_pr.length === 0){
        console.warn('No hay preguntas para este examen');
        return;
      }

      this.selectExam = exam;
      console.log('Examen seleccionado:', this.selectExam);
      this.isModalOpen.set(!this.isModalOpen());
        // Esperar la resolución de getExamsQuestion
        const data: any = await this.quizS.getExamsQuestion(exam, `1970-01-01T00:${exam.exm_duration}`);
    
        // Cuando la promesa se resuelva, asignamos los datos
        if (data) {
          this.selectExam.exm_pr = data;
          console.log('Datos de exámenes asignados:', this.selectExam);
        }
    } catch (error) {
        console.error('Error al obtener los datos del examen:', error);
    }
   
  }

  onEnviar(){
    this.isModalOpen.set(false);
    this.router.navigate(['/', 'tabs', 'tab3', 'quiz']);
  }

  onToggleSwitch(exam: Exam, i: number, currentState: 'public' | 'private'){
        
    if(exam.exm_pr.length > 0){   
      this.isLoading.set(false); // Activar loading

      this.examS.updateExamOfState(exam.exm_id, currentState).subscribe({
        next: (success) => {
          if (success) {
            exam.exm_state = currentState; // Reflejar el nuevo estado en la UI si fue exitoso
            console.log(`✅ Estado cambiado a ${currentState}`);
            
            this.dataExams[i].exm_state = currentState;   
            this.dataExamsBackup[i].exm_state = currentState; // Actualizar el estado en el arreglo de respaldo
            this.isLoading.set(true); // Desactivar loading
          } else {
            console.warn('No se pudo actualizar el estado del examen');
          }
        },
        error: (err) => {
          console.error('Error inesperado al actualizar el examen:', err);
        },
        complete: () => {
          this.isLoading.set(true); // Desactivar loading cuando termina
        }
      });
    }

  }

  // obteniendo datos
  async getCourses(){
    try{
      
      const dataCourses = await this.courseS.getCourses();
      if(dataCourses){
        this.isLoading.set(false);
      }
    }catch(e){
      console.error(e);
    }
  }

  goAddCuorse(){
    console.log(this.dataExams.length);
    // dismiss review modal
    if(this.reviewModal()?.isOpen){
      this.reviewModal()?.dismiss();
    }


    if(this.dataExams.length >= 5 && this.currentUser.usr_r_id?.r_name === 'ESTUDIANTE'){
      // this.router.navigate(['/', 'tabs', 'tab3', 'add-quiz']);
      this.toastS.openToast('error al agregar examen', 'warning', "angry", true);
      
    }else{

      this.getCourses();

      this.setIsExam(!this.isModalExam());

      this.toastS.openToast('examenes cargadados', 'success', "happy", true);
   
    }
  }

  filtrarExamenes(event: any){
    const texto = event.detail.value?.toLowerCase() || '';

    if(event.detail.value === ''){
      this.dataExams = this.dataExamsBackup; // Si no hay texto, mostrar todos los exámenes
      return;
    }

    this.dataExams = this.dataExamsBackup.filter(exam =>
      exam.exm_name.toLowerCase().includes(texto)
    );
  }

}
