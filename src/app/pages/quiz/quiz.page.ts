import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, effect, ElementRef, Inject, inject, OnDestroy, OnInit, signal, viewChild } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonicSlides, IonToolbar, IonButton, IonButtons, IonFab, IonFabButton, IonFabList,
  Platform, IonAlert, IonModal,
   IonIcon, IonItem, IonChip, IonText, IonList, IonItemGroup, IonLabel, IonRow, IonCol, IonSpinner, IonTitle, IonSegment, IonSegmentButton } from '@ionic/angular/standalone';
import { add, addOutline, arrowBack, bookmarkOutline, bulbOutline, checkmark, checkmarkCircle, chevronBack, chevronDownCircle, chevronForwardCircle, chevronUpCircle, chevronUpOutline, close, closeCircle, colorPalette, diamondOutline, earthOutline, eye, eyeOutline, fileTrayFullOutline, globe, lockClosedOutline, optionsOutline, pencilOutline, saveOutline, star, starOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { register } from 'swiper/element/bundle';
import { Router } from '@angular/router';
import { Subscription, timeout } from 'rxjs';
import { QuizOptionsComponent } from "../../components/quiz-options/quiz-options.component";
import { ResultComponent } from "../../components/result/result.component";
import { ViewAnswerComponent } from "../../components/view-answer/view-answer.component";
import { ReviewComponent } from 'src/app/components/review/review.component';
import { TextHighlightPipe } from 'src/app/pipes/text-highlight.pipe';
import { FloatingCardComponent } from 'src/app/components/floating-card/floating-card.component';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { ToastService } from 'src/app/components/toast/toast.service';
import { Question } from 'src/interfaces/question.interface';
import { QuizService } from 'src/services/quiz/quiz.service';
import { Dictionary } from 'src/interfaces/dictionary.interface';
import { DictionaryService } from 'src/services/dictionary.service';
import { QuestionService } from 'src/services/question.service';
register();

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.page.html',
  styleUrls: ['./quiz.page.scss'],
  standalone: true,
  imports: [IonSegmentButton, IonSegment, IonTitle, IonSpinner, IonCol, IonRow, IonLabel, 
    IonFab,IonFabButton,IonFabList,
    IonItemGroup, IonList, IonText, IonChip, IonItem, IonIcon, IonButtons, IonButton, IonContent,
     IonHeader, IonToolbar, IonAlert, IonModal, ReviewComponent,
    CommonModule, FormsModule, QuizOptionsComponent, ResultComponent, ViewAnswerComponent,
    TextHighlightPipe, FloatingCardComponent, SpinnerComponent],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ], //CUIDADO: Esto puede evitar que se encuentre el error en los elementos. Si se encuentra un error en el template, eliminar esta línea y revisar el error en consola
})
export class QuizPage implements OnInit, OnDestroy {

  currentIndex = signal<number>(0);
  isReview = signal<boolean>(false);
  isSubmitted = signal<boolean>(false);

  // cache question
  isCacheQuestion = signal<boolean>(false);

  // exam modal
  isModalExam = signal<boolean>(false);

  // alert variables
  isSubmitConfirm = signal<boolean>(false);
  alertButtons = signal<any>(['Action']);
  alertMessage = signal<string | null>(null);

  // result modal
  isResult = signal<boolean>(false);
  isRestart = signal<boolean>(false);
  result = signal<any>(null);

  // view answers modal
  answeredQuestions = signal<Question[]>([]);
  isAnswer = signal<boolean>(false);

  // viewChild
  confirmAlert = viewChild<IonAlert>('confirmAlert');
  swiperRef = viewChild<ElementRef>('swiper');
  answersModal = viewChild<IonModal>('answers_modal');
  resultModal = viewChild<IonModal>('result_modal');
  reviewModal = viewChild<IonModal>('review_quiz_modal');
  
  backButtonSubscription!: Subscription;  
  // readonly questions = input<Question[]>([]);
  swiperModules = [IonicSlides];
  
  questions = computed<Question[]>(()=> this.quizS.questions()!);
  masterSettings = computed(()=> this.quizS.masterSettings);
  duration = computed(()=> this.quizS.formattedTimeSignal());
  timeUp = computed<boolean>(()=> this.quizS.timeUp());

  recordQuestions: Question[] = [];
  isFlipped = false;
  recordIndex = 0;

  private router = inject(Router);
  private platform = inject(Platform);
  private quizS = inject(QuizService);
  /********************************************************************** */
  // Agregando busqueda de palabras por diccionario a las preguntas
  eventTagName: string = "b";
  eventClassName: string = "word-english";
  ctrlTimeOut_word: any;
  /* translate-word */
  viewWord: boolean = false;
  wordX: number = 0;
  wordY: number = 0; wordTop: number = 0;
  wordToTranslate: string = '';
  playText: boolean = false;
  isMove: boolean = true;
  wordsDic: Dictionary | null = null; // signal<Dictionary[]>(); // signal<Dictionary[]>([]);
  // wordsDic = signal<Dictionary>();
  private dictionaryS = inject(DictionaryService);
  private questionS = inject(QuestionService);
  private toastS = inject(ToastService);

