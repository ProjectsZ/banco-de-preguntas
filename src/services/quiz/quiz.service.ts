import { computed, inject, Injectable, signal } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { Duration } from 'src/app/class/duration';
import { SupabaseService } from '../supabase/supabase.service';
import { DataArr } from 'src/app/class/data-arr';
import { Question } from 'src/interfaces/question.interface';


@Injectable({
  providedIn: 'root'
})
export class QuizService {

  questions = signal<Question[] | null>(null);

  // timer
  examDuration = signal<any>(null);
  timeUp = signal<boolean>(false);
  durationSignal = signal<number>(0); // milliseconds
  formattedTimeSignal = signal<string>('00:00:00'); // tiempo formateado como HH:mm:ss
  private timerInterval: any;
  
  // toast mensaje
  private supabaseS = inject(SupabaseService);
  private supabase = computed<SupabaseClient>(()=> this.supabaseS.getClient());

  masterSettings = {
    questionMaxLimit: 100,
    correctAnswerPoint: 1.0,
    wrongAnswerPoint: -0.25,
    defaultTiming: '00:02',
  };


  constructor(private duration: Duration, private dataArr: DataArr) {
  }

  async getQuestion_cat(cat_id: string){
    
    const {  count } = await this.supabase()
      .from('preguntas')
      .select('*', { count: 'exact' })
      .eq('pr_cat_id', cat_id);
      // .range(0, 9);

      this.masterSettings.questionMaxLimit = count!;

      return count;

  }


  async fetchQuestions(formValue: { question_count: number; pr_cat_id: string; duration: any }) {
    try{
        // filter questions by category_id
        // let filteredQuestions = questions.filter(
        //   (question) => question.pr_cat_id === formValue.pr_cat_id);

        // // get the first X questions based on question_count
        // const selectedQuestions = filteredQuestions.slice(0, formValue.question_count);
        console.log("------------------> " + formValue.duration);

        const { data, error } = await this.supabase().rpc('random_questions', {
          count: formValue.question_count,
          cat_id: formValue.pr_cat_id,
        });

        if(error) throw error;

        // const selectedQuestions = data;
        // Mezclar las opciones de cada pregunta
        const selectedQuestions = data.map((question: any) => {
          // Mezcla aleatoriamente las opciones de cada pregunta utilizando el algoritmo Fisher-Yates
          const shuffledOptions = this.dataArr.shuffleArray(question.pr_options);
          // Retorna la pregunta con las opciones mezcladas
          return { ...question, pr_options: shuffledOptions, viewAnswer: false };
        });

        this.questions.set(selectedQuestions);

        console.log(selectedQuestions);

        const duration = formValue.duration;
        this.examDuration.set(duration);
        this.startTimer(duration);

        return selectedQuestions;
    }catch(error){
        console.log('Error fetching questions', error);
        // return null;
        throw error;
    }
  }

  startTimer(duration: string): void{
    const parsedDuration = this.duration.parseDuration(duration);

    if(parsedDuration === 0){
      console.log('Formato de duración no válido');
      return;
    }

    this.formatDuration(parsedDuration);

    this.stopTimer();
    // start the countdown
    this.timerInterval = setInterval(()=> {
      const currentDuration = this.durationSignal();

      if(currentDuration <= 0){
        // clearInterval(this.timerInterval); // Stop the timer
        this.stopTimer(); // Stop the timer
        this.setFormatTimeSignal('00:00:00'); // Reset formatted time to 00:00:00

        this.timeUp.set(true); // Set time up signal to true
      }else{
        this.formatDuration(currentDuration - 1000); // Decrease duration by 1 second (1000 milliseconds) 
      }
    }, 1000);

  }

  stopTimer(): void{
    // clear any existing timer
    if(this.timerInterval){
      clearInterval(this.timerInterval);
    }
  }

  formatDuration(value: number){
    this.durationSignal.set(value);
    this.setFormatTimeSignal(this.duration.formatTime(this.durationSignal())); // Update formatted time
  }

  setFormatTimeSignal(value: string){
    this.formattedTimeSignal.set(value);
  }


  selectedAnswer(option: string | null, questionIndex: number): void {
    this.questions.update((questions)=> {
      if(!questions) return questions;

      if(option){
        questions[questionIndex].selectedAnswer = option;
      }else{
        delete questions[questionIndex].selectedAnswer;
      }

      return questions;
    });

    console.log('updated questions', this.questions());

  }

  calculateQuizResults(){
    const questions = this.questions()!;

    const correctAnswersCount = questions.filter((q)=> q.selectedAnswer === q.pr_answer).length;
    const wrongAnswersCount = questions.filter((q)=> q.selectedAnswer && q.selectedAnswer !== q.pr_answer).length; 
    const skippedAnswersCount = questions.filter((q)=> !q.selectedAnswer).length;
    // calculate time taken
    const totalDurationsMs = this.duration.parseDuration(this.examDuration()); // Total duration of the exam
    const remainingTime = this.durationSignal();
    const timeTakenInMs = totalDurationsMs - remainingTime;

    const formattedTimeTaken = this.duration.formatTime(timeTakenInMs);
    const formattedActualDuration = this.duration.formatTime(totalDurationsMs);

    const totalPoints = questions.length * this.masterSettings.correctAnswerPoint;
    const correctAnswerPoints = correctAnswersCount * this.masterSettings.correctAnswerPoint;
    const wrongAnswerPoints = wrongAnswersCount * this.masterSettings.wrongAnswerPoint;

    const score = correctAnswerPoints + wrongAnswerPoints;

    const data = {
      total_questions: questions.length,
      skipped: skippedAnswersCount,
      wrong: wrongAnswersCount,
      correct: correctAnswersCount,
      timeTaken: formattedTimeTaken,
      actualDuration: formattedActualDuration,
      score,
      totalPoints
    }

    // console.log(data);
    
    return data;
  }

