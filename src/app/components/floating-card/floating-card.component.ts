import { Component, input, OnInit } from '@angular/core';
import { TextHighlightPipe } from 'src/app/pipes/text-highlight.pipe';
import { Dictionary } from 'src/interfaces/dictionary.interface';

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
