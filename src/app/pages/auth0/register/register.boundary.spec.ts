import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ValidatorData } from 'src/app/class/validator-data';
import { ToastService } from 'src/app/components/toast/toast.service';
import { AuthService } from 'src/app/services/auth.service';
import { RegisterPage } from './register.page';

describe('RegisterPage - Análisis de Valor Límite', () => {
    let component: RegisterPage;
    let fixture: ComponentFixture<RegisterPage>;
    let modalController: any;
    let toastService: any;
    let authService: any;

    // Mock data para testing
    const mockUser = {
        usr_email: 'test01@example.com',
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

    beforeEach(async () => {
        // Crear mocks más específicos
        modalController = {
            create: jest.fn().mockResolvedValue({
                present: jest.fn().mockResolvedValue(undefined),
                onDidDismiss: jest.fn().mockResolvedValue({ data: null }),
                dismiss: jest.fn().mockResolvedValue(undefined)
            }),
            dismiss: jest.fn().mockResolvedValue(undefined),
            present: jest.fn().mockResolvedValue(undefined)
        };

        toastService = {
            show: jest.fn().mockResolvedValue(undefined),
            openToast: jest.fn()
        };

        authService = {
            register: jest.fn().mockResolvedValue(undefined),
            currentUser: { next: jest.fn(), subscribe: jest.fn() }
        };

        await TestBed.configureTestingModule({
            imports: [
                RegisterPage,
                ReactiveFormsModule,
                IonicModule.forRoot()
            ],
            providers: [
                provideHttpClientTesting(),
                { provide: ValidatorData, useClass: ValidatorData },
                { provide: ModalController, useValue: modalController },
                { provide: ToastService, useValue: toastService },
                { provide: AuthService, useValue: authService }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(RegisterPage);
        component = fixture.componentInstance;

        // Configurar mock de currentUser
        component.currentUser = mockUser;

        fixture.detectChanges();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Validación del campo infp_phone', () => {
        it('debería marcar inválido si el número de teléfono está vacío', () => {
            const phoneControl = component.editDataPersonalForm.get('infp_phone');
            phoneControl?.setValue('');
            
            expect(phoneControl?.hasError('required')).toBe(true);
            expect(phoneControl?.valid).toBe(false);
        });

        it('debería marcar inválido si el número de teléfono tiene menos de 9 dígitos', () => {
            const phoneControl = component.editDataPersonalForm.get('infp_phone');
            phoneControl?.setValue('12345678'); // 8 dígitos
            
            expect(phoneControl?.hasError('pattern')).toBe(true);
            expect(phoneControl?.valid).toBe(false);
        });

        it('debería marcar inválido si el número de teléfono tiene más de 9 dígitos', () => {
            const phoneControl = component.editDataPersonalForm.get('infp_phone');
            phoneControl?.setValue('1234567890'); // 10 dígitos
            
            expect(phoneControl?.hasError('pattern')).toBe(true);
            expect(phoneControl?.valid).toBe(false);
        });

        it('debería marcar inválido si el número de teléfono contiene letras', () => {
            const phoneControl = component.editDataPersonalForm.get('infp_phone');
            phoneControl?.setValue('12345abc9');
            
            expect(phoneControl?.hasError('pattern')).toBe(true);
            expect(phoneControl?.valid).toBe(false);
        });

        it('debería marcar inválido si el número de teléfono contiene espacios', () => {
            const phoneControl = component.editDataPersonalForm.get('infp_phone');
            phoneControl?.setValue('123 456 789');
            
            expect(phoneControl?.hasError('pattern')).toBe(true);
            expect(phoneControl?.valid).toBe(false);
        });

        it('debería marcar inválido si el número de teléfono contiene caracteres especiales', () => {
            const phoneControl = component.editDataPersonalForm.get('infp_phone');
            phoneControl?.setValue('123-456-789');
            
            expect(phoneControl?.hasError('pattern')).toBe(true);
            expect(phoneControl?.valid).toBe(false);
        });

        it('debería ser válido si el número de teléfono tiene exactamente 9 dígitos', () => {
            const phoneControl = component.editDataPersonalForm.get('infp_phone');
            phoneControl?.setValue('987654321');
            
            expect(phoneControl?.hasError('pattern')).toBe(false);
            expect(phoneControl?.valid).toBe(true);
        });

        it('debería ser válido con diferentes números de 9 dígitos', () => {
            const phoneControl = component.editDataPersonalForm.get('infp_phone');
            const validNumbers = ['123456789', '987654321', '555666777', '111222333'];
            
            validNumbers.forEach(number => {
                phoneControl?.setValue(number);
                expect(phoneControl?.valid).toBe(true);
            });
        });
    });

    describe('Validación del formulario completo', () => {
        it('debería inicializar el formulario con los valores del usuario', () => {
            expect(component.editDataPersonalForm.get('usr_email')?.value).toBe(mockUser.usr_email);
            expect(component.editDataPersonalForm.get('infp_firstname')?.value).toBe(mockUser.usr_infp_id.infp_firstname);
            expect(component.editDataPersonalForm.get('infp_lastname')?.value).toBe(mockUser.usr_infp_id.infp_lastname);
            expect(component.editDataPersonalForm.get('infp_phone')?.value).toBe(mockUser.usr_infp_id.infp_phone);
        });

        it('debería marcar el formulario como válido cuando todos los campos requeridos están completos', () => {
            component.editDataPersonalForm.patchValue({
                infp_firstname: 'Juan',
                infp_lastname: 'Pérez',
                infp_phone: '987654321',
                infp_birthday: '1990-01-01'
            });

            expect(component.editDataPersonalForm.valid).toBe(true);
        });

        it('debería marcar el formulario como inválido cuando faltan campos requeridos', () => {
            component.editDataPersonalForm.patchValue({
                infp_firstname: '',
                infp_lastname: '',
                infp_phone: '',
                infp_birthday: ''
            });

            expect(component.editDataPersonalForm.valid).toBe(false);
        });
    });

    describe('Casos edge y límites', () => {
        it('debería manejar números de teléfono con ceros al inicio', () => {
            const phoneControl = component.editDataPersonalForm.get('infp_phone');
            phoneControl?.setValue('012345678');
            
            expect(phoneControl?.valid).toBe(true);
        });

        it('debería rechazar números que parecen válidos pero tienen caracteres ocultos', () => {
            const phoneControl = component.editDataPersonalForm.get('infp_phone');
            phoneControl?.setValue('123456789\u200B'); // Zero-width space
            
            expect(phoneControl?.hasError('pattern')).toBe(true);
        });

        it('debería validar correctamente números con todos los dígitos iguales', () => {
            const phoneControl = component.editDataPersonalForm.get('infp_phone');
            phoneControl?.setValue('999999999');
            
            expect(phoneControl?.valid).toBe(true);
        });
    });
});
