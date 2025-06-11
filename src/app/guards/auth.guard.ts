import { Injectable } from '@angular/core';
import { CanActivate, Router  } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AlertController } from '@ionic/angular';
import { ActivatedRouteSnapshot } from '@angular/router';
import { filter, map, take } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  // constructor(private router: Router) {}

  // canActivate(): boolean {
  //   const token = localStorage.getItem('x-token');

  //   if (token) {
  //     return true;  // Permitir acceso
  //   } else {
  //     this.router.navigate(['/login']);  // Redirigir al login
  //     return false;
  //   }
  // }

  constructor(private router: Router, 
              private authS: AuthService, 
              private alertC: AlertController) { }


    canActivate(route: ActivatedRouteSnapshot) {
      // Get the potentially required role from the route
     // const expectedRole = route.data?.role || null;
       const expectedRole = route.data['role'] || null;
      // console.log(route.data);
      return this.authS.getUser().pipe(
        filter(val => val !== null), // Filter out initial Behaviour subject value
        take(1),
        map(user => {
          // console.log("---->USER: ", user);
          if (!user) {
            this.showAlert();
            console.error('No hay usuario logueado');
            return this.router.parseUrl('/login');
          } else {
            let role = user.usr_r_id.r_name;
            // console.log("---->ROLE: ", role);
            if (!expectedRole || expectedRole == role) {
              return true;
            } else {
              this.showAlert();              
             localStorage.removeItem('x-token');
             localStorage.setItem('x-token', '');
              return false;
            }
          }
        })
      )
  }

  async showAlert() {
      let alert = await this.alertC.create({
        header: 'Acceso denegado',
        message: 'Tu no estas autorizado para ver esta pagina',
        buttons: ['OK']
      });
      alert.present();
  }


}