import { computed, inject, Injectable, signal } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from '../supabase/supabase.service';
import { Category } from 'src/interfaces/category.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  categories = signal<Category[] | null>(null); // Signal to hold categories

  private supabaseS = inject(SupabaseService);
  private supabase = computed<SupabaseClient>(()=> this.supabaseS.getClient());


  constructor() { }

  async getCategories(){
    // return categories;
    if(this.categories()){
      return;
    }

    // get data from supabase
    const { data, count, error } = await this.supabase()
      .from('categorias')
      .select('*', { count: 'exact' });
      // .range(0, 9);
    console.log(data, count, error);

    if(error) throw error;

    this.setCategories(data); // Set the categories signal

    return {
      data,
      total: count
    }
  }

  async getCategories_crs(cat_crs_id: string){
    
    const { data, count, error } = await this.supabase()
      .from('categorias')
      .select('*', { count: 'exact' })
      .eq('cat_crs_id', cat_crs_id);
      // .range(0, 9);
      console.log(data, count, error);

      if(error) throw error;

      this.setCategories(data); // Set the categories signal

      return {
        data,
        total: count
      }

  }

  setCategories(value: any){
    this.categories.set(value);
  }

}
