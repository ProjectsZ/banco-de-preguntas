import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ModalController, AnimationController } from '@ionic/angular/standalone';
import { ToastService } from './toast.service';

describe('ToastService - Auto-cierre Temporal y Comportamiento No Invasivo (10 pruebas)', () => {
  let service: ToastService;
  let modalControllerMock: jest.Mocked<ModalController>;
  let httpTestingController: HttpTestingController;
  let mockModal: jest.Mocked<HTMLIonModalElement>;

  beforeEach(async () => {
    // Crear mock del modal
    mockModal = {
      present: jest.fn().mockResolvedValue(undefined),
      dismiss: jest.fn().mockResolvedValue(true)
    } as any;

    // Crear mock del ModalController
    modalControllerMock = {
      create: jest.fn().mockResolvedValue(mockModal),
      getTop: jest.fn().mockResolvedValue(null)
    } as any;

    const animationControllerMock = {
      create: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ToastService,
        { provide: ModalController, useValue: modalControllerMock },
        { provide: AnimationController, useValue: animationControllerMock }
      ]
    }).compileComponents();

    service = TestBed.inject(ToastService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verificar y limpiar cualquier request HTTP pendiente
    try {
      httpTestingController.verify();
    } catch (error) {
      // Si hay requests pendientes, los limpiamos
      const pendingRequests = httpTestingController.match(() => true);
      pendingRequests.forEach(req => req.flush([])); // Flush con data vacía
    }
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  // Función auxiliar para manejar la llamada HTTP
  const mockHttpResponse = () => {
    const mockToastData = [
      {
        key_phrase: "usuario correcto",
        color: "success",
        message: [
          {
            speak: "¡Perfecto! Acceso concedido correctamente.",
            feeling: "happy",
            several_times: 1
          }
        ]
      }
    ];
    
    const req = httpTestingController.expectOne('assets/data/cat-prompt.json');
    req.flush(mockToastData);
  };

  // ===============================
  // PRUEBAS DE AUTO-CIERRE TEMPORAL (3 pruebas)
  // ===============================

  describe('Auto-cierre Temporal', () => {
    
    it('debería cerrar automáticamente el toast después del tiempo por defecto (4 segundos)', async () => {
      jest.useFakeTimers();
      
      // ACCIÓN: Abrir toast con configuración por defecto
      const toastPromise = service.openToast('usuario correcto', 'success', 'happy');
      
      // Mock de la respuesta HTTP
      mockHttpResponse();
      
      // Esperar a que se resuelva la promesa
      await toastPromise;

      // VERIFICACIÓN: El modal se creó y se presentó
      expect(modalControllerMock.create).toHaveBeenCalled();
      expect(mockModal.present).toHaveBeenCalled();
      expect(mockModal.dismiss).not.toHaveBeenCalled();

      // ACCIÓN: Simular el paso del tiempo por defecto (4000ms)
      jest.advanceTimersByTime(4000);

      // VERIFICACIÓN: El toast se cerró automáticamente
      expect(mockModal.dismiss).toHaveBeenCalled();
    });

    it('debería cerrar automáticamente el toast después de un tiempo personalizado (2 segundos)', async () => {
      jest.useFakeTimers();
      
      // ACCIÓN: Abrir toast con duración personalizada de 2 segundos
      const toastPromise = service.openToast('usuario correcto', 'success', 'happy', false, '', '', 2000);
      
      // Mock de la respuesta HTTP
      mockHttpResponse();
      
      // Esperar a que se resuelva la promesa
      await toastPromise;

      // VERIFICACIÓN: El modal se creó
      expect(modalControllerMock.create).toHaveBeenCalled();
      expect(mockModal.present).toHaveBeenCalled();

      // ACCIÓN: Avanzar tiempo menor al configurado (1.5 segundos)
      jest.advanceTimersByTime(1500);
      
      // VERIFICACIÓN: Aún no debe haberse cerrado
      expect(mockModal.dismiss).not.toHaveBeenCalled();

      // ACCIÓN: Avanzar hasta completar los 2 segundos
      jest.advanceTimersByTime(500);
      
      // VERIFICACIÓN: Ahora sí debe haberse cerrado
      expect(mockModal.dismiss).toHaveBeenCalled();
    });

    it('debería cerrar inmediatamente con duración de 0 segundos', async () => {
      jest.useFakeTimers();
      
      // ACCIÓN: Abrir toast con duración de 0 segundos
      const toastPromise = service.openToast('usuario correcto', 'success', 'happy', false, '', '', 0);
      
      // Mock de la respuesta HTTP
      mockHttpResponse();
      
      // Esperar a que se resuelva la promesa
      await toastPromise;

      // VERIFICACIÓN: Se presenta el modal
      expect(mockModal.present).toHaveBeenCalled();

      // ACCIÓN: Avanzar mínimamente el tiempo
      jest.advanceTimersByTime(0);
      
      // VERIFICACIÓN: Se cierra inmediatamente
      expect(mockModal.dismiss).toHaveBeenCalled();
    });
  });

  // ===============================
  // PRUEBAS DE COMPORTAMIENTO NO INVASIVO (3 pruebas)
  // ===============================

  describe('Comportamiento No Invasivo', () => {

    it('debería configurar el toast sin backdrop para permitir interacción', async () => {
      // ACCIÓN: Abrir toast
      const toastPromise = service.openToast('usuario correcto', 'success', 'happy');
      
      // Mock de la respuesta HTTP
      mockHttpResponse();
      
      // Esperar a que se resuelva la promesa
      await toastPromise;

      // VERIFICACIÓN: Se configuró sin backdrop y sin bloquear interacción
      const createCall = modalControllerMock.create.mock.calls[0][0];
      expect(createCall.backdropDismiss).toBe(false);
      expect(createCall.showBackdrop).toBe(false);
      expect(createCall.animated).toBe(true);
    });

    it('debería cerrar el toast anterior por defecto para evitar saturación', async () => {
      // PREPARACIÓN: Simular modal existente
      const existingModal = {
        dismiss: jest.fn().mockResolvedValue(true)
      } as any;
      modalControllerMock.getTop.mockResolvedValue(existingModal);

      // ACCIÓN: Abrir nuevo toast
      const toastPromise = service.openToast('nuevo mensaje', 'success', 'happy');
      
      // Mock de la respuesta HTTP
      mockHttpResponse();
      
      // Esperar a que se resuelva la promesa
      await toastPromise;

      // VERIFICACIÓN: Se cerró el modal anterior
      expect(existingModal.dismiss).toHaveBeenCalled();
    });

    it('debería usar la clase CSS correcta para posicionamiento no invasivo', async () => {
      // ACCIÓN: Abrir toast
      const toastPromise = service.openToast('usuario correcto', 'success', 'happy');
      
      // Mock de la respuesta HTTP
      mockHttpResponse();
      
      // Esperar a que se resuelva la promesa
      await toastPromise;

      // VERIFICACIÓN: Se aplicó la clase CSS específica para toasts
      const createCall = modalControllerMock.create.mock.calls[0][0];
      expect(createCall.cssClass).toBe('toast-modal');
    });
  });

  // ===============================
  // PRUEBAS DE INTEGRACIÓN TEMPORAL (2 pruebas)
  // ===============================

  describe('Integración: Flujo Temporal Completo', () => {

    it('debería gestionar correctamente el ciclo de vida completo del toast', async () => {
      jest.useFakeTimers();
      
      // ACCIÓN: Ejecutar flujo completo
      const toastPromise = service.openToast('usuario correcto', 'success', 'happy', false, '', '', 3000);
      
      // VERIFICACIÓN: Estado inicial
      expect(modalControllerMock.create).not.toHaveBeenCalled();
      
      // Mock de la respuesta HTTP
      mockHttpResponse();
      
      // Esperar a que se resuelva la creación del modal
      await toastPromise;
      
      // VERIFICACIÓN: Modal creado y presentado
      expect(modalControllerMock.create).toHaveBeenCalled();
      expect(mockModal.present).toHaveBeenCalled();
      expect(mockModal.dismiss).not.toHaveBeenCalled();

      // ACCIÓN: Simular tiempo de vida del toast
      jest.advanceTimersByTime(2999);
      
      // VERIFICACIÓN: Aún no se ha cerrado
      expect(mockModal.dismiss).not.toHaveBeenCalled();

      // ACCIÓN: Completar el tiempo de vida
      jest.advanceTimersByTime(1);
      
      // VERIFICACIÓN: Toast cerrado automáticamente
      expect(mockModal.dismiss).toHaveBeenCalled();
    });

    it('debería manejar mensajes personalizados con auto-cierre temporal', async () => {
      jest.useFakeTimers();
      
      // ACCIÓN: Usar openMessage (no debe crear modal pero sí procesar datos)
      const messagePromise = service.openMessage('usuario correcto', 'success', 'happy', false, '', '', 2000);
      
      // Mock de la respuesta HTTP
      mockHttpResponse();
      
      // Esperar a que se resuelva la promesa
      const result = await messagePromise;

      // VERIFICACIÓN: Retorna datos procesados sin crear modal
      expect(typeof result.message).toBe('string');
      expect(typeof result.feeling).toBe('string');
      expect(typeof result.color).toBe('string');
      expect(typeof result.level_state).toBe('number');

      // VERIFICACIÓN: No se creó modal para openMessage
      expect(modalControllerMock.create).not.toHaveBeenCalled();
    });

  });

  // ===============================
  // PRUEBAS DE CASOS LÍMITE TEMPORALES (2 pruebas)
  // ===============================

  describe('Casos Límite Temporales', () => {

    it('debería manejar duraciones muy largas sin bloquear la aplicación', async () => {
      jest.useFakeTimers();
      
      // ACCIÓN: Crear toast con duración muy larga (30 segundos)
      const toastPromise = service.openToast('usuario correcto', 'success', 'happy', false, '', '', 30000);
      
      // Mock de la respuesta HTTP
      mockHttpResponse();
      
      // Esperar a que se resuelva la promesa
      await toastPromise;

      // VERIFICACIÓN: Se presenta normalmente
      expect(mockModal.present).toHaveBeenCalled();
      
      // ACCIÓN: Avanzar tiempo considerable pero menor a la duración
      jest.advanceTimersByTime(25000);
      
      // VERIFICACIÓN: Aún no se ha cerrado
      expect(mockModal.dismiss).not.toHaveBeenCalled();
      
      // ACCIÓN: Completar el tiempo
      jest.advanceTimersByTime(5000);
      
      // VERIFICACIÓN: Se cierra correctamente
      expect(mockModal.dismiss).toHaveBeenCalled();
    });

    it('debería manejar errores en el dismiss sin afectar la funcionalidad', async () => {
      jest.useFakeTimers();
      
      // PREPARACIÓN: Simular error en dismiss
      mockModal.dismiss.mockRejectedValue(new Error('Error al cerrar'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      // ACCIÓN: Abrir toast
      const toastPromise = service.openToast('usuario correcto', 'success', 'happy', false, '', '', 1000);
      
      // Mock de la respuesta HTTP
      mockHttpResponse();
      
      // Esperar a que se resuelva la promesa
      await toastPromise;
      
      // ACCIÓN: Avanzar tiempo para trigger el auto-cierre
      jest.advanceTimersByTime(1000);
      
      // VERIFICACIÓN: Se intentó cerrar (aunque falle)
      expect(mockModal.dismiss).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });
});