  isLoading = signal<boolean>(false); // Loading state
  selectSeeAnswer = signal<boolean>(false); // variable para el select de ver respuestas
  activeEditContent = signal<boolean>(false); // variable para el select de ver respuestas
  
  selectQuestion = signal<Question | null>(null); // variable para el select de ver respuestas

  constructor(@Inject(DOCUMENT) private document: Document) {
    addIcons({
      arrowBack,
      star,
      starOutline,
      optionsOutline,
      chevronBack,
      checkmarkCircle,
      close,
      closeCircle,
      checkmark,
      eyeOutline, eye,
      addOutline,
      diamondOutline,
      pencilOutline, saveOutline,
      bulbOutline,
      add,

      chevronUpOutline, chevronUpCircle, colorPalette,
      bookmarkOutline,
      fileTrayFullOutline,
      earthOutline,
      lockClosedOutline
    });

    effect(()=> {
      console.log('effect');
      if(!this.isSubmitted() && this.timeUp()){
        this.submitQuiz();
      }
    });
   }

   setIsLoading(loading: boolean){
    this.isLoading.set(loading);
  }

  ngOnInit() {
    console.log("Quiz page init");
    this.backButtonEventHandler();
    // dictionary
    this.attachGlobalClickListener();

    // load dictionary
    this.loadingDictionary();

  }


  ngOnDestroy(): void {
    console.log("Quiz page destroy");
    this.unSubscribeBackButtonEventHandler();
      this.quizS.reset();

  }



  setIsReview(value: boolean){
    this.isReview.set(value);
  }

  // mostrar el modal agregar preguntas a mis examenes
  setIsExam(value: boolean){
    // this.isExam.set(value);
    this.isModalExam.set(value);
  }

  setIsCacheQuestion(value: boolean){
    this.isCacheQuestion.set(value);
  }

  setAlertMessage(msg: string | null){
    this.alertMessage.set(msg);
  }

  setIsSubmitted(value: boolean){
    this.isSubmitted.set(value);
  }


  setIsSubmitConfirm(val: boolean, isGoBack = false){
    if(isGoBack){
      this.setAlertMessage(null);
    }

    this.isSubmitConfirm.set(val);
  }

  setIsResult(val: boolean){
    this.isResult.set(val);
  }

  setIsRestart(val: boolean){
    this.isRestart.set(val);
  }

  setAnsweredQuestions(questions: Question[]){
    this.answeredQuestions.set(questions);
  } 

  setIsAnswer(val: boolean){
    this.isAnswer.set(val);
  } 

  navigateBack(){
    this.router.navigateByUrl('/tabs/tab3');
  }

  backButtonEventHandler(){
    
    // subscribe to the hardware back button only oin this page
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(10, async()=>{
      this.handleBackButton();
    });

  }

  unSubscribeBackButtonEventHandler(){
    // Unsubscribe to avoid applying the back button behavior globally
    if(this.backButtonSubscription){
      this.backButtonSubscription.unsubscribe();
    }
  }

  handleBackButton(){
    // si no modals o alertas estan abiertas, preguntar si quiere salir del cuestionario
    
    // check and dismiss the confirmation alert   
    if(this.confirmAlert()?.isOpen){
      console.log("Confirmar alerta", this.confirmAlert());
      this.confirmAlert()?.dismiss();
      return;
    }

    //check and dismiss the modals in the hierarchy
    if(this.reviewModal()?.isOpen){
      console.log("Review modal", this.reviewModal());
      this.reviewModal()?.dismiss();
      return;
    }

    if(this.resultModal()?.isOpen){
      console.log("Result modal", this.resultModal());
      this.resultModal()?.dismiss();
      return;    
    }
    
    if(this.answersModal()?.isOpen){
      console.log("Answers modal", this.answersModal());
      this.answersModal()?.dismiss();
      return;
    }  

    this.goBackAlert();
  }

  setAlertButtons(){
    this.alertButtons.set([
      {
        text: 'No',
        role: 'cancel',
      }, {
        text: 'Si',
        handler: () => {
          if(this.alertMessage()){
            this.navigateBack();
          }else{
            this.submitQuiz();
          }
        }
      }
    ]);
  }

  goBackAlert(){
    console.log('exit quiz alert');

    this.setAlertMessage("¿Estás seguro de que quieres salir del cuestionario?, se perderán todas las respuestas no enviadas.");
    this.setAlertButtons();
    this.setIsSubmitConfirm(true);
  }

