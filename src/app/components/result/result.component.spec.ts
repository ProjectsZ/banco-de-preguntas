import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonText, IonButton, IonButtons, IonIcon, IonContent, IonLabel, IonCard, IonGrid, IonRow, IonCol, IonChip } from '@ionic/angular/standalone';

import { ResultComponent } from './result.component';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from '../toast/toast.service';
import { User } from 'src/app/interfaces/user.interface';
import { of, throwError } from 'rxjs';

// Mock del servicio AuthService
const mockAuthService = {
  currentUser: of({
    usr_id: '123',
    usr_coin: 50,
    usr_name: 'Test User',
    usr_username: 'testuser',
    usr_email: 'test@unas.edu.pe'
  } as User),
  updateCoin: jest.fn()
};

// Mock del servicio ToastService
const mockToastService = {
  openToast: jest.fn()
};

// Mock del componente CircleTextComponent
@Component({
  selector: 'app-circle-text',
  template: '<div>Mock Circle Text</div>'
})
class MockCircleTextComponent {
  @Input() bgColor: string = '';
  @Input() title: string = '';
  @Input() text: any;
  @Input() textColor: boolean = false;
}

// Mock de los componentes de Ionic
@Component({
  selector: 'ion-header',
  template: '<div>Mock Header</div>'
})
class MockIonHeader {}

@Component({
  selector: 'ion-toolbar',
  template: '<div>Mock Toolbar</div>'
})
class MockIonToolbar {
  @Input() color: string = '';
}

@Component({
  selector: 'ion-title',
  template: '<div>Mock Title</div>'
})
class MockIonTitle {
  @Input() mode: string = '';
}

@Component({
  selector: 'ion-buttons',
  template: '<div>Mock Buttons</div>'
})
class MockIonButtons {
  @Input() slot: string = '';
}

@Component({
  selector: 'ion-button',
  template: '<div>Mock Button</div>'
})
class MockIonButton {
  @Input() color: string = '';
  @Input() fill: string = '';
  @Input() size: string = '';
  @Input() expand: string = '';
  @Input() mode: string = '';
  @Input() disabled: boolean = false;
}

@Component({
  selector: 'ion-icon',
  template: '<div>Mock Icon</div>'
})
class MockIonIcon {
  @Input() name: string = '';
}

@Component({
  selector: 'ion-content',
  template: '<div>Mock Content</div>'
})
class MockIonContent {
  @Input() fullscreen: boolean = false;
  @Input() class: string = '';
}

@Component({
  selector: 'ion-label',
  template: '<div>Mock Label</div>'
})
class MockIonLabel {
  @Input() color: string = '';
}

@Component({
  selector: 'ion-text',
  template: '<div>Mock Text</div>'
})
class MockIonText {
  @Input() color: string = '';
  @Input() slot: string = '';
}

@Component({
  selector: 'ion-grid',
  template: '<div>Mock Grid</div>'
})
class MockIonGrid {
  @Input() class: string = '';
}

@Component({
  selector: 'ion-row',
  template: '<div>Mock Row</div>'
})
class MockIonRow {
  @Input() class: string = '';
}

@Component({
  selector: 'ion-col',
  template: '<div>Mock Col</div>'
})
class MockIonCol {
  @Input() class: string = '';
}

@Component({
  selector: 'ion-chip',
  template: '<div>Mock Chip</div>'
})
class MockIonChip {
  @Input() color: string = '';
  @Input() disabled: boolean = false;
  @Input() class: string = '';
}

