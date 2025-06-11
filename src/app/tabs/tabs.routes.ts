import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { AuthGuard } from '../guards/auth.guard';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadComponent: () =>
          import('../tab1/tab1.page').then((m) => m.Tab1Page),
        // canActivate: [AuthGuard]
      },
      {
        path: 'tab2',
        loadComponent: () =>
          import('../tab2/tab2.page').then((m) => m.Tab2Page),
        // canActivate: [AuthGuard],
      },
      {
        path: 'tab3',        
        children: [
          { 
            path: '', loadComponent: () => import('../tab3/tab3.page').then((m) => m.Tab3Page), 
            // canActivate: [AuthGuard],
          },
          { 
            path: 'quiz', loadComponent: () => import('../pages/quiz/quiz.page').then((m) => m.QuizPage), 
            // canActivate: [AuthGuard]
          },
          {
            path: 'settings',
            loadComponent: () => import('../pages/settings/settings.page').then( m => m.SettingsPage),
            // canActivate: [AuthGuard]
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
];
