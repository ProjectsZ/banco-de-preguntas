import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterPage } from './register.page';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastService } from 'src/app/components/toast/toast.service';
import { AuthService } from 'src/app/services/auth.service';
import { ValidatorData } from 'src/app/class/validator-data';

describe('RegisterPage - Pruebas de Usabilidad', () => {
  let component: RegisterPage;
  let fixture: ComponentFixture<RegisterPage>;
  let toastService: any;
  let authService: any;
  let validatorData: any;

  beforeEach(async () => {
    toastService = {
      showSuccess: jest.fn(),
      openToast: jest.fn()
    };

    authService = {
      changePassword: jest.fn().mockResolvedValue(true)
    };

    validatorData = {
      passwordStrengthValidator: jest.fn().mockReturnValue(null),
      passwordsMatchValidator: jest.fn().mockReturnValue(null)
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RegisterPage], // standalone
      providers: [
        { provide: ToastService, useValue: toastService },
        { provide: AuthService, useValue: authService },
        { provide: ValidatorData, useValue: validatorData },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterPage);
    component = fixture.componentInstance;

    // Configurar mock de currentUser para evitar errores
    component.currentUser = {
      usr_email: 'test01@unas.edu.pe',
      usr_username: 'Test',
      usr_r_id: { 
        r_id: "7585f668-a91a-4786-9b49-2d6a6452b918", 
        r_name: 'ADMIN', 
        r_level: '1' 
      },
      usr_infp_id: {
        infp_id: '123',
        infp_firstname: 'Test',
        infp_lastname: 'User',
        infp_phone: '987654321',
        infp_address: 'Calle Falsa 123',
        infp_birthday: new Date('1990-01-01'),
        infp_img: 'test.jpg'
      },
      usr_coin: 100
    };

    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería mostrar errores de validación cuando los campos están vacíos', () => {
    // Cambiar a la pestaña de datos personales donde están los campos requeridos
    component.selectedTab.set('personal');
    fixture.detectChanges();

    // Limpiar el formulario de datos personales
    component.editDataPersonalForm.patchValue({
      infp_firstname: '',
      infp_lastname: '',
      infp_phone: '',
      infp_birthday: ''
    });
    component.editDataPersonalForm.markAllAsTouched();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    
    // Verificar que el formulario es inválido
    expect(component.editDataPersonalForm.valid).toBe(false);
    
    // Verificar que los controles tienen errores
    const firstnameControl = component.editDataPersonalForm.get('infp_firstname');
    const lastnameControl = component.editDataPersonalForm.get('infp_lastname');
    
    expect(firstnameControl?.errors?.['required']).toBeTruthy();
    expect(lastnameControl?.errors?.['required']).toBeTruthy();
  });

  it('debería permitir el envío si el formulario es válido', async () => {
    // Cambiar a la pestaña de usuario
    component.selectedTab.set('usuario');
    fixture.detectChanges();

    // Establecer valores válidos en el formulario de registro
    component.editRegisterForm.patchValue({
      usr_password: 'Password123!',
      usr_newPassword0: 'Password123!',
      usr_newPassword: 'Password123!'
    });
    fixture.detectChanges();

    expect(component.editRegisterForm.valid).toBe(true);

    await component.onSubmitLogin();
  });

  it('debería detectar formulario inválido con datos incorrectos', () => {
    // Cambiar a la pestaña de usuario
    component.selectedTab.set('usuario');
    fixture.detectChanges();

    // Simular formulario con errores
    component.editRegisterForm.patchValue({
      usr_password: '123', // Contraseña muy corta
      usr_newPassword0: '456', // Contraseña muy corta
      usr_newPassword: '789' // Contraseña muy corta
    });
    
    // Forzar la validación
    component.editRegisterForm.markAllAsTouched();
    fixture.detectChanges();

    // Verificar que el formulario es inválido
    expect(component.editRegisterForm.valid).toBe(false);
    
    // Verificar que los controles existen
    const passwordControl = component.editRegisterForm.get('usr_password');
    const newPasswordControl = component.editRegisterForm.get('usr_newPassword');
    
    expect(passwordControl).toBeTruthy();
    expect(newPasswordControl).toBeTruthy();
    
    // Verificar que al menos uno de los controles tiene errores
    const hasErrors = passwordControl?.errors || newPasswordControl?.errors;
    expect(hasErrors).toBeTruthy();
  });

  it('debería limpiar errores cuando se corrigen los campos', () => {
    // Cambiar a la pestaña de usuario
    component.selectedTab.set('usuario');
    fixture.detectChanges();

    // Primero establecer valores inválidos
    component.editRegisterForm.patchValue({
      usr_password: '123',
      usr_newPassword0: '456',
      usr_newPassword: '789'
    });
    component.editRegisterForm.markAllAsTouched();
    fixture.detectChanges();

    expect(component.editRegisterForm.valid).toBe(false);

    // Corregir los valores
    component.editRegisterForm.patchValue({
      usr_password: 'Password123!',
      usr_newPassword0: 'Password123!',
      usr_newPassword: 'Password123!'
    });
    fixture.detectChanges();

    // Verificar que el formulario ahora es válido
    expect(component.editRegisterForm.valid).toBe(true);
  });

  it('debería validar que el formulario cambia de estado según los datos', () => {
    // Cambiar a la pestaña de usuario
    component.selectedTab.set('usuario');
    fixture.detectChanges();

    const passwordControl = component.editRegisterForm.get('usr_password');
    const newPasswordControl = component.editRegisterForm.get('usr_newPassword');
    
    // Estado inicial - debería ser inválido con campos vacíos
    expect(component.editRegisterForm.valid).toBe(false);
    
    // Establecer datos válidos
    passwordControl?.setValue('Password123!');
    newPasswordControl?.setValue('Password123!');
    component.editRegisterForm.get('usr_newPassword0')?.setValue('Password123!');
    fixture.detectChanges();
    
    // Ahora debería ser válido
    expect(component.editRegisterForm.valid).toBe(true);
    
    // Establecer datos inválidos
    passwordControl?.setValue('123');
    newPasswordControl?.setValue('456');
    component.editRegisterForm.get('usr_newPassword0')?.setValue('789');
    component.editRegisterForm.markAllAsTouched();
    fixture.detectChanges();
    
    // Debería ser inválido
    expect(component.editRegisterForm.valid).toBe(false);
  });

  it('debería manejar correctamente el estado de los controles del formulario', () => {
    // Cambiar a la pestaña de usuario
    component.selectedTab.set('usuario');
    fixture.detectChanges();

    const emailControl = component.editRegisterForm.get('usr_email');
    const passwordControl = component.editRegisterForm.get('usr_password');
    
    // Verificar que los controles existen
    expect(emailControl).toBeTruthy();
    expect(passwordControl).toBeTruthy();
    
    // Verificar que el email está deshabilitado (como se configura en el componente)
    expect(emailControl?.disabled).toBe(true);
    
    // Verificar que el password está habilitado
    expect(passwordControl?.enabled).toBe(true);
    
    // Verificar que el email tiene un valor inicial
    expect(emailControl?.value).toBeTruthy();
  });

  it('debería actualizar la UI cuando cambian los valores del formulario', () => {
    // Cambiar a la pestaña de usuario
    component.selectedTab.set('usuario');
    fixture.detectChanges();

    const passwordControl = component.editRegisterForm.get('usr_password');
    
    // Cambiar el valor del password
    const newPassword = 'NuevoPassword123!';
    passwordControl?.setValue(newPassword);
    fixture.detectChanges();
    
    // Verificar que el valor se actualizó
    expect(passwordControl?.value).toBe(newPassword);
    
    // Verificar que el formulario sigue siendo inválido (necesita todos los campos)
    expect(component.editRegisterForm.valid).toBe(false);
  });
});