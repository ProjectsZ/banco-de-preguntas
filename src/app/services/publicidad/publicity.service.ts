import { computed, inject, Injectable, signal } from '@angular/core';
import { Publicity } from 'src/app/interfaces/publicity.interface';
import { SupabaseService } from '../supabase/supabase.service';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class PublicityService {

  promos = signal<Publicity [] | null>(null);

  private supabaseS = inject(SupabaseService);
  private supabase = computed<SupabaseClient>(()=> this.supabaseS.getClient());

  constructor() { }

  async getPromos(r_name: any) {
    // Verifica si ya hay promociones cargadas
    if (this.promos()) {
      return;
    }
    
    console.log("--->role: ", r_name);
    // Consulta Supabase para traer solo publicidades donde el pub_audience contenga el nombre de usuario (u_name)
    const { data, count, error } = await this.supabase()
          .from('publicidad')
          .select('*', { count: 'exact' })
          .filter('pub_audience', 'cs', `["${ r_name }"]`)
          .order('pub_title', { ascending: true });

        console.log('Promos obtenidas:', data);
        console.log('Promos count:', count);
        console.log('Promos ERROR:', error);

      if (error) throw error;
  
    // Guarda las promociones en el signal u observable
    this.setPromos(data);
  
    return {
      data,
      total: count
    };
  }

  
  setPromos(value: any){
    this.promos.set(value);
  }

}