  markAnswer(){
    this.quizS.markAnswer(this.currentIndex());
  }

  onSlideChange(){
    const swiperElement = this.swiperRef()?.nativeElement.swiper;
    const currentIndex = swiperElement.activeIndex;

    if(currentIndex >= 0){
      this.currentIndex.set(currentIndex);
    }

    console.log("current index: ", this.currentIndex());
  }

  slideTo(index: number){
    console.log(index);
    const swiperElement = this.swiperRef()?.nativeElement.swiper;
    swiperElement.slideTo(index, 300, false);
    swiperElement.update();
  }

  replayViaModal(template: IonModal){
    this.setIsRestart(true);
    template.dismiss();

    //restart functionality
    this.onRestart();
  }

  exitModal(){
    this.setIsResult(false);
    this.setIsRestart(false);
  }

  exitQuiz(){
    this.navigateBack();
    setTimeout(()=>{
      this.setIsRestart(false);
    }, 1000);
  }

  onRestart(){
    this.quizS.restart();
    console.log('restart quiz', this.questions());

    this.setIsSubmitted(false);
    this.slideTo(0);
  }

  viewAnswers(){
    this.setAnsweredQuestions(this.quizS.filterAnswers('all'));
    this.setIsAnswer(true);
  }

  // filtrando las preguntas respondidas
  filterAnswers(event: any){
    const value = event.detail.value;
    this.setAnsweredQuestions(this.quizS.filterAnswers(value));

  }


  showResult(){
    // get the result
    this.result.set(this.quizS.calculateQuizResults());
    // open result modal
    this.setIsResult(true);
  }



  optionSelected(option: any, questionIndex: number){
    console.log("option: ", option);
    this.quizS.selectedAnswer(option, questionIndex);
  }

  onSubmitAlert(){
    this.setAlertButtons();
    this.setIsSubmitConfirm(true);
  }

  submitQuiz(){
    // dismiss review modal
    if(this.reviewModal()?.isOpen){
      this.reviewModal()?.dismiss();
    }

    this.onSubmit();
  }
  
  onSubmit(){
    this.quizS.stopTimer();
    this.setIsSubmitted(true);

    this.showResult();
  }

  openQuestion(index:number | any, template: IonModal){
    template.dismiss();
    this.slideTo(index);
  }

  /***************************************************************** */
  // dictionary
  loadingDictionary(){
    this.dictionaryS.getDictionary();
  }

  onSelectionChange(event: MouseEvent | PointerEvent): void {
    const target = event.target as HTMLElement;
  
    // Solo seguir si el clic fue sobre un <b> con la clase exacta
    if (target.tagName.toLowerCase() === this.eventTagName && target.classList.contains(this.eventClassName)) {
  
      const word = target.innerText.trim();
      console.log("--> " + word);
  
      if (!word) {
        this.viewWord = false;
        return;
      }
  
      this.viewWord = true;
      this.wordToTranslate = word;

      
      this.wordsDic = this.dictionaryS.dictionaries()!.filter((item: any) => {
        return item.dic_name === word;
      })[0];

      console.log(this.wordsDic);
  
      // Capturar la posición exacta del clic
      this.wordX = event.clientX;
      this.wordY = event.clientY;
  
      console.log(`Posición - X: ${this.wordX}, Y: ${this.wordY}`);
  
    } else {
      // Si no es un <b class='word-english'>, ocultar la tarjeta flotante
      this.viewWord = false;
    }
  }


  private attachGlobalClickListener(): void {
    this.document.onclick = (event: MouseEvent) => {
      clearTimeout(this.ctrlTimeOut_word);

      // Calcula top relativo para alguna posición flotante.
      this.wordTop = (event.screenY - event.clientY) / 2;

      if (this.isMove) {
        this.wordX = event.clientX > 150 ? 150 : event.clientX;
        this.wordY = event.clientY < 177 ? 177: event.clientY - 180;
        // console.log(`Posición X: ${this.wordX}`);
        // console.log(`Posición Y: ${this.wordY}`);
      }

      // Evitar movimientos repetidos por 1.2 segundos
      this.isMove = false;
      setTimeout(() => {
        this.isMove = true;
      }, 1200);
      
      // Ocultar la palabra traducida tras 8.8 segundos
      this.ctrlTimeOut_word = setTimeout(() => {
        this.viewWord = false;
      }, 8800);
    };
  }

  onActiveAnswer(index: any){
    // this.questions()[index].viewAnswer = !question.viewAnswer;
    // va primero: dado a que se tiene que verificar si esta habilitado o no
    if(this.questions()[index].viewAnswer){
      this.questions()[index].viewAnswer = false;
      return;
    }
    
      // Activar loading
      this.setIsLoading(true);

      
  }

  
  onVerRespuestasTotales(){
    this.selectSeeAnswer.set(!this.selectSeeAnswer().valueOf());
    console.log(this.selectSeeAnswer());
  }

