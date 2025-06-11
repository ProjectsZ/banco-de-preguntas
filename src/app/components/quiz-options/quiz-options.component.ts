import { CommonModule } from '@angular/common';
import { Component, inject, input, model, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonRadioGroup, IonItem, IonRadio, IonLabel, IonIcon } from "@ionic/angular/standalone";
import { ToastService } from '../toast/toast.service';

@Component({
  selector: 'app-quiz-options',
  templateUrl: './quiz-options.component.html',
  styleUrls: ['./quiz-options.component.scss'],
  imports: [IonIcon, IonLabel, IonRadio, IonItem, IonRadioGroup,
    CommonModule, FormsModule
  ],
})
export class QuizOptionsComponent  implements OnInit {

  options = input<string[]>([]);

  selectedOption = model<string | null | undefined>(null);
  readonly freezeAction = input<boolean>(false);

  private debounceTimeout: any;

  // usuarios premium
  content = input<string>("");
  role = input<any>('ESTUDIANTE');

  private toastS = inject(ToastService);

  // thema color
  colorTheme = input<string>("light");

  constructor() { }

  ngOnInit() {}

   // Crear un getter para acceder al valor de colorTheme
  get currentColorTheme(): string {
    return this.colorTheme();  // Accede al valor de la señal
  }

  setOption(index: number){
    console.log("Selected option: ", index);

    if(this.freezeAction()){
      return;
    }

    // clear any existing debounce timer
    clearTimeout(this.debounceTimeout);

    // set a debounce timer
    this.debounceTimeout = setTimeout(() => {
      const selectedOption = this.selectedOption();
      console.log("Selected option: ", selectedOption);

      const option: string = this.options()[index];
      console.log("Selected option: ", option);

      // Toggle the option if it's already selected, else select it
      const newSelection = selectedOption === option ? null : option;

      this.selectedOption.set(newSelection);
      console.log("New selection: ", this.selectedOption());

      // mostrar el cat mascota con mensaje
      console.log(this.role());
      if((this.role() === 'PLUS') || (this.role() === 'ADMIN')){
        this.toastS.openToast(`${ this.content() }`,"success", "happy", true);
      }
      

    }, 100);
  }

}
