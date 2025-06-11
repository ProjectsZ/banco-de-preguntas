import { Component, EnvironmentInjector, inject } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { triangle, ellipse, square, libraryOutline, bookOutline, schoolOutline } from 'ionicons/icons';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, TranslateModule],
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);
  private translate = inject(TranslateService);

  public detectDate = new Date().getTime();
  
  constructor() {
    // console.log('date', this.detectDate);
    addIcons({ 
      libraryOutline,
      bookOutline,
      schoolOutline
    });
    
    // Make sure the translation service is available
    const browserLang = this.translate.getBrowserLang();
    this.translate.use(browserLang?.match(/es|en/) ? browserLang : 'es');
  }
}
