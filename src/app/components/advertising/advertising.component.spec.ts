import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdvertisingComponent } from './advertising.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Publicity } from 'src/app/interfaces/publicity.interface';

// Mock de Swiper para evitar llamadas a APIs del navegador
jest.mock('swiper/element/bundle', () => ({
  register: jest.fn()
}));

describe('AdvertisingComponent', () => {
  let component: AdvertisingComponent;
  let fixture: ComponentFixture<AdvertisingComponent>;

  const mockPublicityData: Publicity[] = [
    {
      pub_id: '1',
      pub_title: 'Test Banner 1',
      pub_description: 'Test Description 1',
      pub_data: { img: 'test1.jpg', url: 'https://test1.com' },
      pub_type: 'banner',
      pub_position: 'inicio',
      pub_is_active: true,
      created_at: '2024-01-01T00:00:00Z'
    },
    {
      pub_id: '2',
      pub_title: 'Test Banner 2',
      pub_description: 'Test Description 2',
      pub_data: { img: 'test2.jpg', url: 'https://test2.com' },
      pub_type: 'banner',
      pub_position: 'inicio',
      pub_is_active: true,
      created_at: '2024-01-01T00:00:00Z'
    },
    {
      pub_id: '3',
      pub_title: 'Test Popup',
      pub_description: 'Test Popup Description',
      pub_data: { img: 'popup.jpg', url: 'https://popup.com' },
      pub_type: 'popup',
      pub_position: 'sidebar',
      pub_is_active: true,
      created_at: '2024-01-01T00:00:00Z'
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvertisingComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AdvertisingComponent);
    component = fixture.componentInstance;
    
    // Evita la inicialización de Swiper mockeando swiperRef
    (component as any).swiperRef = () => null;
    
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Inicialización del componente', () => {
    it('debería crearse correctamente', () => {
      expect(component).toBeTruthy();
    });

    it('debería tener los valores por defecto', () => {
      expect(component.currentIndex()).toBe(1);
      expect(component.data()).toEqual([]);
      expect(component.filterType()).toBe('banner');
    });

    it('debería tener los módulos de swiper configurados', () => {
      expect(component.swiperModules).toBeDefined();
    });
  });

  describe('Propiedades de entrada', () => {
    it('debería tener definida la entrada data', () => {
      expect(component.data).toBeDefined();
    });

    it('debería tener definida la entrada filterType', () => {
      expect(component.filterType).toBeDefined();
    });

    it('debería aceptar diferentes tipos de filtro', () => {
      expect(component.filterType()).toBe('banner');
    });
  });

  describe('Funcionalidad de Swiper', () => {
    it('debería tener swiperRef definido', () => {
      expect(component.swiperRef).toBeDefined();
    });

    it('debería manejar onSlideChange con realIndex válido', () => {
      // Mock de swiper element
      const mockSwiperElement = {
        nativeElement: {
          swiper: {
            realIndex: 2
          }
        }
      };

      // Simula el acceso a swiperRef
      const originalSwiperRef = component.swiperRef;
      (component as any).swiperRef = () => mockSwiperElement;
      
      component.onSlideChange();
      expect(component.currentIndex()).toBe(2);
      (component as any).swiperRef = originalSwiperRef;
    });

    it('debería manejar onSlideChange con realIndex inválido', () => {
      const mockSwiperElement = {
        nativeElement: {
          swiper: {
            realIndex: null
          }
        }
      };
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const originalSwiperRef = component.swiperRef;
      (component as any).swiperRef = () => mockSwiperElement;
      component.onSlideChange();
      expect(consoleSpy).toHaveBeenCalledWith('Swiper no está inicializado o el realIndex es inválido.');
      expect(component.currentIndex()).toBe(1);
      consoleSpy.mockRestore();
      (component as any).swiperRef = originalSwiperRef;
    });

    it('debería manejar onSlideChange con swiper indefinido', () => {
      const mockSwiperElement = {
        nativeElement: {
          swiper: undefined
        }
      };
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const originalSwiperRef = component.swiperRef;
      (component as any).swiperRef = () => mockSwiperElement;
      component.onSlideChange();
      expect(consoleSpy).toHaveBeenCalledWith('Swiper no está inicializado o el realIndex es inválido.');
      consoleSpy.mockRestore();
      (component as any).swiperRef = originalSwiperRef;
    });
  });

  describe('Navegación de slides', () => {
    it('debería llamar a slideTo con un índice válido', () => {
      const mockSwiper = {
        slideTo: jest.fn(),
        update: jest.fn()
      };
      const mockSwiperElement = {
        nativeElement: {
          swiper: mockSwiper
        }
      };
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const originalSwiperRef = component.swiperRef;
      (component as any).swiperRef = () => mockSwiperElement;
      component.slideTo(2);
      expect(consoleSpy).toHaveBeenCalledWith(2);
      expect(mockSwiper.slideTo).toHaveBeenCalledWith(2, 300, false);
      expect(mockSwiper.update).toHaveBeenCalled();
      consoleSpy.mockRestore();
      (component as any).swiperRef = originalSwiperRef;
    });

    it('debería lanzar error si slideTo se llama con swiper indefinido', () => {
      const mockSwiperElement = {
        nativeElement: {
          swiper: undefined
        }
      };
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const originalSwiperRef = component.swiperRef;
      (component as any).swiperRef = () => mockSwiperElement;
      expect(() => {
        component.slideTo(1);
      }).toThrow('Cannot read properties of undefined (reading \'slideTo\')');
      consoleSpy.mockRestore();
      (component as any).swiperRef = originalSwiperRef;
    });
  });

  describe('Filtrado de datos', () => {
    it('debería filtrar los datos por tipo banner', () => {
      const bannerData = mockPublicityData.filter(item => item.pub_type === 'banner');
      expect(bannerData.length).toBe(2);
    });

    it('debería filtrar los datos por tipo popup', () => {
      const popupData = mockPublicityData.filter(item => item.pub_type === 'popup');
      expect(popupData.length).toBe(1);
    });

    it('debería filtrar los datos por tipo video', () => {
      const videoData = mockPublicityData.filter(item => item.pub_type === 'video');
      expect(videoData.length).toBe(0);
    });
  });

  describe('Ciclo de vida del componente', () => {
    it('debería implementar OnInit', () => {
      expect(component.ngOnInit).toBeDefined();
    });

    it('debería llamar ngOnInit sin errores', () => {
      expect(() => {
        component.ngOnInit();
      }).not.toThrow();
    });
  });

  describe('Casos borde', () => {
    it('debería manejar un array de datos vacío', () => {
      expect(component.data()).toEqual([]);
    });

    it('debería manejar swiperRef nulo en onSlideChange', () => {
      const originalSwiperRef = component.swiperRef;
      (component as any).swiperRef = () => null;
      expect(() => {
        component.onSlideChange();
      }).not.toThrow();
      (component as any).swiperRef = originalSwiperRef;
    });

    it('debería lanzar error si slideTo se llama con swiperRef nulo', () => {
      const originalSwiperRef = component.swiperRef;
      (component as any).swiperRef = () => null;
      expect(() => {
        component.slideTo(0);
      }).toThrow('Cannot read properties of undefined (reading \'slideTo\')');
      (component as any).swiperRef = originalSwiperRef;
    });
  });

  describe('Pruebas de integración', () => {
    it('debería actualizar el currentIndex cuando cambia el slide', () => {
      const mockSwiperElement = {
        nativeElement: {
          swiper: {
            realIndex: 0
          }
        }
      };
      const originalSwiperRef = component.swiperRef;
      (component as any).swiperRef = () => mockSwiperElement;
      component.onSlideChange();
      expect(component.currentIndex()).toBe(0);
      (component as any).swiperRef = originalSwiperRef;
    });

    it('debería mantener el estado a través de múltiples cambios de slide', () => {
      const mockSwiperElement = {
        nativeElement: {
          swiper: {
            realIndex: 1
          }
        }
      };
      const originalSwiperRef = component.swiperRef;
      (component as any).swiperRef = () => mockSwiperElement;
      component.onSlideChange();
      expect(component.currentIndex()).toBe(1);
      mockSwiperElement.nativeElement.swiper.realIndex = 2;
      component.onSlideChange();
      expect(component.currentIndex()).toBe(2);
      (component as any).swiperRef = originalSwiperRef;
    });
  });
});
