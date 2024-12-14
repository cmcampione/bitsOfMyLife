import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideState, provideStore } from '@ngrx/store';
import { bitsOfMyLifeReducer } from './bits-of-my-life/bits-of-my-life.reducer';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideEffects } from '@ngrx/effects';
import { BitsOfMyLifeEffects } from './bits-of-my-life/bits-of-my-life.effects';
import { appReducer } from './global/globalMng';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideIonicAngular({}),
    provideStore(),
    provideState({ name: 'AppState', reducer: appReducer }),
    provideState({ name: 'BitsOfMyLifeState', reducer: bitsOfMyLifeReducer }),
    provideEffects(BitsOfMyLifeEffects),
    provideStoreDevtools({
      maxAge: 25, // Retains last 25 states
      logOnly: !isDevMode(), // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
      trace: false, //  If set to true, will include stack trace for every dispatched action, so you can see it in trace tab jumping directly to that part of code
      traceLimit: 75, // maximum stack trace frames to be stored (in case trace option was provided as true)
      connectInZone: true, // If set to true, the connection is established within the Angular zone
      serialize: {
        options: {
          map: true
        }
      }
    })
  ]
};
