import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonSelectOption, IonSelect, IonHeader, IonTitle, IonToolbar, IonSegmentButton, IonLabel, IonItem, IonButton, IonInput, IonCardHeader, IonCard, IonSegment, IonButtons, IonDatetime, IonIcon, IonText } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowBack, arrowBackCircle, closeOutline, diamondOutline, refreshOutline } from 'ionicons/icons';
import { User } from 'src/app/interfaces/user.interface';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ToastComponent } from 'src/app/components/toast/toast.component';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { ToastService } from 'src/app/components/toast/toast.service';
import { ValidatorData } from 'src/app/class/validator-data';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonText, IonIcon, IonButtons, IonSegment, IonSelect, IonDatetime,  IonSelectOption, IonInput, IonButton, IonItem, IonLabel, IonSegmentButton, IonContent, IonHeader, IonTitle, IonToolbar, 
    CommonModule, FormsModule, ReactiveFormsModule, SpinnerComponent]
})
export class RegisterPage implements OnInit, OnDestroy {

  selectedTab = signal<string>('usuario'); // Signal to hold the selected tab
  editDataPersonalForm!: FormGroup;

  private router = inject(Router);

  //user
  currentUser!: User;
  private userSubscription: Subscription | null = null; // Suscripción al BehaviorSubject del servicio
  editRegisterForm!: FormGroup;
  private authS = inject(AuthService);
  private toastS = inject(ToastService);

  // loading  
  isLoading = signal<boolean>(false); // Loading state

  personalidadCAT: { color: string, feeling: string, nivel_state: number, message: string } = {
    color: 'success',
    feeling: 'happy',
    nivel_state: 0,
    message: ' (*) Miau... aquí tienes el formulario para cambiar tu contraseña, humano. ¡Hazlo con cuidado, que no quiero maullar por un error!'
  };

    // mascota
    messageCAT1: {tipo: string, estado: boolean, message: string}[] = [
      { tipo: "hasUpperCase", estado: false, message: "al menos una letra mayúscula" },
      { tipo: "hasLowerCase", estado: false, message: "al menos una letra minúscula" },
      { tipo: "hasNumber", estado: false, message: "al menos un número" },
      { tipo: "hasSymbol", estado: false, message: "al menos un símbolo" }
    ]

    messageCAT2: {tipo: string, estado: boolean, message: string}[] = [
      { tipo: "hasUpperCase", estado: false, message: "al menos una letra mayúscula" },
      { tipo: "hasLowerCase", estado: false, message: "al menos una letra minúscula" },
      { tipo: "hasNumber", estado: false, message: "al menos un número" },
      { tipo: "hasSymbol", estado: false, message: "al menos un símbolo" }
    ]

    messageCAT3: {tipo: string, estado: boolean, message: string}[] = [
      { tipo: "hasUpperCase", estado: false, message: "al menos una letra mayúscula" },
      { tipo: "hasLowerCase", estado: false, message: "al menos una letra minúscula" },
      { tipo: "hasNumber", estado: false, message: "al menos un número" },
      { tipo: "hasSymbol", estado: false, message: "al menos un símbolo" }
    ]

  constructor(private fb: FormBuilder, private validatorData: ValidatorData) {
    addIcons({
      arrowBack,
      refreshOutline,
      diamondOutline,
      closeOutline
    });


    // Nos suscribimos al BehaviorSubject del servicio
    this.userSubscription = this.authS.currentUser.subscribe({
      next: (user) => {
        this.currentUser = user;
        console.log('Usuario actual:', this.currentUser);
      },
      error: (err) => {
        console.error('Error al obtener datos del usuario:', err);
      },
      complete: () => {
        console.log('Suscripción completada');
      }
    });
  }

