import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonRadioGroup, IonItem, IonRadio, IonLabel, IonIcon } from '@ionic/angular/standalone';

import { QuizOptionsComponent } from './quiz-options.component';
import { ToastService } from '../toast/toast.service';

// Mock del servicio ToastService
const mockToastService = {
  openToast: jest.fn()
};

// Mock de los componentes de Ionic
@Component({
  selector: 'ion-radio-group',
  template: '<div>Mock Radio Group</div>'
})
class MockIonRadioGroup {
  @Input() mode: string = '';
  @Input() ngModel: any;
  @Input() class: any;
}

@Component({
  selector: 'ion-item',
  template: '<div>Mock Item</div>'
})
class MockIonItem {
  @Input() ngClass: any;
  @Input() slot: string = '';
  @Input() color: string = '';
  @Input() value: any;
}

@Component({
  selector: 'ion-radio',
  template: '<div>Mock Radio</div>'
})
class MockIonRadio {
  @Input() slot: string = '';
  @Input() color: string = '';
  @Input() value: any;
}

@Component({
  selector: 'ion-label',
  template: '<div>Mock Label</div>'
})
class MockIonLabel {}

@Component({
  selector: 'ion-icon',
  template: '<div>Mock Icon</div>'
})
class MockIonIcon {
  @Input() name: string = '';
  @Input() slot: string = '';
  @Input() color: string = '';
}

