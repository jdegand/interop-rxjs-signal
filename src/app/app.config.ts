import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import PhotosComponent from './list/photos.component';

// Home route is initially lazy loaded in starter code
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideAnimations(),
    provideRouter(
      [
        {
          path: '',
          pathMatch: 'full',
          component: PhotosComponent,
        },
        {
          path: 'detail',
          loadComponent: () => import('./detail/detail.component'),
        },
        {
          path: '**',
          redirectTo: '',
        },
      ],
      withComponentInputBinding()
    ),
  ],
};
