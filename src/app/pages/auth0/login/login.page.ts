import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonInput, IonItem, ToastController, IonModal, IonButton, IonList, IonAvatar, IonIcon, IonButtons, IonFooter } from '@ionic/angular/standalone';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonInput,  CommonModule, FormsModule, ReactiveFormsModule, SpinnerComponent]
})
export class LoginPage implements OnInit {

  
  loginForm: FormGroup = new FormGroup({});

  isLoading = signal<boolean>(false); // Loading state

  private authS = inject(AuthService);

  constructor() { }

  ngOnInit() {
    this.loadingForm();
    this.recordPassword();
  }

  setIsLoading(loading: boolean){
    this.isLoading.set(loading);
  }

  recordPassword(){
    this.loginForm.get('email')?.setValue(localStorage.getItem('email'));
  }

  loadingForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@unas\\.edu\\.pe$')
      ]),
      password: new FormControl('', [Validators.required]),
      rememberMe: new FormControl(false)
    });
  }

  

  async onSubmit() {
    if (this.loginForm.invalid) {
      console.warn('Formulario inválido');
      return;
    }
  
    const { email, password, rememberMe } = this.loginForm.value;
  
    // Activar loading
    this.setIsLoading(true);
  
    try {
      const res: any = await this.authS.signIn(email, password);
      
      if (!res || !res.user) {
        console.warn('Login fallido: Usuario no encontrado');
        
        // this.mostrarToastRegistroExitoso("Error usuario no encontrado!","danger");  
        // Podrías mostrar una alerta aquí si quieres
        return;
      }
    
      if (rememberMe) {
        localStorage.setItem('email', email);
      } else {
        localStorage.removeItem('email');
      }

      // Aquí puedes redirigir o realizar acciones extra
    } catch (error: any) {
      console.error('Error durante login:', error?.message || error);
      // Puedes mostrar un toast, alerta, etc.
    } finally {
      this.setIsLoading(false); // Siempre apagar el loading
    }
  }

}
