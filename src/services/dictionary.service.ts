import { computed, inject, Injectable, signal } from '@angular/core';
import { Dictionary, DictionaryDescription } from '../interfaces/dictionary.interface';
import * as XLSX from 'xlsx';
import { SupabaseService } from './supabase/supabase.service';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class DictionaryService {

  dictionaries = signal<Dictionary [] | null>(null);

  private supabaseS = inject(SupabaseService);
  private supabase = computed<SupabaseClient>(()=> this.supabaseS.getClient());

  constructor() { }

  async getDictionary(searchNew: boolean = false){
    // Chequea si ya hay cursos cargados, si ya hay cursos, no hace falta volver a cargarlos
    if(this.dictionaries() && !searchNew){
      return;
    }

    // get data from supabase
    const { data, count, error } = await this.supabase()
        .from('diccionario')
        .select(`
          *,
          categorias (
            cat_subtitle,
            cat_title
          )
        `, { count: 'exact' })
        .order('dic_name', { ascending: true });
      // .range(0, 9);
    this.dictionaries.set(data); // Set the categories signal
    // console.log(data, count, error);
    // console.log("--> diccionario: ", this.dictionaries());

    if(error) throw error;

    this.setDictionary(data); // Set the categories signal

    return {
      data,
      total: count
    }
  }

  async getDictionaryByName(name: string){
    // Chequea si ya hay diccionarios cargados cargados, si ya hay cursos, no hace falta volver a cargarlos
    if(this.dictionaries()){
      return;
    }
    const data = await this.supabase()
        .from('diccionario')
        .select(`
          *,
          categorias (
            cat_subtitle,
            cat_title
          )
        `, { count: 'exact' })
        .eq('dic_name', name)
        .single();

      console.log('data Cap: ', data);

    if(data.error) throw data.error;

    return data;
  }

  setDictionary(value: any){
    this.dictionaries.set(value);
  }

  async importQuestionFromExcel(event: any){
      return new Promise((resolve, reject)=>{
        try{
          const file = event.target.files[0];
          if(!file){
            return reject(new Error('No se seleccionó ningún archivo'));
          }
  
          const reader = new FileReader();
  
          reader.onload = async (event: any) => {
            try{
              const data = new Uint8Array(event.target.result);
              const workbook = XLSX.read(data, { type: 'array' });
  
              if(workbook.SheetNames.length === 0){
                return reject(new Error('No sheets found in the file'));
              }
  
              const sheetName = workbook.SheetNames[0];
              const sheet = workbook.Sheets[sheetName];
  
              const jsonData: any[] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
              
              if(jsonData.length < 2){
                return reject(new Error('Data no valido en la hoja'));
              }
  
              const headers: string[] = jsonData[0];
              const requiredHeaders = ['dic_name','dic_description', 'dic_cat_id', 'dic_like', 'dic_img'];
  
              // check missing headers
              const missingHeaders = requiredHeaders.filter(
                header => !headers.includes(header)
              );
              if(missingHeaders.length > 0){
                return reject(new Error(`Missing required columns: ${missingHeaders.join(', ')}`));
              }
  
              // Process rows (excluding header row)
              const filteredData = jsonData.slice(1).filter(
                (row: any[]) => row.some(
                  (cell)=> cell !== undefined && cell !== ''
                )
              );
  
              if(filteredData.length === 0){
                return reject(new Error('No valid data found in the sheet'));
              }
  
              
              // convert data to required format
              const dic: Dictionary[] = filteredData.map(
                (row: any[], rowIndex: number) => {
                  console.log(row);
                  return {
                    dic_name: row[headers.indexOf('dic_name')] || '',
                    dic_description: (() => {
                      const raw = row[headers.indexOf('dic_description')];
                      if (typeof raw !== 'string') return [];
              
                      try {
                        // Intentamos parsear el string como JSON
                        const parsed = JSON.parse(raw);
              
                        // Verificamos si es un array y si tiene objetos en el formato correcto
                        return Array.isArray(parsed)
                          ? parsed
                              .map((significado: any) => {
                                return {
                                  text: significado.text.trim(),
                                  calification: significado.calification || 0, // Aseguramos que calification esté presente
                                  image: significado.image || '', // Aseguramos que image esté presente
                                };
                              })
                              .filter((significado: DictionaryDescription) => significado.text && significado.calification !== undefined)
                          : [];
                      } catch {
                        // Si ocurre un error al parsear, dividimos el string por comas
                        return raw.split(',').map(significado => ({ 
                          text: significado.trim(), 
                          calification: 0, 
                          image: '' 
                        })).filter(Boolean);
                      }
                    })(),
                    dic_cat_id: row[headers.indexOf('dic_cat_id')] || '',
                    dic_like: row[headers.indexOf('dic_like')] || 0,
                    dic_img: row[headers.indexOf('dic_img')] || '',
                  };
                }
              );
  
              if(dic.length === 0){
                return reject(new Error('La hoja *.XLS no contiene datos validos'));
              }
  
              // insert data
              await this.bulkInsertQuestions(dic);
              resolve(dic);
  
            }catch(e){
              reject(e);
            }
          };
          reader.readAsArrayBuffer(file);
        }catch(e){
          console.error(e);
          reject(e);
        }
      });
    }
  
    async bulkInsertQuestions(wordsAll: Dictionary[]){
      // return questions;
      try{
        const { data, error } = await this.supabase()
        .from('diccionario')
        .insert(wordsAll); 
  
        if(error){
          throw new Error(`Error al insertar palabras: ${error.message}`);
        }
  
        console.log(data);
        return data;
  
      }catch(e){
        console.log(e);
        throw e;
      }
  
    }

}
