import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LoginPage } from './login.page';
import { AuthService } from 'src/app/services/auth.service';
import { ValidatorData } from 'src/app/class/validator-data';
import { BehaviorSubject } from 'rxjs';

type AuthResponse = { user: { id: string } };

describe('LoginPage - Banco de Pruebas con Consola', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let authServiceSpy: Partial<AuthService>;
  let validatorSpy: Partial<ValidatorData>;

  beforeEach(async () => {
    authServiceSpy = {
      signIn: jest.fn(),
      login: jest.fn() as any,
      currentUser: new BehaviorSubject(null),
      currentUser22: new BehaviorSubject(null),
      onLogin: jest.fn(),
      changePassword: jest.fn(),
      logout: jest.fn(),
      getToken: jest.fn(),
      isTokenExpired: jest.fn(),
      isTokenValid: jest.fn(),
      getValidToken: jest.fn(),
      getUser: jest.fn(),
      logOut: jest.fn(),
      hasPermission: jest.fn(),
      updateCoin: jest.fn(),
      updatePersonalData: jest.fn(),
      loadUser: jest.fn()
    };

    validatorSpy = {
      maxQuestionCountValidator: jest.fn(),
      passwordStrengthValidator: jest.fn(),
      passwordsMatchValidator: jest.fn()
    };

    console.clear();
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, LoginPage],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ValidatorData, useValue: validatorSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('🔧 Debería crear el formulario con los controles esperados', () => {
    console.info('\n📋 INICIO: Estructura del formulario');
    expect(component.loginForm.contains('email')).toBe(true);
    expect(component.loginForm.contains('password')).toBe(true);

    console.info('✔️ Controles verificados: email, password');
  });

  it('🔴 Login rechazado con usuario inválido (email externo)', () => {
    console.info('\n📦 🔴 INICIO: Login inválido (correo @gmail.com)');
    const emailControl = component.loginForm.get('email');
    emailControl?.setValue('usuario@gmail.com');
    console.info('Email ingresado:', emailControl?.value);
    console.info('¿Es válido?', emailControl?.valid);
    expect(emailControl?.valid).toBe(false);
  });

  it('🟢 Login exitoso con usuario válido', async () => {
    console.info('\n📦 🟢 INICIO: Login válido (usuario @unas.edu.pe)');
    const mockResponse: AuthResponse = { user: { id: '123' } };
    (authServiceSpy.signIn as jest.Mock).mockResolvedValue(mockResponse as any);
    component.loginForm.setValue({
      email: 'usuario@unas.edu.pe',
      password: 'Password1!',
      rememberMe: true
    });
    await component.onSubmit();
    console.info('✔️ Login exitoso - Respuesta:', mockResponse);
    expect(authServiceSpy.signIn).toHaveBeenCalledWith('usuario@unas.edu.pe', 'Password1!');
  });

  it('🔐 Debería detectar contraseña insegura sin símbolo', async () => {
    console.info('\n📦 🔐 INICIO: Validación de contraseña');
    await component.onChangeWord('Password123');
    console.info('Resultado de messageCAT:');
    component.messageCAT.forEach(cat => {
      console.info(`• ${cat.tipo} = ${cat.estado} (${cat.message})`);
    });
    const hasSymbol = component.messageCAT.find(c => c.tipo === 'hasSymbol');
    expect(hasSymbol?.estado).toBe(false);
  });

  it('🕒 Debería medir duración del proceso de login', async () => {
    console.info('\n📦 🕒 INICIO: Medición de duración del login');
    const mockResponse: AuthResponse = { user: { id: 'mock' } };
    (authServiceSpy.signIn as jest.Mock).mockImplementation(() =>
      new Promise(resolve => setTimeout(() => resolve(mockResponse as any), 150))
    );
    component.loginForm.setValue({
      email: 'test@unas.edu.pe',
      password: 'Password1!',
      rememberMe: false
    });
    const start = performance.now();
    await component.onSubmit();
    const end = performance.now();
    const duracion = end - start;
    console.info('⏱️ Duración total del login:', duracion.toFixed(2), 'ms');
    expect(duracion).toBeGreaterThanOrEqual(100);
  });

  it('🧾 Debería capturar logs del componente si existen', async () => {
    console.info('\n📦 🧾 INICIO: Captura de logs del componente');
    const logSpy = jest.spyOn(console, 'log');
    const mockResponse: AuthResponse = { user: { id: 'log-test' } };
    (authServiceSpy.signIn as jest.Mock).mockResolvedValue(mockResponse as any);
    component.loginForm.setValue({
      email: 'test@unas.edu.pe',
      password: 'Password1!',
      rememberMe: false
    });
    await component.onSubmit();
    const logs = logSpy.mock.calls;
    logs.forEach((entry, i) => console.info(`📄 Log ${i + 1}:`, ...entry));
    expect(authServiceSpy.signIn).toHaveBeenCalled();
  });
});
