import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, input, OnInit, signal, viewChild } from '@angular/core';
import { IonicSlides } from '@ionic/core';
import { Publicity } from 'src/app/interfaces/publicity.interface';
import { register } from 'swiper/element/bundle';

register();

@Component({
  selector: 'app-advertising',
  templateUrl: './advertising.component.html',
  styleUrls: ['./advertising.component.scss'],
  imports:[],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
})
export class AdvertisingComponent  implements OnInit {

  currentIndex = signal<number>(1);


  swiperRef = viewChild<ElementRef>('swiper');
  swiperModules = [IonicSlides];

  data = input<Publicity[]>([]);
  filterType = input<'banner' | 'popup' | 'video'>("banner");

  constructor() { }

  ngOnInit() {}

  onSlideChange() {
    const swiperElement = this.swiperRef()?.nativeElement;
    const realIndex = swiperElement?.swiper?.realIndex;

    if (typeof realIndex === 'number') {
      this.currentIndex.set(realIndex);
      // console.log('index:', realIndex);
    } else {
      console.error('Swiper no está inicializado o el realIndex es inválido.');
    }
  }


  slideTo(index: number){
    console.log(index);
    const swiperElement = this.swiperRef()?.nativeElement.swiper;
    swiperElement.slideTo(index, 300, false);
    swiperElement.update();
  }


}
