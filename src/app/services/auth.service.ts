
import { computed, inject, Injectable, signal } from '@angular/core';
import { Dictionary } from '../interfaces/dictionary.interface';
import { SupabaseService } from './supabase/supabase.service';
import { SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment.prod';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { d } from '@angular/core/weak_ref.d-Bp6cSy-X';
import { ToastService } from '../components/toast/toast.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  login = signal<any | null>(null);

  private supabaseS = inject(SupabaseService);
  private supabase = computed<SupabaseClient>(()=> this.supabaseS.getClient());

  private router = inject(Router);
  private toastS = inject(ToastService);

  // usuario permisos
  public currentUser: BehaviorSubject<any> = new BehaviorSubject(null);
  public currentUser22: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor() {
    this.loadUser();

    this.currentUser.next({
      "usr_id": "f7238fb4-b562-4cca-986d-a6f59fea24fd",
      "usr_username": "freddy.pizarro",
      "usr_email": "freddy.pizarro@unas.edu.pe",
      "usr_password": "NOT NULL",
      "usr_recoverytoken": null,
      "usr_is_google_authenticated": false,
      "usr_is_active": true,
      "usr_r_id": {
          "r_id": "7585f668-a91a-4786-9b49-2d6a6452b918",
          "r_name": "ESTUDIANTE",
          "r_level": 1,
          "r_description": "Acceso total al sistema, incluyendo gestión de usuarios y contenido.",
          "r_permissions": [
              "can_create_exam",
              "can_edit_course",
              "can_manage_users",
              "can_view_results",
              "can_edit_roles"
          ]
      },
      "usr_infp_id": {
          "infp_id": "a11684de-c0eb-4a98-98a5-03dc09bb7661",
          "infp_firstname": "Fred",
          "infp_lastname": "Pizarro Salome",
          "infp_phone": "964408262",
          "infp_address": "Residencia UNAS",
          "infp_birthday": "2005-12-25",
          "infp_img": "https://fredpizarro.github.io/imgs/FredPizarro.jpg",
          "created_at": "2025-04-21T04:29:07.535438"
      },
      "created_at": "2025-04-21T04:32:32.494189",
      "updated_at": null,
      "usr_coin": 12345
  });
  }

  loadUser() {
    const token = localStorage.getItem('x-token');
    const userStr = localStorage.getItem('user');
  
    if (token && !this.isTokenExpired(token) && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUser.next(user);
      } catch (e) {
        console.error('Error al parsear el usuario:', e);
        this.currentUser.next(false);
      }
    } else {
      this.currentUser.next(false);
    }
  }

  async onLogin(email:string, pass: string){
    // login auth email
    await this.supabase().auth.signInWithPassword({
        email: email,
        password: pass
      })
      .then(({data, error})=>{
        if(error) throw error;
        console.log(data);
        if(data.session){
          this.login.set(data.session.user);
          localStorage.setItem('x-token', data.session.access_token);
          localStorage.setItem('email', data.session.user.email? data.session.user.email : '');
          this.router.navigate(['/tabs/tab1']);
        }
      })
      .catch((error) => {
        console.error('Error al iniciar sesión:', error.message);
      });

  }

  async changePassword({ usr_email, usr_password, usr_newPassword,}: 
                       { usr_email: string; usr_password: string; usr_newPassword: string; }): Promise<boolean> {
    try {
      // Primero, verifica que la contraseña actual es correcta autenticando de nuevo
      const { data: loginData, error: loginError } = await this.supabase().auth.signInWithPassword({
        email: usr_email,
        password: usr_password,
      });
      
      if (loginError) {
        // console.error('Contraseña actual incorrecta:', loginError.message);
        this.toastS.openToast("Contraseña actual incorrecta","danger");
        return false;
      }

      // validad que la nueva contraseña sea diferente a la actual
      if (usr_password === usr_newPassword) {
        this.toastS.openToast("La nueva contraseña no puede ser igual a la actual","danger");
        return false;
      }
  
      // Cambia la contraseña
      const { data: updateData, error: updateError } = await this.supabase().auth.updateUser({
        password: usr_newPassword,
      });
  
      if (updateError) {        
        this.toastS.openToast("error usuario","danger");
        // console.error('Error al cambiar la contraseña:', updateError.message);
        return false;
      }
      this.toastS.openToast("Datos correctos, ingrese nuevamente!! ...","success");

      setTimeout(() => {
        this.logout();
      }, 4100);

      // console.log('Contraseña actualizada:', updateData);
      return true;
  
    } catch (err: any) {
      console.error('Error inesperado:', err.message);
      return false;
    }
  }


  logout() {
    this.supabase().auth.signOut();
    
    localStorage.removeItem('x-token');
    this.router.navigate(['/login']);

  }

  getToken(): string | null {
    const token = localStorage.getItem('x-token');
    if (token && !this.isTokenExpired(token)) {
      return token;
    }
    return null;
  }

  isTokenExpired(token: string): boolean {
    if (!token) {
      return true; // No token => considerado vencido
    }

    try {
      const decoded: any = jwtDecode(token);
      const exp = decoded.exp;
      const now = Date.now() / 1000;

      return exp < now;  // true si está vencido
    } catch (error) {
      return true; // Token inválido => considerado vencido
    }
  }

  isTokenValid(token: string): boolean {
    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Math.floor(new Date().getTime() / 1000);
      return decoded.exp > currentTime;
    } catch (error) {
      return false;  // Token corrupto o modificado manualmente.
    }
  }

  getValidToken(): string | null {
    const token = localStorage.getItem('x-token');
    if (!token) return null;
  
    try {
      const decoded: any = jwtDecode(token);
      const now = Math.floor(Date.now() / 1000);
      if (decoded.exp > now) {
        return token;
      } else {
        this.logout();
        return null;
      }
    } catch (e) {
      this.logout();
      return null;
    }
  }

  // --------------------------------------------------------------------
  async signIn(email: string, pass: string): Promise<void> {
    try {
      const { data, error } = await this.supabase().auth.signInWithPassword({
        email,
        password: pass,
      });
  
      if (error) throw error;
  
      if (data.session) {
        this.login.set(data.session.user);

        const { data: userData, error } = await this.supabase()
        .from('usuarios')
        .select(`*,
          usr_coin,
          usr_username,
          usr_email,
          usr_is_active,
          usr_r_id (
            r_id,
            r_name, 
            r_description, 
            r_level, 
            r_permissions
          )`)
        .eq('usr_id', data.session.user.id)  // Aseguramos que se traiga solo el usuario actual
        .single();  // Solo esperamos un resultado con esto si se imprime pero con el usr_infp_id  me bota null todo
        // const dataInfo = await this.supabase()
        //   .from('informacion_personal')
        //   .select('*', { count: 'exact' });
        if(userData.usr_infp_id){
          const { data: userInfo, error } = await this.supabase()
          .from('informacion_personal')
          .select(`*,
              infp_id,
              infp_firstname,
              infp_address,
              infp_birthday,
              infp_img,
              infp_lastname,
              infp_phone
            `)
          .eq('infp_id', userData.usr_infp_id)  // Aseguramos que se traiga solo el usuario actual
          .single();  // Solo esperamos un resultado con esto si se imprime pero con el usr_infp_id  me bota null todo
          
          if(userInfo){
            userData.usr_infp_id = userInfo;
          }
        }

        // console.log(userData);

        // Guardar token y email
        localStorage.setItem('x-token', data.session.access_token);
        localStorage.setItem('email', data.session.user.email || '');
  
        // Guardar usuario
        // localStorage.setItem('user', JSON.stringify(userObj));
        this.currentUser.next(userData);

        // console.log(this.currentUser);
  
        // console.log('Usuario autenticado:', userObj);


        this.toastS.openToast("usuario correcto","success");  
        this.router.navigateByUrl('/tabs/tab1', { replaceUrl: true });
      }
    } catch (err: any) {
      console.error('Error al iniciar sesión:', err.message || err);
      this.toastS.openToast("error usuario","danger");  
    }
  }


  // Access the current user
  getUser() {
    // console.log(this.currentUser);
    return this.currentUser.asObservable();
  }

  // Remove all information of the previous user
  logOut() {
    localStorage.removeItem('x-token');
    this.currentUser.next(false);
    this.router.navigateByUrl('/', { replaceUrl: true });
  }

  // Check if a user has a certain permission
  hasPermission(permissions: string[]): boolean {
    for (const permission of permissions) {
      if (!this.currentUser.value || !this.currentUser.value.usr_r_id.r_permissions.includes(permission)) {
        return false;
      }
    }
    return true;
  }


  /////////////////////// editar coin
  updateCoin(usr_id: string, payment: number = 1, bono: number = 0): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      (async () => {
        try {
          // Obtener saldo actual
          const { data: userData, error: fetchError } = await this.supabase()
            .from('usuarios')
            .select('usr_coin')
            .eq('usr_id', usr_id)
            .single();
  
          if (fetchError || !userData) {
            console.error('Error al obtener el saldo actual:', fetchError?.message);
            observer.next(false);
            return;
          }
  
          const nuevoSaldo = userData.usr_coin - payment + bono;
  
          // Actualizar saldo
          const { error: updateError } = await this.supabase()
            .from('usuarios')
            .update({ usr_coin: nuevoSaldo })
            .eq('usr_id', usr_id);
  
          if (updateError) {
            console.error('Error al actualizar saldo:', updateError.message);
            observer.next(false);
          } else {
            console.log('Saldo actualizado correctamente');
  
            // Actualizamos la data del usuario
            this.currentUser.next({
              ...this.currentUser.getValue(),
              usr_coin: nuevoSaldo
            });
  
            observer.next(true);
          }
  
        } catch (err) {
          console.error('Error inesperado en try/catch:', err);
          observer.next(false);
        } finally {
          observer.complete();
        }
      })();
    });
  }

  // editar datos personales
  async updatePersonalData(usr_id: string, datosPersonales: any): Promise<boolean> {
    try {
      // 1. Obtener datos del usuario
      const { data: userData, error: userError } = await this.supabase()
        .from('usuarios')
        .select('*')
        .eq('usr_id', this.currentUser.value.usr_id)
        .single();
  
      if (userError) {
        console.error('Error al obtener los datos del usuario:', userError.message);
        this.toastS.openToast("error usuario", "danger","angry",false);
        return false;
      }
  
      const usr_infp_id = userData.usr_infp_id;


      const { infp_firstname, infp_lastname, infp_phone, infp_address, infp_birthday } = datosPersonales;
  
      // 2. Si no tiene información personal, crearla
      if (!usr_infp_id) {
        const { data: newInfo, error: createError } = await this.supabase()
          .from('informacion_personal')
          .insert({
            infp_firstname,
            infp_lastname,
            infp_phone,
            infp_address,
            infp_birthday
          })
          .select('*')
          .single();
  
        if (createError) {
          console.error('Error al crear la información personal:', createError.message);
          this.toastS.openToast("Error al crear la información personal", "danger");
          return false;
        }
  
        // 3. Actualizar el campo usr_infp_id en usuarios
        const { error: updateError } = await this.supabase()
          .from('usuarios')
          .update({ usr_infp_id: newInfo.infp_id })
          .eq('usr_id', usr_id)
          .single();
  
        if (updateError) {
          console.error('Error al actualizar el usuario:', updateError.message);
          this.toastS.openToast("Error al actualizar el usuario", "danger");
          return false;
        }
  
        // 4. Actualizar estado del usuario
        const updatedUser = {
          ...this.currentUser.value,
          usr_infp_id: newInfo.infp_id,
        };
        this.currentUser.next(updatedUser);
  
        this.toastS.openToast("Datos personales agregados correctamente", "success");
      }
  
      // 5. Actualizar datos personales
      const { error: updatePersonalError } = await this.supabase()
        .from('informacion_personal')
        .update({
          infp_firstname,
          infp_lastname,
          infp_phone,
          infp_address,
          infp_birthday,
        })
        .eq('infp_id', usr_infp_id);
  
      if (updatePersonalError) {
        console.error('Error al actualizar los datos personales:', updatePersonalError.message);
        this.toastS.openToast("Error al actualizar los datos personales", "danger");
        return false;
      }
  
      this.toastS.openToast("Datos personales actualizados correctamente", "success");
  
      // 6. Actualizar el estado en el BehaviorSubject
      this.currentUser.next({
        ...this.currentUser.value,
        usr_infp_id: {
          ...this.currentUser.value.usr_infp_id,
          infp_firstname,
          infp_lastname,
          infp_phone,
          infp_address,
          infp_birthday,
        },
      });
  
      return true;
  
    } catch (err) {
      console.error('Error inesperado:', err);
      return false;
    }
  }
  
  
}