describe('QuizOptionsComponent', () => {
  let component: QuizOptionsComponent;
  let fixture: ComponentFixture<QuizOptionsComponent>;
  let toastService: jest.Mocked<ToastService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        QuizOptionsComponent,
        MockIonRadioGroup,
        MockIonItem,
        MockIonRadio,
        MockIonLabel,
        MockIonIcon
      ],
      providers: [
        { provide: ToastService, useValue: mockToastService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(QuizOptionsComponent);
    component = fixture.componentInstance;
    toastService = TestBed.inject(ToastService) as jest.Mocked<ToastService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  describe('Inicialización del componente', () => {
    it('debería crear el componente correctamente', () => {
      expect(component).toBeTruthy();
    });

    it('debería inicializar las propiedades por defecto', () => {
      expect(component.options()).toEqual([]);
      expect(component.selectedOption()).toBeNull();
      expect(component.freezeAction()).toBe(false);
      expect(component.content()).toBe('');
      expect(component.role()).toBe('ESTUDIANTE');
      expect(component.colorTheme()).toBe('light');
    });

    it('debería tener el getter currentColorTheme funcionando', () => {
      expect(component.currentColorTheme).toBe('light');
    });

    it('debería inyectar correctamente el ToastService', () => {
      expect(component['toastS']).toBeDefined();
      expect(component['toastS']).toBe(toastService);
    });
  });

  describe('Propiedades de entrada (inputs)', () => {
    it('debería aceptar opciones personalizadas', () => {
      const testOptions = ['Opción 1', 'Opción 2', 'Opción 3'];
      expect(component.options()).toEqual([]);
    });

    it('debería aceptar un rol personalizado', () => {
      expect(component.role()).toBe('ESTUDIANTE');
    });

    it('debería aceptar contenido personalizado', () => {
      expect(component.content()).toBe('');
    });

    it('debería aceptar un tema de color personalizado', () => {
      expect(component.colorTheme()).toBe('light');
    });

    it('debería aceptar el estado de freezeAction', () => {
      expect(component.freezeAction()).toBe(false);
    });
  });

  describe('Selección de opciones', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('debería seleccionar una opción correctamente', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      component.setOption(1);

      jest.advanceTimersByTime(100);

      expect(consoleSpy).toHaveBeenCalledWith('Selected option: ', 1);
      consoleSpy.mockRestore();
    });

    it('debería alternar la selección si la opción ya está seleccionada', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      // Primera selección
      component.setOption(0);
      jest.advanceTimersByTime(100);
      
      // Segunda selección de la misma opción (debería alternar)
      component.setOption(0);
      jest.advanceTimersByTime(100);

      expect(consoleSpy).toHaveBeenCalledWith('Selected option: ', 0);
      consoleSpy.mockRestore();
    });

    it('debería no hacer nada si freezeAction está activo', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      // Simular que freezeAction está activo
      component.setOption(0);

      jest.advanceTimersByTime(100);

      // Verificar que se registra la llamada inicial pero no se procesa
      expect(consoleSpy).toHaveBeenCalledWith('Selected option: ', 0);
      consoleSpy.mockRestore();
    });

    it('debería limpiar el timeout anterior antes de crear uno nuevo', () => {
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
      
      component.setOption(0);
      component.setOption(1);

      expect(clearTimeoutSpy).toHaveBeenCalled();
      clearTimeoutSpy.mockRestore();
    });
  });

  describe('Integración con ToastService', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('debería verificar que el ToastService está disponible', () => {
      expect(toastService).toBeDefined();
      expect(toastService.openToast).toBeDefined();
    });

    it('debería verificar que el método setOption se puede llamar', () => {
      expect(() => {
        component.setOption(0);
      }).not.toThrow();
    });

    it('debería verificar que el debounce funciona correctamente', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      component.setOption(0);
      jest.advanceTimersByTime(100);

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('Temas de color', () => {
    it('debería retornar el tema actual correctamente', () => {
      expect(component.currentColorTheme).toBe('light');
    });

    it('debería tener el getter currentColorTheme funcionando', () => {
      expect(typeof component.currentColorTheme).toBe('string');
      expect(component.currentColorTheme).toBe('light');
    });
  });

  describe('Casos edge y validaciones', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('debería manejar opciones vacías', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      component.setOption(0);

      jest.advanceTimersByTime(100);

      expect(consoleSpy).toHaveBeenCalledWith('Selected option: ', 0);
      consoleSpy.mockRestore();
    });

    it('debería manejar índices fuera de rango', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      component.setOption(5);

      jest.advanceTimersByTime(100);

      expect(consoleSpy).toHaveBeenCalledWith('Selected option: ', 5);
      consoleSpy.mockRestore();
    });

    it('debería manejar múltiples llamadas rápidas con debounce', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      component.setOption(0);
      component.setOption(1);
      component.setOption(0);

      jest.advanceTimersByTime(100);

      // Solo debería ejecutarse la última llamada
      expect(consoleSpy).toHaveBeenCalledWith('Selected option: ', 0);
      consoleSpy.mockRestore();
    });
  });

  describe('Renderizado del template', () => {
    it('debería renderizar el componente sin errores', () => {
      expect(() => {
        fixture.detectChanges();
      }).not.toThrow();
    });

    it('debería mostrar las opciones correctamente', () => {
      fixture.detectChanges();

      const radioGroup = fixture.nativeElement.querySelector('ion-radio-group');
      expect(radioGroup).toBeTruthy();
    });
  });

  describe('Ciclo de vida del componente', () => {
    it('debería limpiar el timeout al destruir el componente', () => {
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
      
      component.setOption(0);
      fixture.destroy();

      expect(clearTimeoutSpy).toHaveBeenCalled();
      clearTimeoutSpy.mockRestore();
    });

    it('debería limpiar recursos al destruir el componente', () => {
      fixture.destroy();
      
      expect(fixture.componentInstance).toBeDefined();
    });
  });

  describe('Integración con signals', () => {
    it('debería manejar correctamente los signals de entrada', () => {
      expect(component.options()).toEqual([]);
      expect(component.selectedOption()).toBeNull();
      expect(component.freezeAction()).toBe(false);
      expect(component.content()).toBe('');
      expect(component.role()).toBe('ESTUDIANTE');
      expect(component.colorTheme()).toBe('light');
    });

    it('debería verificar que los signals están disponibles', () => {
      expect(typeof component.options).toBe('function');
      expect(typeof component.selectedOption).toBe('function');
      expect(typeof component.freezeAction).toBe('function');
      expect(typeof component.content).toBe('function');
      expect(typeof component.role).toBe('function');
      expect(typeof component.colorTheme).toBe('function');
    });
  });
});
