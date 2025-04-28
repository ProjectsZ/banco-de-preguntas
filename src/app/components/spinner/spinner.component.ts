import { Component, input, OnInit } from '@angular/core';
import { IonSpinner } from "@ionic/angular/standalone";


@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  imports: [IonSpinner, ],
})
export class SpinnerComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
