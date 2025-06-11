import { Component, input, OnInit } from '@angular/core';
import { Dictionary } from 'src/app/interfaces/dictionary.interface';
import { TextHighlightPipe } from 'src/app/pipes/text-highlight.pipe';

@Component({
  selector: 'app-floating-card',
  templateUrl: './floating-card.component.html',
  styleUrls: ['./floating-card.component.scss'],
  imports: [ TextHighlightPipe ],
})
export class FloatingCardComponent  implements OnInit {

  wordX = input<number>(0);
  wordY = input<number>(0);
  dictionary = input<Dictionary | any>(null);

  constructor() { }

  ngOnInit() {}

}
