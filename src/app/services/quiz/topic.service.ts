import { computed, inject, Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';
import { SupabaseService } from '../supabase/supabase.service';
import { Question } from 'src/app/interfaces/question.interface';

// Definimos la interfaz para una Pregunta aquí mismo para simplicidad.
// Idealmente, esto estaría en su propio archivo (e.g., `src/app/models/pregunta.model.ts`)

@Injectable({
  providedIn: 'root'
})
export class TopicService {

  private supabaseS = inject(SupabaseService);
  private supabase = computed<SupabaseClient>(()=> this.supabaseS.getClient());


  constructor() {}

  /**
   * Obtiene una lista paginada de preguntas, opcionalmente filtrada por categoría.
   * Llama a la función `get_preguntas_paginadas` en Supabase.
   * @param options - Opciones de paginación y filtro.
   * @param options.limit - El número de preguntas a devolver.
   * @param options.offset - El número de preguntas a omitir (para paginación).
   * @param options.categoryId - El ID de la categoría para filtrar las preguntas (opcional).
   * @returns Una promesa que se resuelve con la lista de preguntas.
   */
  async getPreguntasPaginadas({ limit = 10, offset = 0, categoryId = null }: { limit?: number; offset?: number; categoryId?: string | null }): Promise<Question[]> {
    const params: any = {
      p_limit: limit,
      p_offset: offset
    };

    // El parámetro p_cat_id debe ser NULL si no se proporciona un valor, 
    // ya que así lo espera la función de base de datos.
    params.p_cat_id = categoryId;

    const { data, error } = await this.supabase().rpc('get_preguntas_paginadas', params);

    if (error) {
      console.error('Error fetching paginated questions:', error.message);
      throw new Error(`Failed to fetch questions: ${error.message}`);
    }

    return data || [];
  }
}
