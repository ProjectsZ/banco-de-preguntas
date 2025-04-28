import { CommonModule } from '@angular/common';
import { Component, input, OnInit, output } from '@angular/core';
import { IonButton, IonIcon } from "@ionic/angular/standalone";

@Component({
  selector: 'app-icon-clear-button',
  templateUrl: './icon-clear-button.component.html',
  styleUrls: ['./icon-clear-button.component.scss'],
  imports: [IonIcon, IonButton,
    CommonModule
   ],
})
export class IconClearButtonComponent  implements OnInit {

  title = input<string>('');
  iconColor = input<string>('');
  fill = input<string>('solid');
  isMarked = input<boolean>(false);
  tapped = output<string>();

  constructor() { }

  ngOnInit() {}

  onClick(){
    this.tapped.emit(this.title());
  }

}
