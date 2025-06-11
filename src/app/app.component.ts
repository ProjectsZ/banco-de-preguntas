import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet, isPlatform, Platform } from '@ionic/angular/standalone';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { from } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {

  
  public detectDate = new Date().getTime();

  private platform = inject(Platform);


  constructor() {
    this.platform.ready().then(()=>{
      setTimeout(()=>{
        this.customStatusBar(true);
      }, 2500);
    });
  }

  async customStatusBar(primaryColor: boolean = false){
    if(Capacitor.getPlatform() != 'web'){
      await StatusBar.setStyle({
        style: primaryColor ? Style.Dark : Style.Light,
       
      });
      if(isPlatform('android')){
        // StatusBar.setBackgroundColor({
        //   color: primaryColor ? '#141e30' : '#ffffff',
        // });
        await StatusBar.setBackgroundColor({
          color: primaryColor ? '#141e30' : '#ffffff',
        });
  
        // Esto es fundamental: evita que se superponga a la app
        await StatusBar.setOverlaysWebView({ overlay: false });

      }
    }
  }


}
