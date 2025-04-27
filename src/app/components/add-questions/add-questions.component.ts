import { CommonModule } from '@angular/common';
import { Component, computed, inject, model, OnInit, output, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonSelect, IonHeader, IonSelectOption, IonToolbar, IonTitle, IonButton, IonButtons, IonIcon, IonList, IonInput, IonText, IonFab, IonFabButton,
  IonTextarea, IonRow, IonCol, IonItem, IonCheckbox, IonRadio, IonRadioGroup, IonChip, IonBackdrop, IonModal, IonFooter, IonSpinner } from "@ionic/angular/standalone";
import { Category } from 'src/app/interfaces/category.interface';
import { QuestionService } from 'src/app/services/question.service';
import { CategoryService } from 'src/app/services/quiz/category.service';
import { SpinnerComponent } from "../spinner/spinner.component";
import { BrowserModule } from '@angular/platform-browser';
import { addIcons } from 'ionicons';
import { add, addCircleOutline, addOutline, arrowBack, close, duplicateOutline, imageOutline, listOutline, sendOutline, star, thumbsDownOutline, thumbsUpOutline, trashOutline } from 'ionicons/icons';
import { TextLimitPipe } from 'src/app/pipes/text-limit.pipe';
import { questions } from 'src/app/mock-data/questions.mock';

@Component({
  selector: 'app-add-questions',
  templateUrl: './add-questions.component.html',
  styleUrls: ['./add-questions.component.scss'],
  imports: [IonModal, TextLimitPipe, IonRadioGroup, IonRadio, IonCol, IonRow, IonFabButton, IonFab, IonText, IonInput, IonList, IonIcon, IonButtons, IonButton, IonTitle, IonToolbar, IonHeader, IonContent, IonSelect, IonSelectOption,
    IonTextarea,
    ReactiveFormsModule, CommonModule, FormsModule, SpinnerComponent ],
})
export class AddQuestionsComponent  implements OnInit {

  questionnaireForm = signal<FormGroup | null>(null);

  isLoading = signal<boolean>(false); // Loading state

  // Computed signal to access questions array
  
  questions = computed<any>(()=>  this.questionnaireForm()!.get('questions') as FormArray);
  /* funciona agregando todavia el return, osino no se reconoce */
  // questions = computed<any>(()=> {
  //   return this.questionnaireForm()!.get('questions') as FormArray;
  // }
  // );

  // categories = signal<Category[]>([]); // Signal to hold categories
  categories = computed<Category[]>(()=> this.categoryS.categories()!); 

  closeModal = output<boolean>();

  private fb = inject(FormBuilder);
  private questionS = inject(QuestionService);
  private categoryS = inject(CategoryService);

  indexSelect = signal<number>(0); // Signal to hold the index of the selected question
   // Signal to hold the image select state
  newTags: any[] = [];

  QUESTIONS_MOCK = questions;

  constructor() {
    this.initForm();
    
    addIcons({
      arrowBack,
      duplicateOutline,
      trashOutline,
      add,
      addCircleOutline,
      sendOutline,
      listOutline, star,
      thumbsUpOutline,
      close,
      imageOutline
    });

   }

  ngOnInit() {
    this.getCategoriesAndAddQuestion();
  }

  initForm(){
    const questionnaireForm = this.fb.group({
      questions: this.fb.array([]), // initially empty array of questions
    });
    this.questionnaireForm.set(questionnaireForm);

  }

  // Function to add a new question
  addQuestion(){
    this.questions().push(this.createQuestionForm());
    this.questionnaireForm.update((f) => f); // Signal update
  }
  
  
  // Function to remove a question
  removeQuestion(index: number){
    console.log(index);
    this.questions().removeAt(index);
    this.questionnaireForm.update((f) => f); // Signal update 
  }


