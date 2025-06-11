import { computed, inject, Injectable, signal } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from '../supabase/supabase.service';
import { Category } from 'src/app/interfaces/category.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  categories = signal<Category[] | null>(null); // Signal to hold categories

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
  async getAllCategoriesWithCatDoc(){

    try{
      const { data, error } = await this.supabase()
        .from('categorias')
        .select('*, cat_doc(*)')
        .order('cat_id', { ascending: true });

      if(error) throw error;

      return data;

    }catch(error){
      console.error('Error al obtener las categorias con documentos:', error);
      throw error;
    }

  }

  setCategories(value: any){
    this.categories.set(value);
  }

  setSelectCatId(value: string | null){
    this.select_cat_id.set(value);
  }


}
