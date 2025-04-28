import { CommonModule } from '@angular/common';
import { Component, input, OnInit } from '@angular/core';
import { IonAvatar, IonText } from "@ionic/angular/standalone";

@Component({
  selector: 'app-circle-text',
  templateUrl: './circle-text.component.html',
  styleUrls: ['./circle-text.component.scss'],
  imports: [IonText, IonAvatar,
    CommonModule
   ]
})
export class CircleTextComponent  implements OnInit {

  title = input<string>('');
  text = input<any>(null);
  bgColor = input<string>('light');
  textColor = input<boolean>(false);

  constructor() { }

  ngOnInit() {}

}
