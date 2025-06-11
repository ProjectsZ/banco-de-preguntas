import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { HomePage } from '../pages/home/home.page';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [ HomePage ],
})
export class Tab1Page {
  constructor() {
    
  }

  loadUser(){
    // Implementar la lógica para cargar el usuario

  }

}
