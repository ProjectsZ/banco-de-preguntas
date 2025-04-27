import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {

  private supabaseC: SupabaseClient | null = null;

  constructor() {
  }

  private initializeClient(): void {
    if(!this.supabaseC){
      this.supabaseC = createClient(
        environment.supabase.url,
        environment.supabase.key,
      );
    }
  }

  getClient(): SupabaseClient {
    this.initializeClient();
    return this.supabaseC!;

  }

}
