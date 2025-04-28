import { Component, input, OnInit, output } from '@angular/core';
import { IonItem, IonItemDivider, IonRow, IonCol, IonButton, IonText, IonIcon } from "@ionic/angular/standalone";
import { TextOutlineButtonComponent } from '../widgets/text-outline-button/text-outline-button.component';
import { CommonModule } from '@angular/common';
import { IconClearButtonComponent } from '../widgets/icon-clear-button/icon-clear-button.component';
import { addIcons } from 'ionicons';
import { checkbox, checkboxOutline, checkmarkOutline } from 'ionicons/icons';
import { Question } from 'src/interfaces/question.interface';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
  imports: [IonIcon, IonText, IonButton, IonCol, IonRow, IonItemDivider, TextOutlineButtonComponent, IconClearButtonComponent,
    CommonModule
   ],
})
export class ReviewComponent  implements OnInit {

  readonly questions = input<Question[]>([]);
  slide = output<any>();
  submitQuiz = output<boolean>();

  constructor() { }

  ngOnInit() {
    addIcons({
      checkmarkOutline,
      checkbox,
      checkboxOutline
    })
  }

  openSlide(index: number){
    this.slide.emit(index);
  }

  onSubmit(){
    this.submitQuiz.emit(true);
  }

}
