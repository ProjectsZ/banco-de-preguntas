import { computed, inject, Injectable, signal } from '@angular/core';
import { Exam, PreguntasEnExamen } from '../interfaces/exam.interface';
import { SupabaseService } from './supabase/supabase.service';
import { SupabaseClient } from '@supabase/supabase-js';
import { Question } from '../interfaces/question.interface';
import { Observable } from 'rxjs';
import { ToastService } from '../components/toast/toast.service';

@Injectable({
  providedIn: 'root'
})
export class ExamService {

  exams = signal<Exam[]>([]); // Signal to hold categories

  private supabaseS = inject(SupabaseService);
  private supabase = computed<SupabaseClient>(()=> this.supabaseS.getClient());

  private toastS = inject(ToastService); // Assuming you have a ToastService for notifications

  constructor() { }

  async getExams(usr_id: string, searchNew:boolean = false): Promise<{ data: Exam[] | null, total: number } | void> {
    // return categories;
    if((this.exams().length > 0) && !searchNew){
      return { data: this.exams(), total: this.exams().length };
    }

    // get data from supabase
    const { data, count, error } = await this.supabase()
    .from('examenes')
    .select('*', { count: 'exact' })  // Seleccionamos todos los campos y contamos los registros
    .eq('exm_usr_id', usr_id);


      // .range(0, 9);
    console.log(data, count, error);

    if(error) throw error;

    this.setExams(data); // Set the categories signal

    return {
      data,
      total: count || 0
    }
  }

  

  setExams(value: any){
    this.exams.set(value);
  }

  updateExamOfState(exm_id: string, currentState: 'public' | 'private'): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      // Llamamos a una función async dentro del constructor del observable
      (async () => {
        try {
          const { error } = await this.supabase()
            .from('examenes')
            .update({ exm_state: currentState })
            .eq('exm_id', exm_id);

          if (error) {
            console.error('Error al actualizar estado del examen:', error.message);
            observer.next(false);
          } else {
            console.log('Estado del examen actualizado correctamente');
            observer.next(true);
          }
        } catch (err) {
          console.error('Error inesperado en try/catch:', err);
          observer.next(false);
        } finally {
          observer.complete(); // Cerramos el observable
        }
      })(); // Ejecutamos la IIFE async
    });
  }

  async createExam(usr_id: string, exam: Exam): Promise<{ data: Exam | null, error: any }> {
    try {
      const { data, error } = await this.supabase()
        .from('examenes')
        .insert({
          exm_usr_id: usr_id,
          exm_name: exam.exm_name,
          exm_description: exam.exm_description,
          exm_duration: "05:15",
          exm_state: exam.exm_state,
          exm_pr: [],
          exm_access: [],
          exm_crs_id: exam.exm_crs_id
        })
        .select('*')
        .single(); // Esperamos un solo registro

      if (error){
        this.toastS.openToast("error al agregar examen", "danger","angry",true);
        throw error
      };

      // Actualizar la señal de exámenes
      this.setExams([...this.exams(), data]);

      return { data, error };
    } catch (err) {
      console.error("Error en createExam:", err);
      return { data: null, error: err };
    }
  }

  
  async addQuestionFromExam(exm: Exam, examPR: { pr_id: string | any, pr_point: number }, usr_id: string) {
    try {
      // Asegurar que exm.exm_pr sea un array
      let dataPRExam: PreguntasEnExamen[] = Array.isArray(exm.exm_pr) ? [...exm.exm_pr] : [];
      
      // Agregar nueva pregunta
      dataPRExam.push({ pr_id: examPR.pr_id, pr_point: examPR.pr_point });
  
      // Actualizar en base de datos
      await this.supabase()
        .from('examenes')
        .update({ exm_pr: dataPRExam })
        .eq('exm_id', exm.exm_id)
        .single(); // Esperamos un solo registro
  
      // Recuperar exámenes actualizados
      await this.getExams(usr_id);
    
      return {
        updataBoleam: true
      };
  
    } catch (err) {
      this.toastS.openToast("Error al agregar examen", "danger","angry",true);
      console.error("Error en addQuestionFromExam:", err);
      return {
        updataBolean: false
      };
      
    }
  }
  


}