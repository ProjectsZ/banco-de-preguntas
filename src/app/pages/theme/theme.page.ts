import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonBackButton, 
  IonButtons,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon,
  IonButton,
  IonSpinner,
  IonChip,
  IonLabel,
  IonText,
  IonAlert
} from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { 
  informationCircleOutline,
  documentTextOutline,
  calendarOutline,
  folderOutline,
  documentOutline,
  eyeOutline,
  helpCircleOutline,
  diamondOutline,
  chevronBackOutline,
  libraryOutline
} from 'ionicons/icons';
import { User } from 'src/app/interfaces/user.interface';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { ToastService } from 'src/app/components/toast/toast.service';

interface DocumentItem {
  author: string;
  title: string;
  uri: string;
}

interface ThemeData {
  cat_id: string;
  cat_title?: string;
  cat_subtitle: string;
  cat_description: string;
  cat_img: string;
  cat_doc: DocumentItem[];
  cat_color: string | null;
  cat_badge: string | null;
  cat_crs_id: string;
  created_at: string;
}

@Component({
  selector: 'app-theme',
  templateUrl: './theme.page.html',
  styleUrls: ['./theme.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    IonBackButton, 
    IonButtons,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonIcon,
    IonButton,
    IonSpinner,
    IonChip,
    IonLabel,
    IonText,
    IonAlert,
  ]
})
export class ThemePage implements OnInit, OnDestroy {

  themeData: ThemeData | null = null;
  isLoading = signal<boolean>(false);

  private toastS = inject(ToastService);

  // Usuario actual
  currentUser!: User;
  private userSubscription: Subscription | null = null;
  private authS = inject(AuthService);

  // Variables de alerta
  isSubmitConfirm = signal<boolean>(false);
  alertButtons = signal<any>(['Action']);
  alertMessage = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    addIcons({
      informationCircleOutline,
      documentTextOutline,
      calendarOutline,
      folderOutline,
      documentOutline,
      eyeOutline,
      helpCircleOutline,
      diamondOutline,
      chevronBackOutline,
      libraryOutline
    });

    // Suscripción al usuario actual
    this.userSubscription = this.authS.currentUser.subscribe({
      next: (user) => {
        this.currentUser = user;
      },
      error: (err) => {
        console.error('Error al obtener datos del usuario:', err);
      }
    });
  }

  ngOnInit() {
    this.loadThemeData();
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  async loadThemeData() {
    this.isLoading.set(true);
    
    try {
      // Simular carga de datos del tema
      // En una implementación real, esto vendría de un servicio
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Datos de ejemplo basados en la estructura proporcionada
      this.themeData = {
        cat_id: '474a81eb-31f0-4aa0-9ed5-8c65c1c9f4cc',
        cat_subtitle: 'Fundamentos Seguridad Informatica',
        cat_description: 'Como resultado de la asignatura se espera que los estudiantes tengan los conocimientos básicos para enfrentar y resolver problemas relacionadas con la seguridad informática. Seguridad de infraestructura. Protocolos seguros de comunicaciones. Ataques comunes. Análisis de vulnerabilidades. Técnicas de intrusión.',
        cat_img: 'https://res.cloudinary.com/dqmjvhsxe/image/upload/v1751465293/fundamentos_SI-min_gmpw6i_p7zydw.webp',
        cat_doc: [
          {
            author: 'Apuntes propios, Dr. marchand W, WMN2025 v.1.1',
            title: 'Fundamentos-Seguridad-Informatica',
            uri: 'https://raw.githubusercontent.com/ProjectsZ/investigateTheme-pdf.github.io/main/computer-security/S1_fundamentos_(T1-T3)-P1.pdf'
          },
          {
            author: 'Apuntes propios, Dr. Marchand W, WMN2025 v.1.1',
            title: 'Conceptos Teóricos y Operativos de Redes y Sistemas',
            uri: 'https://raw.githubusercontent.com/ProjectsZ/investigateTheme-pdf.github.io/main/computer-security/S6_conceptos-teOricos-y-operativos-de-redes-y-sistemas.pdf'
          },
          {
            author: 'Apuntes propios, Dr. Marchand W, WMN2025 v.1.1',
            title: 'Material de Exposición',
            uri: 'https://raw.githubusercontent.com/ProjectsZ/investigateTheme-pdf.github.io/main/computer-security/S8_expo.pdf'
          }
        ],
        cat_color: '007bff',
        cat_badge: null,
        cat_crs_id: 'ff22bf16-1cd3-4ecd-8728-4ea4b052385b',
        created_at: '2025-04-08T23:15:41.422152'
      };
      
    } catch (error) {
      console.error('Error al cargar datos del tema:', error);
      this.toastS.openToast('Error al cargar el tema', 'danger', 'angry', true);
    } finally {
      this.isLoading.set(false);
    }
  }

  // Métodos de utilidad
  formatDescription(description: string): string {
    if (!description) return '';
    return description.replace(/\n/g, '<br>');
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  onImageError(event: any) {
    event.target.style.display = 'none';
  }

  // Métodos de alerta
  setAlertMessage(msg: string | null) {
    this.alertMessage.set(msg);
  }

  setIsSubmitConfirm(val: boolean, isGoBack = false) {
    if (isGoBack) {
      this.setAlertMessage(null);
    }
    this.isSubmitConfirm.set(val);
  }



  openDocument(documentUri?: string) {
    const uri = documentUri || (this.themeData?.cat_doc?.[0]?.uri);
    if (!uri) return;

    // Aquí puedes implementar la lógica para abrir el documento
    // Por ejemplo, navegar a un PDF viewer o abrir en una nueva ventana
    console.log('Abriendo documento:', uri);
    
    // Ejemplo: abrir en nueva ventana
    window.open(uri, '_blank');
    
    this.toastS.openToast('Documento abierto', 'success', 'happy', true);
  }

  goToQuiz() {
    // Navegar a la página de quiz relacionada con este tema
    this.router.navigate(['/quiz'], {
      queryParams: {
        themeId: this.themeData?.cat_id,
        themeTitle: this.themeData?.cat_title
      }
    });
  }
}
