import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterPage } from './register.page';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ToastService } from 'src/app/components/toast/toast.service';
import { AuthService } from 'src/app/services/auth.service';
import { ValidatorData } from 'src/app/class/validator-data';

describe('RegisterPage - Pruebas de tabla de decisión', () => {
    let component: RegisterPage;
    let fixture: ComponentFixture<RegisterPage>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                RegisterPage,                // Componente standalone
                ReactiveFormsModule,
                IonicModule.forRoot()
            ],
            providers: [
                provideHttpClientTesting(),
                { provide: ModalController, useValue: { create: jest.fn(), dismiss: jest.fn(), present: jest.fn() } },
                { provide: ToastService, useValue: { show: jest.fn() } },
                { provide: AuthService, useValue: { register: jest.fn() } },
                { provide: ValidatorData, useClass: ValidatorData }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(RegisterPage);
        component = fixture.componentInstance;

        // Asignar currentUser para evitar errores por campos vacíos
        component.currentUser = {
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

        fixture.detectChanges();
    });

    it('Formulario de nombres Caso 1: Ambos nombres válidos', () => {
        component.editDataPersonalForm.controls['infp_firstname'].setValue('Juan');
        component.editDataPersonalForm.controls['infp_lastname'].setValue('Pérez');
        expect(component.editDataPersonalForm.controls['infp_firstname'].valid).toBe(true);
        expect(component.editDataPersonalForm.controls['infp_lastname'].valid).toBe(true);
    });

    it('Formulario de nombres Caso 2: infp_lastname inválido', () => {
        component.editDataPersonalForm.controls['infp_firstname'].setValue('Juan');
        component.editDataPersonalForm.controls['infp_lastname'].setValue('123');
        expect(component.editDataPersonalForm.controls['infp_lastname'].valid).toBe(false);
    });

    it('Formulario de nombres Caso 3: infp_firstname inválido', () => {
        component.editDataPersonalForm.controls['infp_firstname'].setValue('');
        component.editDataPersonalForm.controls['infp_lastname'].setValue('Pérez');
        expect(component.editDataPersonalForm.controls['infp_firstname'].valid).toBe(false);
    });

    it('Formulario de nombres Caso 4: Ambos nombres inválidos', () => {
        component.editDataPersonalForm.controls['infp_firstname'].setValue('12');
        component.editDataPersonalForm.controls['infp_lastname'].setValue('456');
        expect(component.editDataPersonalForm.controls['infp_firstname'].valid).toBe(false);
        expect(component.editDataPersonalForm.controls['infp_lastname'].valid).toBe(false);
    });

});