  activeEditContent_(){
    this.activeEditContent.set(!this.activeEditContent());
  }

  async onActiveEditContent(index: number, pr_id: any, question_content: any){

    console.log("activeEditContent: ", question_content);
    console.log("id: ", pr_id);
    // console.log("original: " +this.questions()[index].pr_content);

    if(this.questions()[index].pr_content === question_content){
      this.activeEditContent.set(!this.activeEditContent());
      this.toastS.openToast("No se han realizado cambios en la pregunta","danger");
      return;
    }



    // Activar loading
    this.setIsLoading(true);
    const resultado = await this.questionS.getQuestionByContent(pr_id, question_content);
    if (resultado) {
      console.log('Actualización exitosa');

      // cortar loading
      this.setIsLoading(false);

      this.toastS.openToast("Los datos fueron actualizados exitosamente!...","success");
      
      this.activeEditContent.set(!this.activeEditContent());
      this.questions()[index].pr_content = question_content;

    } else {
      this.toastS.openToast("Error al actualizar la pregunta, intente luego!","danger");
      console.log('Falló la actualización');
    }

  }

  // recordar preguntas
  iniciarRecuerdo(){
    if(this.recordQuestions.length == 0){
      this.toastS.openToast("usted no tiene preguntas que recordar!","warning");

      return;
    }

    this.isCacheQuestion.set(!this.isCacheQuestion());

  }

  addRecuerdo(index: number, question: Question){
    // console.log("agregar recuerdo: ", question);

    if(this.recordQuestions.some(q => q.pr_id === question.pr_id)){
      this.toastS.openToast("pregunta ya recordada","warning");
      return;
    }

    this.recordQuestions.push(question);
    this.toastS.openToast("pregunta agregada","success");
    console.log("index: ", index);
  }

  onConprobarRespuesta(index: number, pr_answer: any){
    this.isFlipped = false;
    // comprobar que la respuesta pr_answer por lo menos contenga el 70% de las letras de la respuesta correcta
    const respuestaCorrecta = this.recordQuestions[index].pr_answer;
    this.recordIndex = index;
    const respuestaUsuario = pr_answer;

    if(pr_answer == ""){
      this.toastS.openToast("No se puede dejar la respuesta vacia!","danger", "proud", true);
      return;
    }

    const porcentajeCoincidencia = this.calcularCoincidencia(respuestaCorrecta, respuestaUsuario);
    console.log("porcentaje: ", porcentajeCoincidencia);
    if (porcentajeCoincidencia.porcentaje >= 70) {
      this.isFlipped = !this.isFlipped;
    }else {
      this.toastS.openToast("respuesta incorrecta","danger", "proud", true, `${porcentajeCoincidencia.porcentaje}`, "%");
    }

  }

  calcularCoincidencia(respuestaCorrecta: string, respuestaUsuario: string): { porcentaje: number, esSuficiente: boolean } {
    const limpiar = (texto: string) => texto.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  
    const respuestaCorrectaLimpia = limpiar(respuestaCorrecta);
    const respuestaUsuarioLimpia = limpiar(respuestaUsuario);
  
    console.log("Respuesta correcta:", respuestaCorrectaLimpia);
    console.log("Respuesta usuario:", respuestaUsuarioLimpia);
  
    const longitudOriginal = respuestaCorrectaLimpia.length;
    const longitudComparacion = Math.min(respuestaCorrectaLimpia.length, respuestaUsuarioLimpia.length);
  
    let coincidencias = 0;
  
    for (let i = 0; i < longitudComparacion; i++) {
      if (respuestaCorrectaLimpia[i] === respuestaUsuarioLimpia[i]) {
        coincidencias++;
      }
    }
  
    const porcentaje = (coincidencias / longitudOriginal) * 100;
    const esSuficiente = porcentaje >= 70;
  
    return {
      porcentaje: Math.round(porcentaje * 100) / 100, // redondeado a 2 decimales
      esSuficiente
    };
  }

  onTagClick(word_tag: string, event: any){
    clearTimeout(this.ctrlTimeOut_word);

    this.wordsDic = this.dictionaryS.dictionaries()!.filter((item: any) => {
      return item.dic_name === word_tag;
    })[0];
    
    if(!this.wordsDic){
      this.toastS.openToast("palabra no diccionario","danger");
      return;
    }
    
    this.viewWord = true;

      // Ocultar la palabra traducida tras 8.8 segundos
    this.ctrlTimeOut_word = setTimeout(() => {
        this.viewWord = false;
    }, 8800);

    console.log("event: ", event);
    console.log(this.wordsDic);
  }


}
