import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonInput, IonItem, ToastController, IonModal, IonButton, IonList, IonAvatar, IonIcon, IonButtons, IonFooter, IonLabel, IonText } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { ValidatorData } from 'src/app/class/validator-data';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonText, IonInput,  IonIcon,
    CommonModule, FormsModule, ReactiveFormsModule, SpinnerComponent]
})
export class LoginPage implements OnInit {

  
  loginForm: FormGroup = new FormGroup({});

  isLoading = signal<boolean>(false); // Loading state

  private authS = inject(AuthService);

  // mascota
  messageCAT: {tipo: string, estado: boolean, message: string}[] = [
    { tipo: "hasUpperCase", estado: false, message: "al menos una letra mayúscula" },
    { tipo: "hasLowerCase", estado: false, message: "al menos una letra minúscula" },
    { tipo: "hasNumber", estado: false, message: "al menos un número" },
    { tipo: "hasSymbol", estado: false, message: "al menos un símbolo" }
  ]

  constructor(private validatorData: ValidatorData) {
    addIcons({
      closeOutline
    });
  }

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
      password: new FormControl('', [Validators.required, Validators.minLength(8),
        this.validatorData.passwordStrengthValidator ]),
      rememberMe: new FormControl(false)
    });
  }

  // validar una contraseña
  async onChangeWord(usrPassword: any) {
    if (!usrPassword) return;
  
    const hasUpperCase = /[A-Z]/.test(usrPassword);
    const hasLowerCase = /[a-z]/.test(usrPassword);
    const hasNumber = /[0-9]/.test(usrPassword);
    const hasSymbol = /[^A-Za-z0-9]/.test(usrPassword);
  
    const requisitos = [
      { tipo: "hasUpperCase", estado: hasUpperCase, message: "No contiene al menos una letra mayúscula" },
      { tipo: "hasLowerCase", estado: hasLowerCase, message: "No contiene al menos una letra minúscula" },
      { tipo: "hasNumber", estado: hasNumber, message: "No contiene al menos un número" },
      { tipo: "hasSymbol", estado: hasSymbol, message: "No contiene al menos un símbolo" }
    ];
  
    let faltantes = requisitos
      .filter(req => !req.estado)
      .map(req => req.message);
  

    if (faltantes.length > 0) {
      
      this.messageCAT = requisitos;

    } else {
      
      this.messageCAT = [
        { tipo: "hasUpperCase", estado: false, message: "al menos una letra mayúscula" },
        { tipo: "hasLowerCase", estado: false, message: "al menos una letra minúscula" },
        { tipo: "hasNumber", estado: false, message: "al menos un número" },
        { tipo: "hasSymbol", estado: false, message: "al menos un símbolo" }
      ];

    }
  
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