  // function to create a new question form group
  createQuestionForm(): FormGroup{
    return this.fb.group({
      pr_question: ['', Validators.required],
      pr_content: ['', Validators.required],
      pr_difficulty: ['', Validators.required],
      pr_options: this.fb.array([
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required),
      ]),
      pr_answer: ['', Validators.required],
      pr_type: ['', Validators.required],
      pr_tags: this.fb.array([]), // Inicializa el FormArray vacío para los tags
      pr_cat_id: ['', Validators.required],
      pr_img: ['', [Validators.pattern(/\.(jpeg|jpg|gif|png)$/)]],
    });
  }

  onOptionChange(evento: any, index: number) {
    const respuesta = evento.detail.value.value;
    // console.log('Selected option:', evento.detail.value.value    );
    
    const questionControl = (this.questionnaireForm()?.get('questions') as FormArray).at(index);
    questionControl.get('pr_answer')?.patchValue(respuesta);

    // console.log('data form: ', questionControl.get('pr_answer')?.value);
  }


  // Método para agregar un tag al FormArray
  
  // Método para acceder a los tags en el FormArray
  // get tags() {
  //   return (this.questionnaireForm()?.get('pr_tags') as FormArray)?.controls;
  // }
  setTags(data:any, index: number) {
    console.log('data: ', data);

    const questionControl = (this.questionnaireForm()?.get('questions') as FormArray).at(index);
    // questionControl.get('pr_tags')?.patchValue(data);

    const prTags = questionControl.get('pr_tags') as FormArray;

    if (prTags) {
      prTags.clear();  // Limpiar los valores anteriores.
      data.forEach((tag: any) => prTags.push(new FormControl(tag)));
    }


  }
  // Método para agregar un tag
  addTag(data: any): void {

    const newTag = data.lastValue.trim(); // Obtener el valor del nuevo tag y eliminar espacios en blanco
  
    // Verifica si el subarray existe
    if (!this.newTags[this.indexSelect()]) {
      console.error(`No existe un array en el índice ${this.indexSelect()}. Inicializando uno nuevo.`);
      this.newTags[this.indexSelect()] = [];  // Crea el subarray vacío si no existe.
    }

    // Comprobar si el tag ya existe en el array de tags
    if (this.newTags[this.indexSelect()].includes(newTag)) {
      console.log('El tag ya existe:', newTag);
    } else {
      // Si el tag no existe, agregarlo al array
      this.newTags[this.indexSelect()].push(newTag);
      this.setTags(this.newTags[this.indexSelect()], this.indexSelect());
      // console.log('Tag agregado:', newTag);
    }
  }
  
  // Método para eliminar un tag
  removeTag(index: number, indexSelect: number): void {
    this.indexSelect.set(indexSelect); // Actualizar el índice seleccionado

    const selectedIndex = this.indexSelect(); // Obtener el índice seleccionado

    if (!this.newTags[selectedIndex]) {
      console.error(`No existe un array en el índice ${selectedIndex}.`);
      return;
    }

    if (index >= 0 && index < this.newTags[selectedIndex].length) {
      const tagEliminado = this.newTags[selectedIndex][index];  // Guardar antes de eliminar
      this.newTags[selectedIndex].splice(index, 1);
      
      this.setTags(this.newTags[selectedIndex], this.indexSelect());
      console.log('Tag eliminado:', tagEliminado);
    } else {
      console.warn(`El índice ${index} no es válido en el subarray.`);
    }
  }


  // Método para habilitar la edición de un tag
  editTag(index: number, newValue: string): void {
    const tags = this.questionnaireForm()?.value?.get('pr_tags') as FormArray;
    const tagControl = tags?.at(index) as FormControl;
    tagControl.setValue(newValue.trim()); // Establecer el nuevo valor
    console.log('Tag edited:', tagControl.value); // Imprimir el valor editado
  }


  setIsLoading(loading: boolean){
    this.isLoading.set(loading);
  }


  async getCategoriesAndAddQuestion(){
    try{
      this.setIsLoading(true);
      await this.categoryS.getCategories();
      // this.categories.set(data);
      
      this.addQuestion(); // Add the first question by default
      
      
    }catch(e){
      console.error(e);
    }finally{
      this.setIsLoading(false);
    }
  }

  onSelectIndex(index: number){
    this.indexSelect.set(index); // Set the index of the selected question
  }

  addImage(evento: any) {

    // console.log('Selected option:', evento);
    const respuesta = evento.lastValue;
    
    const questionControl = (this.questionnaireForm()?.get('questions') as FormArray).at(this.indexSelect());
    questionControl.get('pr_img')?.patchValue(respuesta);
    // console.log('data form: ', this.questionnaireForm());
  }

  // onTest(){
  //   console.log('form', this.questionnaireForm() );
  //   console.log('questions', this.questions().value );
  // }

  loadingDATA(){
    this.questionnaireForm()!.get('questions')?.patchValue(this.QUESTIONS_MOCK);

  }
  
  
  async onSubmit(){
    if(this.questionnaireForm()!.invalid){
      this.questionnaireForm()!.markAllAsTouched();
      return;
    }

    const values = this.questionnaireForm()!.value.questions;
    console.log('Form Data:', values);

    try{
      this.setIsLoading(true); // Set loading state to true


      const data = await this.questionS.bulkInsertQuestions(values);
      console.log('Data inserted:', data);
    }catch(e){
      console.error('Error inserting data:', e);

    }finally{
      this.setIsLoading(false); // Set loading state to false
    }

  }

}