  restart(){
    this.questions.update((currentQuestions)=>
    currentQuestions!.map((question)=>{
      // Create a anew object without selectedAnswer
      const shuffledOptions = this.dataArr.shuffleArray(question.pr_options);
      // Retorna la pregunta con las opciones mezcladas
      question.pr_options = shuffledOptions;
      
      const { selectedAnswer, ...rest } = question;

      return rest;
    }));

    console.log('restarted questions', this.questions());

    // restart timer
    this.startTimer(this.examDuration());
  }

  // filtrando las preguntas respondidas (all, correct, wrong y skipped)
  filterAnswers(value: string): Question[]{
    const questions = this.questions()!;

    let filteredQuestions: Question[] = questions;

    // if( value === 'all'){
    //   filteredQuestions = questions;
    // } else 
    if(value === 'correct'){
      filteredQuestions = questions.filter((q)=> q.selectedAnswer === q.pr_answer);      
    } else if(value === 'wrong'){
      filteredQuestions = questions.filter((q)=> q.selectedAnswer && q.selectedAnswer !== q.pr_answer);      
    } else if(value === 'skipped'){
      filteredQuestions = questions.filter((q)=> !q.selectedAnswer);
    }

    return filteredQuestions
  }

  markAnswer(index: number){
    this.questions.update((currentQuestions)=>
      currentQuestions!.map((question, i)=> {
        if(i === index){
          // toggle the marked field, inicializing it to true if not present
          return {
            ...question,
            marked: question?.marked? !question.marked: true
          }
        }

        return question;
        
      })
    );
  }

  reset(){
    this.stopTimer();
    this.examDuration.set(null);
    this.durationSignal.set(0);
    this.timeUp.set(false);
    this.formattedTimeSignal.set('00:00:00');
    this.questions.set(null);
    
  }


  /************************************************************************** */
  async getExamsQuestion(dataExam: any, duration: string): Promise<any> {
    // Obtener los pr_id del array exm_pr
    const prIds = dataExam.exm_pr.map((item: any) => item.pr_id);  // Extraer solo los pr_id
  
    // Realizar la consulta a la tabla 'preguntas' filtrando solo por los pr_id
    const { data: preguntas, error } = await this.supabase()
      .from('preguntas')
      .select('pr_id, pr_question, pr_content, pr_img, pr_difficulty, pr_options, pr_answer, pr_type, pr_tags, pr_cat_id, created_at')
      .in('pr_id', prIds);  // Filtra solo por los pr_id en el array
  
    if (error) {
      console.error('Error al obtener las preguntas:', error.message || error);
      return null;
    } else {
      // Ahora puedes transformar los datos
      const transformedExmPr = dataExam.exm_pr.map((pr: any) => {
        const pregunta = preguntas.find(p => p.pr_id === pr.pr_id);
        
        if (pregunta) {
          return {
            pr_point: pr.pr_point,
            pr_id: pr.pr_id,
            pr_question: pregunta.pr_question,
            pr_content: pregunta.pr_content,
            pr_img: pregunta.pr_img || '',
            pr_difficulty: pregunta.pr_difficulty,
            pr_options: pregunta.pr_options || [],
            pr_answer: pregunta.pr_answer,
            pr_type: pregunta.pr_type,
            pr_tags: pregunta.pr_tags || [],
            pr_cat_id: pregunta.pr_cat_id,
            created_at: pregunta.created_at
          };
        }
        return null;  // En caso de que no se encuentre la pregunta
      }).filter((item: any) => item !== null);  // Filtrar los nulls en caso de que no se encuentre la pregunta
  
      // Devolver los datos transformados
      this.questions.set(transformedExmPr);
      console.log('Examen transformado con preguntas:', transformedExmPr);
      this.examDuration.set(duration);
      this.startTimer(duration);
  
      return transformedExmPr;
    }
  }

  selectOptionsAndAnswer(question: Question): { opcion1: string; opcion2: string } | undefined {
    // para que sea de opcioens multipels
    if (!question || !question.pr_options || question.pr_options.length === 0) {
      return;
    }
  
    // Eliminar la respuesta correcta de las opciones para elegir una incorrecta
    const incorrectOptions = question.pr_options.filter(opt => opt !== question.pr_answer);
  
    if (incorrectOptions.length === 0) {
      // Si solo existe la respuesta correcta, en caso de que la pregunta sea para introducir la respuesta
      return {
        opcion1: question.pr_answer,
        opcion2: question.pr_answer
      };
    }
  
    // Elegir una opción incorrecta aleatoria
    const randomIndex = Math.floor(Math.random() * incorrectOptions.length);
    const randomIncorrectOption = incorrectOptions[randomIndex];
  
    // Crear un array con la respuesta correcta y una incorrecta
    const mixedOptions = [question.pr_answer, randomIncorrectOption];
    mixedOptions.sort(() => Math.random() - 0.5); // Mezclar las dos opciones aleatoriamente
  
    return {
      opcion1: mixedOptions[0],
      opcion2: mixedOptions[1]
    };
  }

}
