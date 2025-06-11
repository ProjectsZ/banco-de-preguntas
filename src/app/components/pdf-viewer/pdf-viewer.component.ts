import { Component, CUSTOM_ELEMENTS_SCHEMA, input, OnInit, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

// Import the NgxExtendedPdfViewerService from the library
import { NgxExtendedPdfViewerModule, NgxExtendedPdfViewerService } from 'ngx-extended-pdf-viewer';
import { addIcons } from 'ionicons';
import { cloudyNightOutline, partlySunnyOutline } from 'ionicons/icons';


@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss'],
  imports: [ IonContent, IonTitle, IonToolbar, IonHeader, 
    NgxExtendedPdfViewerModule, CommonModule ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ], //CUIDADO: Esto puede evitar que se encuentre el error en los elementos. Si se encuentra un error en el template, eliminar esta línea y revisar el error en consola

})
export class PdfViewerComponent  implements OnInit {

  selectedFile: File | null = null;
  selectedFilePath: string = '';
  selectedFileBase64: string = '';
  isFileImage: boolean = false;
  isFileDocument: boolean = false;

  title = input<any>("Documento Free PDF"); // Title of the PDF viewer
  remotePdfUrl = input<any>(null);
  loadingFull = output<boolean>();
 // remotePdfUrl: string = 'https://raw.githubusercontent.com/ProjectsZ/investigateTheme-pdf.github.io/main/computer-security/S1_fundamentos_(T1-T3)-P1.pdf';
  showRemotePdf: boolean = false;

  modoNoche = false;
  coloreado : 'medium' | 'dark' | 'light' | 'primary' = 'light'; // Default color mode

  constructor(private pdfService: NgxExtendedPdfViewerService) {
    addIcons({
      cloudyNightOutline,
      partlySunnyOutline
    });
  }

  ngOnInit() {

    this.loadRemotePdf();
  }

  loadRemotePdf(): void {
    if (this.remotePdfUrl() !== '') {
      this.showRemotePdf = true;
      this.isFileDocument = false;
      this.isFileImage = false;
    }
  }

  onPagesLoaded(event: any): void {
    this.loadingFull.emit(true); // Set loadingFull to false when pages are loaded
    console.log('Total de páginas:', event.pagesCount);
  }

  changeDiaXnoche(){

    this.modoNoche = !this.modoNoche;
    if(this.modoNoche){
      this.coloreado =  'primary'; // Change color mode based on the night mode
    }else{
      this.coloreado = 'light'; // Change color mode based on the night mode
    }
  }

  onFileSelectedPDF(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedFile = file;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      const result = reader.result as string;
      this.selectedFilePath = result;
      this.selectedFileBase64 = result.split(',')[1];

      const fileType = file.type;

      if (fileType.startsWith('image/')) {
        this.isFileImage = true;
        this.isFileDocument = false;
      } else if (fileType === 'application/pdf') {
        this.isFileImage = false;
        this.isFileDocument = true;
      } else {
        this.isFileImage = false;
        this.isFileDocument = false;
      }
    };
  }

  onFileSelectedDataPDF(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedFile = file;
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      const result = reader.result as string;
      this.selectedFilePath = result;
      this.selectedFileBase64 = result.split(',')[1];

      const fileType = file.type;
      this.isFileImage = fileType.startsWith('image/');
      this.isFileDocument = fileType === 'application/pdf';
    };
  }

  // onFileSelected(event: any): void {
  //   this.selectedFile = event.target.files[0] ?? null;
  //   if (this.selectedFile) {
  //     var reader = new FileReader();
  
  //     reader.readAsDataURL(event.target.files[0]); // read file as data url
  
  //     reader.onload = (event) => { // called once readAsDataURL is completed
  //       let path = event.target == null ? '' : event.target.result;
  //       this.selectedFilePath = path as string;
  //       this.selectedFileBase64 = this.selectedFilePath.split(",")[1];
  //       if (this.selectedFilePath.includes("image")) {
  //         this.isFileImage = true;
  //         this.isFileDocument = false;
  //       } else {
  //         this.isFileImage = false;
  //         this.isFileDocument = true;
  //       }
  //     }
  //   }
  // }

}