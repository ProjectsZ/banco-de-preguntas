import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonSelectOption, IonHeader, IonTitle, IonToolbar, IonSegmentButton, IonLabel, IonItem, IonButton, IonInput, IonCardHeader, IonCard, IonSegment } from '@ionic/angular/standalone';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonSegment, IonCard, IonSelectOption, IonInput, IonButton, IonItem, IonLabel, IonSegmentButton, IonContent, IonHeader, IonTitle, IonToolbar, 
    CommonModule, FormsModule, ReactiveFormsModule]
})
export class RegisterPage implements OnInit {

  selectedTab = signal<string>('usuario'); // Signal to hold the selected tab
  registerForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      // TAB 1 - Datos de usuario
      usr_username: ['', [Validators.required, Validators.minLength(4)]],
      usr_email: ['', [Validators.required, Validators.email]],
      usr_password: ['NOT PASS', [Validators.required, Validators.minLength(6)]],
      usr_r_id: ['', Validators.required],
      usr_infp_id: ['', Validators.required],
      usr_coin: [0, [Validators.required, Validators.min(0)]],

      // TAB 2 - Información personal
      infp_firstname: ['', Validators.required],
      infp_lastname: ['', Validators.required],
      infp_middlename: [''],
      infp_dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      infp_phone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      infp_birthdate: ['', Validators.required],
    });
  }

  submit() {
    if (this.registerForm.valid) {
      console.log('Datos enviados:', this.registerForm.value);
      // Aquí iría el servicio de envío
    } else {
      console.log('Formulario inválido');
      this.registerForm.markAllAsTouched();
    }
  }

  /*** */

  filterAnswers(event: any){
    const value = event.detail.value;
    this.selectedTab.set(value);

  }

}