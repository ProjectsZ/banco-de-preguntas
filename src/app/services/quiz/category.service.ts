import { computed, inject, Injectable, signal } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from '../supabase/supabase.service';
import { Category } from 'src/app/interfaces/category.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  categories = signal<Category[] | null>(null); // Signal to hold categories
  topics = signal<Category[] | null>(null); // Signal to hold temas
   

  select_cat_id = signal<string | null>(null); // Signal to hold selected category ID

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

  async getCategoriesById(cat_id: string){
    const { data, error } = await this.supabase()
      .from('categorias')
      .select('*')
      .eq('cat_id', cat_id)
      .single();

    if(error) throw error;

    return data;
  }

  // objeter todas las categorias con documentos (cat_doc)
  async getAllCategoriesWithCatDoc():Promise<boolean>{

    try{
      
        const { data, error } = await this.supabase().rpc('grouped_temas');

        if(error) throw error;

        this.topics.set(data);


      if(error) throw error;

      if(data){
        this.topics.set(data); // Set the topics signal
        console.log('Categorias con documentos:', data);
        return true;
      }else{
        return false;
      }

    }catch(error){
      console.error('Error al obtener las categorias con documentos:', error);
      return false;
    }

  }

  setCategories(value: any){
    this.categories.set(value);
  }

  setSelectCatId(value: string | null){
    this.select_cat_id.set(value);
  }


}
