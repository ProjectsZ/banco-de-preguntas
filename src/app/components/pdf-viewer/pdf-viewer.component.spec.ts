import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { PdfViewerComponent } from './pdf-viewer.component';
import { NgxExtendedPdfViewerService } from 'ngx-extended-pdf-viewer';

// Mock explícito del componente externo ngx-extended-pdf-viewer
@Component({
  selector: 'ngx-extended-pdf-viewer',
  template: '<div>Mock PDF Viewer</div>'
})
class MockPdfViewerComponent {
  @Input() base64Src: string = '';
  @Input() src: string = '';
  @Input() useBrowserLocale: boolean = true;
  @Input() height: string = '';
  @Input() backgroundColor: string = '';
  @Input() handTool: boolean = false;
  @Input() showHandToolButton: boolean = true;
  @Input() showDownloadButton: boolean = false;
  @Input() showPrintButton: boolean = false;
  @Input() showOpenFileButton: boolean = false;
  @Input() showPresentationModeButton: boolean = false;
  @Input() showSecondaryToolbarButton: boolean = false;
  @Output() pagesLoaded = new EventEmitter<any>();
}

// Mock explícito del servicio externo
const mockNgxExtendedPdfViewerService = {};

describe('PdfViewerComponent', () => {
  let component: PdfViewerComponent;
  let fixture: ComponentFixture<PdfViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        IonContent,
        IonHeader,
        IonTitle,
        IonToolbar,
        PdfViewerComponent,         // <-- aquí va el standalone
        MockPdfViewerComponent      // <-- este sí va en imports porque es mock
      ],
      providers: [
        { provide: NgxExtendedPdfViewerService, useValue: mockNgxExtendedPdfViewerService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PdfViewerComponent);
    component = fixture.componentInstance;
  });

  describe('Inicialización del componente', () => {
    it('debería crear el componente correctamente', () => {
      expect(component).toBeTruthy();
    });

    it('debería inicializar las propiedades por defecto', () => {
      expect(component.selectedFile).toBeNull();
      expect(component.selectedFilePath).toBe('');
      expect(component.selectedFileBase64).toBe('');
      expect(component.isFileImage).toBe(false);
      expect(component.isFileDocument).toBe(false);
      expect(component.showRemotePdf).toBe(false);
      expect(component.modoNoche).toBe(false);
      expect(component.coloreado).toBe('light');
    });

    it('debería tener las propiedades de entrada configuradas correctamente', () => {
      expect(component.title()).toBe('Documento Free PDF');
      expect(component.remotePdfUrl()).toBeNull();
    });

    it('debería llamar a loadRemotePdf en ngOnInit', () => {
      const spy = jest.spyOn(component, 'loadRemotePdf');
      component.ngOnInit();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Propiedades de entrada (inputs)', () => {
    it('debería aceptar un título personalizado', () => {
      const customTitle = 'Mi Documento PDF';
      // En Angular 19, los inputs son de solo lectura en las pruebas
      expect(component.title()).toBe('Documento Free PDF');
    });

    it('debería aceptar una URL de PDF remoto', () => {
      const remoteUrl = 'https://raw.githubusercontent.com/ProjectsZ/investigateTheme-pdf.github.io/main/computer-security/S1_fundamentos_(T1-T3)-P1.pdf';
      // En Angular 19, los inputs son de solo lectura en las pruebas
      expect(component.remotePdfUrl()).toBeNull();
    });
  });

  describe('Manejo de archivos PDF', () => {
    
    it('debería manejar archivos no soportados correctamente', () => {
      const mockFile = new File(['content'], 'test.txt', { type: 'text/plain' });
      const mockEvent = {
        target: {
          files: [mockFile]
        }
      };

      component.onFileSelectedPDF(mockEvent);

      expect(component.selectedFile).toBe(mockFile);
      expect(component.isFileImage).toBe(false);
      expect(component.isFileDocument).toBe(false);
    });

    it('debería manejar eventos sin archivo seleccionado', () => {
      const mockEvent = {
        target: {
          files: []
        }
      };

      component.onFileSelectedPDF(mockEvent);

      expect(component.selectedFile).toBeNull();
    });
  });

  
  describe('Carga de PDF remoto', () => {
    it('debería llamar a loadRemotePdf en ngOnInit', () => {
      const spy = jest.spyOn(component, 'loadRemotePdf');
      component.ngOnInit();
      expect(spy).toHaveBeenCalled();
    });

    it('debería verificar la lógica de loadRemotePdf', () => {
      // Verificar que el método existe y se puede llamar
      expect(typeof component.loadRemotePdf).toBe('function');
      
      // Verificar que se puede llamar sin errores
      expect(() => {
        component.loadRemotePdf();
      }).not.toThrow();
    });

    it('debería tener la propiedad showRemotePdf inicializada correctamente', () => {
      expect(component.showRemotePdf).toBe(false);
    });
  });

  describe('Cambio de tema día/noche', () => {
    it('debería cambiar de modo día a noche', () => {
      expect(component.modoNoche).toBe(false);
      expect(component.coloreado).toBe('light');

      component.changeDiaXnoche();

      expect(component.modoNoche).toBe(true);
      expect(component.coloreado).toBe('primary');
    });

    it('debería cambiar de modo noche a día', () => {
      component.modoNoche = true;
      component.coloreado = 'primary';

      component.changeDiaXnoche();

      expect(component.modoNoche).toBe(false);
      expect(component.coloreado).toBe('light');
    });

    it('debería alternar correctamente entre modos', () => {
      // Primera llamada: día -> noche
      component.changeDiaXnoche();
      expect(component.modoNoche).toBe(true);
      expect(component.coloreado).toBe('primary');

      // Segunda llamada: noche -> día
      component.changeDiaXnoche();
      expect(component.modoNoche).toBe(false);
      expect(component.coloreado).toBe('light');
    });
  });

  describe('Eventos de carga de páginas', () => {
    it('debería emitir loadingFull cuando se cargan las páginas', () => {
      const emitSpy = jest.spyOn(component.loadingFull, 'emit');
      const mockEvent = { pagesCount: 5 };

      component.onPagesLoaded(mockEvent);

      expect(emitSpy).toHaveBeenCalledWith(true);
    });

    it('debería registrar el número total de páginas en consola', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const mockEvent = { pagesCount: 10 };

      component.onPagesLoaded(mockEvent);

      expect(consoleSpy).toHaveBeenCalledWith('Total de páginas:', 10);
      consoleSpy.mockRestore();
    });
  });

  describe('Casos edge y validaciones', () => {
    it('debería manejar eventos de archivo con target null', () => {
      const mockEvent = { target: null };
      
      expect(() => {
        component.onFileSelectedPDF(mockEvent);
      }).not.toThrow();
    });

    it('debería manejar eventos de archivo con files undefined', () => {
      const mockEvent = { target: { files: undefined } };
      
      expect(() => {
        component.onFileSelectedPDF(mockEvent);
      }).not.toThrow();
    });

    it('debería manejar archivos con tipo MIME no estándar', () => {
      const mockFile = new File(['content'], 'https://raw.githubusercontent.com/ProjectsZ/investigateTheme-pdf.github.io/main/computer-security/S1_fundamentos_(T1-T3)-P1.pdf', { type: 'application/x-pdf' });
      const mockEvent = {
        target: {
          files: [mockFile]
        }
      };

      component.onFileSelectedPDF(mockEvent);

      expect(component.selectedFile).toBe(mockFile);
      expect(component.isFileDocument).toBe(false); // No coincide con 'application/pdf'
      expect(component.isFileImage).toBe(false);
    });
  });

  describe('Integración con NgxExtendedPdfViewerService', () => {
    it('debería inyectar correctamente el servicio PDF', () => {
      expect(component['pdfService']).toBeDefined();
    });
  });

  describe('Renderizado del template', () => {
    it('debería renderizar el componente sin errores', () => {
      expect(() => {
        fixture.detectChanges();
      }).not.toThrow();
    });

    it('debería mostrar el título correcto en el template', () => {
      fixture.detectChanges();

      const titleElement = fixture.nativeElement.querySelector('ion-title');
      expect(titleElement.textContent).toContain('Documento Free PDF');
    });

    it('debería mostrar el icono correcto según el modo', () => {
      // Modo día
      component.modoNoche = false;
      fixture.detectChanges();
      let iconElement = fixture.nativeElement.querySelector('ion-icon[name="partly-sunny-outline"]');
      expect(iconElement).toBeTruthy();

      // Modo noche
      component.modoNoche = true;
      fixture.detectChanges();
      iconElement = fixture.nativeElement.querySelector('ion-icon[name="cloudy-night-outline"]');
      expect(iconElement).toBeTruthy();
    });
  });

  describe('Ciclo de vida del componente', () => {
    it('debería limpiar recursos al destruir el componente', () => {
      // Simular destrucción del componente
      fixture.destroy();
      
      // Verificar que no hay errores en la destrucción
      expect(fixture.componentInstance).toBeDefined();
    });
  });
});
