import { computed, inject, Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { Question } from '../interfaces/question.interface';
import { SupabaseService } from './supabase/supabase.service';
import { SupabaseClient } from '@supabase/supabase-js';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  private supabaseS = inject(SupabaseService);
  private supabase = computed<SupabaseClient>(()=> this.supabaseS.getClient());

  constructor() {

   }

  async importQuestionFromExcel(event: any){
    return new Promise((resolve, reject)=>{
      try{
        const file = event.target.files[0];
        if(!file){
          return reject(new Error('No file selected'));
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
            const requiredHeaders = ['pr_question','pr_content', 'pr_difficulty', 'option1', 'option2', 'option3', 'option4', 'pr_answer', 'pr_type','pr_tags', 'pr_cat_id', 'pr_img'];

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
            const questions: Question[] = filteredData.map(
              (row: any[], rowIndex: number) => {
                console.log(row);
              return {
                pr_question: row[headers.indexOf('pr_question')] || '',
                pr_content: row[headers.indexOf('pr_content')] || '',
                pr_difficulty: row[headers.indexOf('pr_difficulty')] || 'easy',
                pr_options:[
                  row[headers.indexOf('option1')],
                  row[headers.indexOf('option2')],
                  row[headers.indexOf('option3')],
                  row[headers.indexOf('option4')]
                ].filter((opt)=> opt !== undefined && opt !== ''),
                pr_answer: row[headers.indexOf('pr_answer')] || '',
                pr_type: row[headers.indexOf('pr_type')] || '0',
                // pr_tags: row[headers.indexOf('pr_tags')] ? row[headers.indexOf('pr_tags')].split(',') : [],
                pr_tags: (() => {
                  const raw = row[headers.indexOf('pr_tags')];
                  if (typeof raw !== 'string') return [];
                
                  try {
                    const parsed = JSON.parse(raw);
                    return Array.isArray(parsed) ? 
                    parsed.map(tag => tag.trim()).filter(Boolean) : [];
                  } catch {
                    return raw.split(',').map(tag => tag.trim()).filter(Boolean);
                  }
                })(),
                pr_img: row[headers.indexOf('pr_img')] || '',
                pr_cat_id: row[headers.indexOf('pr_cat_id')] || '',
                // viewAnswer: false,
              };
            });

            if(questions.length === 0){
              return reject(new Error('No valid data found in the sheet'));
            }

            // insert data
            await this.bulkInsertQuestions(questions);
            resolve(questions);

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

  async bulkInsertQuestions(questions: Question[]){
    // return questions;
    try{
      const { data, error } = await this.supabase()
      .from('preguntas')
      .insert(questions)
      .select(); // <-- Esto es necesario para que 'data' no sea null

      if(error){
        throw new Error(`Error inserting questions: ${error.message}`);
      }

      console.log(data);
      return data;

    }catch(e){
      throw e;
    }

  }

  async getQuestionByContent(pr_id: string, pr_content: string): Promise<boolean> {
    try {
      const { error } = await this.supabase()
        .from('preguntas')
        .update({ pr_content })
        .eq('pr_id', pr_id);
  
      if (error) {
        console.error('Error al actualizar la pregunta:', error.message);
        return false;
      }
  
      console.log('Contenido de la pregunta actualizado correctamente');
      return true;
    } catch (err) {
      console.error('Error inesperado al actualizar:', err);
      return false;
    }
  }
  

}
