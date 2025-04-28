import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { IonSelect, IonSelectOption, IonContent, IonCard, IonCardTitle, IonCardSubtitle, IonButton, IonCardContent, IonItem, IonInput, IonText, IonLabel, IonDatetime, IonDatetimeButton, IonModal, IonSpinner, IonIcon, IonHeader, IonToolbar,  IonTitle, IonButtons } from '@ionic/angular/standalone';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { addIcons } from 'ionicons';
import { arrowForwardCircleOutline, settingsOutline } from 'ionicons/icons';
import { ValidatorData } from '../class/validator-data';
import { Duration } from '../class/duration';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { SpinnerComponent } from '../components/spinner/spinner.component';
import { Course } from 'src/interfaces/course.interface';
import { Category } from 'src/interfaces/category.interface';
import { CourseService } from 'src/services/quiz/course.service';
import { QuizService } from 'src/services/quiz/quiz.service';
import { CategoryService } from 'src/services/quiz/category.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [IonButtons, 
    IonTitle, IonToolbar, IonHeader, IonIcon, IonSpinner, IonModal, IonDatetimeButton, IonDatetime, IonLabel, IonText, IonInput, IonItem, IonCardContent, IonButton, IonCardSubtitle, IonCardTitle, 
    IonCard, IonContent, IonSelect, IonSelectOption,
            ReactiveFormsModule, RouterModule, SpinnerComponent
  ],
})
export class Tab3Page implements OnInit, OnDestroy {

  form = signal<FormGroup | null>(null);

  Courses = computed<Course[]>(()=> this.courseS.courses()!); // Signal to hold courses
  categories = computed<Category[]>(()=> this.categoryS.categories()!); // Signal to hold categories
  countCategories: number | null = 0; // Signal to hold categories count
  countQuestions: number | null = 0; // Signal to hold questions count
  // categories = signal<Category[]>([]);   

private userSubscription: Subscription | null = null; // Suscripción al BehaviorSubject del servicio

  isLoading_data = signal<boolean>(false);

  isLoading = signal<boolean>(false); // Loading state

  masterSettings = computed(()=> this.quizS.masterSettings);

  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private quizS = inject(QuizService);
  private courseS = inject(CourseService);
  private categoryS = inject(CategoryService);

  constructor(private validatorData: ValidatorData,
              private duration: Duration
  ) {
    addIcons({
      arrowForwardCircleOutline,
      settingsOutline,
    });
    this.initForm();
  }
  ngOnInit(): void {
    this.getCourses();
  }

  ngOnDestroy(): void {
    // Es importante desuscribirse para evitar memory leaks
    if (this.userSubscription) {
     this.userSubscription.unsubscribe();
   }
 }


  initForm() {
    const form = this.formBuilder.group({
      question_count: [null, 
        [ Validators.required, Validators.minLength(1),
          this.validatorData.maxQuestionCountValidator(this.masterSettings().questionMaxLimit)
        ]
      ],
      cat_crs_id: [null, [Validators.required]],
      pr_cat_id: [null, [Validators.required]],
      duration: [ this.duration.toIsoDateTime(this.masterSettings().defaultTiming), 
        [ Validators.required, 
          this.duration.durationValidator()
        ]
      ],
    });

    this.form.set(form);

  }


  setLoader(value: boolean){
    this.isLoading_data.set(value);
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

  async onCouseSelection(crs_id: string){
    try{
      this.isLoading.set(true);
      // console.log(crs_id);
      const { data, total } = await this.categoryS.getCategories_crs(crs_id);
      this.countCategories = total;
      if(this.countCategories === 0){
        console.log('curso sin temas');
      }

      if(data){
        console.log(data);
        this.isLoading.set(false);
      }
      // this.categories.set(data);
    }catch(e){
      console.error(e);
    }
  }

  async onSelectionPreguntas(){
    try{
      this.countQuestions = await this.quizS.getQuestion_cat(this.form()!.value.pr_cat_id);
      
      if(this.countQuestions === 0){
        console.log('tema sin preguntas');
      }

      //actualizamos el campo específico del formulario que pasamos como parámetros 
      const questionCountControl = this.form()?.get('question_count');
      // Actualizar valor y validaciones
      // questionCountControl?.setValue(this.countQuestions);
      questionCountControl?.setValidators([
        Validators.required,
        Validators.minLength(1),
        this.validatorData.maxQuestionCountValidator(this.masterSettings().questionMaxLimit)
      ]);
      questionCountControl?.updateValueAndValidity();

    }catch(e){
      console.log(e);
    }
  }


  onSubmit(){
    if(this.form()?.invalid){
      this.form()!.markAllAsTouched();
      return;
    }
    const formValue = this.form()!.value;
    console.log(formValue);

    try{
      this.setLoader(true);

      this.quizS.fetchQuestions(formValue);

      this.router.navigate(['/', 'tabs', 'tab3', 'quiz']);

    }catch(e){
      console.error(e);
    }finally{
      this.setLoader(false);
    }
  }

  onCountQuestion(event: any){
    // console.log(event);
    if(event.lastvalue === "" || event.lastvalue === 0){
      return;
    }
    // console.log(this.form()!.value.question_count);
    const count: number = this.form()!.value.question_count;
    console.log(this.duration.acumularTiempos(count));

    this.form()!.patchValue({
      duration: this.duration.toIsoDateTime(this.duration.acumularTiempos(count))
    });

    // console.log(this.form()!.value.duration);
  }

}