  ngOnInit() {
    this.editRegisterForm = this.fb.group({
      // TAB 1 - Editar contrasenha
      usr_email: [this.currentUser.usr_email, [Validators.required, Validators.email]],
      usr_password: ['', [Validators.required, Validators.minLength(8)]],
      usr_newPassword0: ['', [Validators.required, Validators.minLength(8),
        this.validatorData.passwordStrengthValidator ]],
      // validar que el usr_newPassword sea igual al usr_newPassword0

      usr_newPassword: ['', [Validators.required, Validators.minLength(8),
        this.validatorData.passwordStrengthValidator ]],
    }, 
    {
      validators: this.validatorData.passwordsMatchValidator, // correcto: en minúscula
    });

    this.editRegisterForm.get('usr_email')?.disable(); // Deshabilitar el campo de contraseña actual

    this.editDataPersonalForm = this.fb.group({
      // TAB 1 - Datos de usuario
      usr_email: [this.currentUser.usr_email, [Validators.required, Validators.email]],
      usr_password: ['NOT PASS'],
      usr_r_id: [this.currentUser.usr_r_id?.r_name, Validators.required],
      usr_infp_id: ['', Validators.required],
      usr_coin: [0, [Validators.required, Validators.min(0)]],

      // TAB 2 - Información personal
      infp_firstname: ['', Validators.required],
      infp_lastname: ['', Validators.required],
      infp_phone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      infp_address: [''],
      infp_birthday: ['', Validators.required],
    });

    this.editDataPersonalForm.setValue({
      usr_email: this.currentUser.usr_email,
      usr_password: 'NOT PASS',
      usr_r_id: this.currentUser.usr_r_id,
      usr_infp_id: this.currentUser.usr_infp_id,
      usr_coin: this.currentUser.usr_coin,
      infp_firstname: this.currentUser.usr_infp_id?.infp_firstname,
      infp_lastname: this.currentUser.usr_infp_id?.infp_lastname,
      infp_phone: this.currentUser.usr_infp_id?.infp_phone,
      infp_address: this.currentUser.usr_infp_id?.infp_address,
      infp_birthday: this.currentUser.usr_infp_id?.infp_birthday,
    });

    // this.registerForm = this.fb.group({
    //   // TAB 1 - Datos de usuario
    //   usr_username: ['', [Validators.required, Validators.minLength(4)]],
    //   usr_email: ['', [Validators.required, Validators.email]],
    //   usr_password: ['NOT PASS', [Validators.required, Validators.minLength(6)]],
    //   usr_r_id: ['', Validators.required],
    //   usr_infp_id: ['', Validators.required],
    //   usr_coin: [0, [Validators.required, Validators.min(0)]],

    //   // TAB 2 - Información personal
    //   infp_firstname: ['', Validators.required],
    //   infp_lastname: ['', Validators.required],
    //   infp_phone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
    //   infp_birthdate: ['', Validators.required],
    // });

    // this.registerForm.setValue({
    //   usr_username: this.currentUser.usr_username,
    //   usr_email: this.currentUser.usr_email,
    //   usr_password: 'NOT PASS',
    //   usr_r_id: this.currentUser.usr_r_id,
    //   usr_infp_id: this.currentUser.usr_infp_id,
    //   usr_coin: this.currentUser.usr_coin,
    //   infp_firstname: this.currentUser.usr_infp_id?.infp_firstname,
    //   infp_lastname: this.currentUser.usr_infp_id?.infp_lastname,
    //   infp_phone: this.currentUser.usr_infp_id?.infp_phone,
    //   infp_birthdate: this.currentUser.usr_infp_id?.infp_birthday,
    // });

    this.selectedTab.set('usuario');
  }

