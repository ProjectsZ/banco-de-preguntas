import { Component, Inject, inject, input, OnInit } from '@angular/core';
import { Question } from 'src/app/interfaces/question.interface';
import { IonItem, IonItemGroup, IonLabel, IonText, IonIcon, IonRadio, IonChip, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonButton } from "@ionic/angular/standalone";
import { TextHighlightPipe } from 'src/app/pipes/text-highlight.pipe';

@Component({
  selector: 'app-view-answer',
  templateUrl: './view-answer.component.html',
  styleUrls: ['./view-answer.component.scss'],
  imports: [IonCardTitle, IonCardHeader, IonCardContent, IonCard, IonChip, IonRadio, IonIcon, IonText, IonLabel, IonItemGroup, IonItem,
    TextHighlightPipe
   ],
})
export class ViewAnswerComponent  implements OnInit {

  readonly question = input<Question>();
  readonly index = input<number>(0);

  readonly seeAnswer = input<boolean>(false);

  constructor() {

  }

  ngOnInit() {}

   /***************************************************************** */
 
}
