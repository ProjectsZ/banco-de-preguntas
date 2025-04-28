import { Component, Inject, inject, input, OnInit } from '@angular/core';
import { IonItem, IonItemGroup, IonLabel, IonText, IonIcon, IonRadio, IonChip, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonButton } from "@ionic/angular/standalone";
import { Question } from 'src/interfaces/question.interface';

@Component({
  selector: 'app-view-answer',
  templateUrl: './view-answer.component.html',
  styleUrls: ['./view-answer.component.scss'],
  imports: [IonCardTitle, IonCardHeader, IonCardContent, IonCard, IonChip, IonRadio, IonIcon, IonText, IonLabel, IonItemGroup, IonItem,

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