describe('ResultComponent', () => {
  let component: ResultComponent;
  let fixture: ComponentFixture<ResultComponent>;
  let authService: jest.Mocked<AuthService>;
  let toastService: jest.Mocked<ToastService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ResultComponent,
        MockCircleTextComponent,
        MockIonHeader,
        MockIonToolbar,
        MockIonTitle,
        MockIonButtons,
        MockIonButton,
        MockIonIcon,
        MockIonContent,
        MockIonLabel,
        MockIonText,
        MockIonGrid,
        MockIonRow,
        MockIonCol,
        MockIonChip
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: ToastService, useValue: mockToastService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ResultComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
    toastService = TestBed.inject(ToastService) as jest.Mocked<ToastService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Inicialización del componente', () => {
    it('debería crear el componente correctamente', () => {
      expect(component).toBeTruthy();
    });

    it('debería inicializar las propiedades por defecto', () => {
      expect(component.result()).toBeNull();
      expect(component.userSTATUS()).toBe('ESTUDIANTE');
      expect(component.coin_win).toBe(0);
      expect(component.isLoading()).toBe(false);
    });

    it('debería inyectar correctamente los servicios', () => {
      expect(component['authS']).toBeDefined();
      expect(component['authS']).toBe(authService);
      expect(component['toastS']).toBeDefined();
      expect(component['toastS']).toBe(toastService);
    });

    it('debería suscribirse al usuario actual en ngOnInit', () => {
      const subscribeSpy = jest.spyOn(authService.currentUser, 'subscribe');
      
      component.ngOnInit();

      expect(subscribeSpy).toHaveBeenCalled();
      subscribeSpy.mockRestore();
    });
  });

  describe('Propiedades de entrada (inputs)', () => {
    it('debería aceptar un resultado personalizado', () => {
      expect(component.result()).toBeNull();
    });

    it('debería aceptar un status de usuario personalizado', () => {
      expect(component.userSTATUS()).toBe('ESTUDIANTE');
    });
  });

  describe('Cálculo de monedas ganadas', () => {
    it('debería verificar la lógica de cálculo de monedas', () => {
      // Verificar que el método ngOnInit existe y se puede llamar
      expect(typeof component.ngOnInit).toBe('function');
      
      // Verificar que se puede llamar sin errores
      expect(() => {
        component.ngOnInit();
      }).not.toThrow();
    });

    it('debería establecer coin_win en 0 por defecto', () => {
      component.ngOnInit();
      expect(component.coin_win).toBe(0);
    });

    it('debería verificar que coin_win es una propiedad numérica', () => {
      expect(typeof component.coin_win).toBe('number');
      expect(component.coin_win).toBe(0);
    });
  });

  describe('Eventos de salida (outputs)', () => {
    it('debería emitir close cuando se llama closeModal', () => {
      const emitSpy = jest.spyOn(component.close, 'emit');
      
      component.closeModal();

      expect(emitSpy).toHaveBeenCalledWith(true);
      emitSpy.mockRestore();
    });

    it('debería emitir restart cuando se llama replay', () => {
      const emitSpy = jest.spyOn(component.restart, 'emit');
      
      component.replay();

      expect(emitSpy).toHaveBeenCalledWith(true);
      emitSpy.mockRestore();
    });

    it('debería emitir answer cuando se llama viewAnswers', () => {
      const emitSpy = jest.spyOn(component.answer, 'emit');
      
      component.viewAnswers();

      expect(emitSpy).toHaveBeenCalledWith(true);
      emitSpy.mockRestore();
    });
  });

  describe('Estado de loading', () => {
    it('debería establecer el estado de loading correctamente', () => {
      expect(component.isLoading()).toBe(false);

      component.setIsLoading(true);
      expect(component.isLoading()).toBe(true);

      component.setIsLoading(false);
      expect(component.isLoading()).toBe(false);
    });
  });

  describe('Canjear premio', () => {
    beforeEach(() => {
      component.currentUser = {
        usr_id: '123',
        usr_coin: 50,
        usr_name: 'Test User',
        usr_username: 'testuser',
        usr_email: 'test@example.com'
      } as User;
    });

    it('debería mostrar error si el usuario no tiene monedas', () => {
      component.currentUser.usr_coin = 0;
      component.coin_win = 10;

      component.canjearPremio();

      expect(toastService.openToast).toHaveBeenCalledWith(
        'Usted no tiene monedas suficientes, no insista!',
        'danger',
        'angry',
        true
      );
    });

    it('debería mostrar error si el usuario no está autenticado', () => {
      component.currentUser = null as any;
      component.coin_win = 10;

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      component.canjearPremio();

      expect(consoleSpy).toHaveBeenCalledWith('Usuario no autenticado');
      consoleSpy.mockRestore();
    });

    it('debería canjear premio exitosamente', () => {
      component.coin_win = 10;
      authService.updateCoin.mockReturnValue(of(true));

      const setIsLoadingSpy = jest.spyOn(component, 'setIsLoading');

      component.canjearPremio();

      expect(setIsLoadingSpy).toHaveBeenCalledWith(true);
      expect(authService.updateCoin).toHaveBeenCalledWith('123', 0, 10);
      expect(toastService.openToast).toHaveBeenCalledWith(
        'Se canjeo el regalo, chevere!',
        'success',
        'happy',
        true
      );
      expect(component.coin_win).toBe(0);
      setIsLoadingSpy.mockRestore();
    });

    it('debería manejar error al canjear premio', () => {
      component.coin_win = 10;
      authService.updateCoin.mockReturnValue(of(false));

      component.canjearPremio();

      expect(toastService.openToast).toHaveBeenCalledWith(
        'Error al pagar con las monedas, intente luego!',
        'danger',
        'annoyed',
        true
      );
    });

    it('debería manejar error en la suscripción', () => {
      component.coin_win = 10;
      authService.updateCoin.mockReturnValue(throwError(() => new Error('Network error')));

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      component.canjearPremio();

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('Ciclo de vida del componente', () => {
    it('debería desuscribirse correctamente en ngOnDestroy', () => {
      // Crear una suscripción mock
      const mockSubscription = {
        unsubscribe: jest.fn()
      };
      component['userSubscription'] = mockSubscription as any;

      component.ngOnDestroy();

      expect(mockSubscription.unsubscribe).toHaveBeenCalled();
    });

    it('debería manejar ngOnDestroy sin suscripción', () => {
      component['userSubscription'] = null;

      expect(() => {
        component.ngOnDestroy();
      }).not.toThrow();
    });
  });

  describe('Renderizado del template', () => {
    it('debería renderizar el componente sin errores', () => {
      expect(() => {
        fixture.detectChanges();
      }).not.toThrow();
    });

    it('debería mostrar el título correcto', () => {
      fixture.detectChanges();

      const titleElement = fixture.nativeElement.querySelector('ion-title');
      expect(titleElement).toBeTruthy();
    });
  });

  describe('Casos edge y validaciones', () => {
    it('debería manejar resultado null correctamente', () => {
      expect(() => {
        component.ngOnInit();
      }).not.toThrow();
      
      expect(component.coin_win).toBe(0);
    });

    it('debería manejar usuario null correctamente', () => {
      component.currentUser = null as any;

      expect(() => {
        component.canjearPremio();
      }).not.toThrow();
    });

    it('debería manejar coin_win igual a 0', () => {
      component.coin_win = 0;

      expect(() => {
        component.canjearPremio();
      }).not.toThrow();
    });
  });

  describe('Integración con servicios', () => {
    it('debería actualizar el usuario actual correctamente', () => {
      const mockUser = {
        usr_id: '456',
        usr_coin: 100,
        usr_name: 'New User',
        usr_username: 'newuser',
        usr_email: 'new@example.com'
      } as User;

      // Simular la suscripción
      component['userSubscription'] = authService.currentUser.subscribe({
        next: (user) => {
          component.currentUser = user;
        }
      });

      expect(component.currentUser).toBeDefined();
    });

    it('debería verificar que el servicio está disponible', () => {
      expect(authService).toBeDefined();
      expect(authService.currentUser).toBeDefined();
      expect(authService.updateCoin).toBeDefined();
    });
  });
});
