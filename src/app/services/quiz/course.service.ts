import { computed, inject, Injectable, signal } from '@angular/core';
import { Course } from 'src/app/interfaces/course.interface';
import { SupabaseService } from '../supabase/supabase.service';
import { SupabaseClient } from '@supabase/supabase-js';
import { ToastService } from 'src/app/components/toast/toast.service';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  courses = signal<Course [] | null>(null);

  private supabaseS = inject(SupabaseService);
  private supabase = computed<SupabaseClient>(()=> this.supabaseS.getClient());

  toastS = inject(ToastService);

  constructor() { }

  async getCourses(){
    // Chequea si ya hay cursos cargados, si ya hay cursos, no hace falta volver a cargarlos
    if(this.courses()){
      return;
    }

    // get data from supabase
    const { data, count, error } = await this.supabase()
      .from('cursos')
      .select('*', { count: 'exact' })
      .order('crs_name', { ascending: true });
      // .range(0, 9);
    console.log(data, count, error);

    if(error) {
      if(error.message === "TypeError: Failed to fetch"){
        this.toastS.openToast('Error al cargar datos o su linea de internet esta muy lento!', 'danger', 'sad');
      }
      throw error;
    };

    this.setCourses(data); // Set the categories signal

    return {
      data,
      total: count
    }
  }

  setCourses(value: any){
    this.courses.set(value);
  }

}
