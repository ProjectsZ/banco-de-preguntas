import { Component, input, OnInit, output } from '@angular/core';
import { IonButton, IonText } from "@ionic/angular/standalone";

@Component({
  selector: 'app-text-outline-button',
  templateUrl: './text-outline-button.component.html',
  styleUrls: ['./text-outline-button.component.scss'],
  imports: [IonText, IonButton, ],
})
export class TextOutlineButtonComponent  implements OnInit {

  fill = input<string>('outline');
  buttonColor = input<string>('lightgray');
  text = input();
  textColor = input<string | null>();
  tapped = output<boolean>();

  constructor() { }

  ngOnInit() {}

  onClick(){
    this.tapped.emit(true);
  }

}