  ngOnDestroy(): void {// Es importante desuscribirse para evitar memory leaks
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
      console.log('Desuscrito de la suscripción del usuario');
    }
  }

  async editUserSubmit() {
    console.log('Datos enviados:', this.editDataPersonalForm.value);
    if (this.editDataPersonalForm.valid) {
      console.log('Datos enviados:', this.editDataPersonalForm.value);
      this.isLoading.set(true);
      const dataComplete = await this.authS.updatePersonalData(this.currentUser.usr_id || '', this.editDataPersonalForm.value);
      // Aquí iría el servicio de envío
      if(dataComplete){
        this.isLoading.set(false);
      }
    } else {
      console.log('Formulario inválido');
      this.editDataPersonalForm.markAllAsTouched();
    }
  }

  /*** */

  filterAnswers(event: any){
    const value = event.detail.value;
    this.selectedTab.set(value);

    console.log('Valor seleccionado:', value);
    this.personalidadCAT.message = '';

    if(this.selectedTab() === 'usuario'){
      this.personalidadCAT = { 
        color: 'success',
        feeling: 'happy',
        nivel_state: 1,
        message: ' (*) Miau... aquí tienes el formulario para cambiar tu contraseña, humano. ¡Hazlo con cuidado, que no quiero maullar por un error!'
      };
    } if(this.selectedTab() === 'personal'){
      this.personalidadCAT.message = ' (*) Miau... aquí tienes el formulario para cambiar tus datos, humano. ¡Hazlo con cuidado, que no quiero maullar por un error!'
    }

  }

  goBack(){
    this.router.navigate(['/tabs/tab1']);
  }

  async onSubmitLogin(){

    const formValues: { usr_email: string; usr_password: string; usr_newPassword: string; } = {
      usr_email: this.editRegisterForm.get('usr_email')?.value,
      usr_password: this.editRegisterForm.get('usr_password')?.value,
      usr_newPassword: this.editRegisterForm.get('usr_newPassword')?.value
    }

    this.isLoading.set(true);
    const exitoso = await this.authS.changePassword(formValues);

    this.isLoading.set(exitoso);

  }
  async onChangeWord(usrPassword: any) {
    const data: any = await this.onValidarPassword(usrPassword);
    console.log('data', data);
    this.messageCAT1 = data.requisitos;
    this.personalidadCAT = data.personalidadCAT;
    
  }

  async onChangeWord_new(usrPassword: any) {
    const data: any = await this.onValidarPassword(usrPassword);
    console.log('data', data);
    this.messageCAT2 = data.requisitos;
    this.personalidadCAT = data.personalidadCAT;
    
  }

  async onChangeWord_repeat(usrPassword: any) {
    const data: any = await this.onValidarPassword(usrPassword);
    console.log('data', data);
    this.messageCAT3 = data.requisitos;
    this.personalidadCAT = data.personalidadCAT;
    
  }




  async onValidarPassword(usrPassword: any) {
    if (!usrPassword) return;
  
    const hasUpperCase = /[A-Z]/.test(usrPassword);
    const hasLowerCase = /[a-z]/.test(usrPassword);
    const hasNumber = /[0-9]/.test(usrPassword);
    const hasSymbol = /[^A-Za-z0-9]/.test(usrPassword);
  
    const requisitos = [
      { tipo: "hasUpperCase", estado: hasUpperCase, message: "mayúscula" },
      { tipo: "hasLowerCase", estado: hasLowerCase, message: "minúscula" },
      { tipo: "hasNumber", estado: hasNumber, message: "número" },
      { tipo: "hasSymbol", estado: hasSymbol, message: "símbolo" }
    ];
  
    let faltantes = requisitos
      .filter(req => !req.estado)
      .map(req => req.message);
  
    let personalidadCAT: {tipo: string, estado: boolean, message: string} | any = {};


    if (faltantes.length > 0) {
      const dataFaltantes: string = faltantes.join(', ');
      const { color, feeling, level_state, message } = await this.toastS.openMessage("datos incorrectos", 'warning', "angry", false, `tu contraseña debe contener ${ dataFaltantes }`, '!... ');
      
      //verificar si existen **** en el message, si existe remplazarlo por faltantes
      if (message.includes("****")) {
        const mensaje = message.replace("****", `${dataFaltantes}`);
        personalidadCAT.message = mensaje;
      } else {
        personalidadCAT.message = message;
      }

      personalidadCAT.color = color;
      personalidadCAT.feeling = feeling;
      personalidadCAT.nivel_state = level_state;

      return {
        personalidadCAT,
        requisitos
      };

    } else {
      
      personalidadCAT.color = 'success';
      personalidadCAT.feeling = "happy";
      personalidadCAT.nivel_state = 3;
      personalidadCAT.message = "Tu contraseña cumple con todos los requisitos";

      const data = [
        { tipo: "hasUpperCase", estado: false, message: "mayúscula" },
        { tipo: "hasLowerCase", estado: false, message: "minúscula" },
        { tipo: "hasNumber", estado: false, message: "número" },
        { tipo: "hasSymbol", estado: false, message: "símbolo" }
      ];

      return {
        personalidadCAT,
        requisitos: data
      };
    }
  
  }

}