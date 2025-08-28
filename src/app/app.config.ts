// import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
// import { provideRouter } from '@angular/router';
// import { routes } from './app.routes';
// import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
// import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
// import { authInterceptor } from './core/interceptors/auth.interceptor';

// export const appConfig: ApplicationConfig = {
//   providers: [
//     provideBrowserGlobalErrorListeners(),
//     provideZonelessChangeDetection(),
//     provideRouter(routes),
//     provideClientHydration(withEventReplay()),
//     provideHttpClient(
//       withFetch(), // 👈 enable fetch for SSR
//       withInterceptors([authInterceptor]), // 👈 keep your interceptor
   
   
   
   
//     )
//   ]
// };



// import { ApplicationConfig } from '@angular/core';
// import { provideRouter } from '@angular/router';
// import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
// import { SocialAuthServiceConfig, GoogleLoginProvider, FacebookLoginProvider } from '@abacritt/angularx-social-login';

// import { routes } from './app.routes';
// import { authInterceptor } from './core/interceptors/auth.interceptor';
// // Note: I've removed some of your other providers like zoneless for clarity, but you can keep them.

// export const appConfig: ApplicationConfig = {
//   providers: [
//     provideRouter(routes),

//     // HTTP client configuration
//     provideHttpClient(
//       withFetch(),
//       withInterceptors([authInterceptor])
//     ),

//     // Social Auth Service configuration (moved to its own object)
//     {
//       provide: 'SocialAuthServiceConfig',
//       useValue: {
//         autoLogin: false,
//         providers: [
//           {
//             id: GoogleLoginProvider.PROVIDER_ID,
//             provider: new GoogleLoginProvider('1060918648941-f25b5amq8gncf44dpsjrh8gb2rrklilr.apps.googleusercontent.com')
//           },
//           {
//             id: FacebookLoginProvider.PROVIDER_ID,
//             provider: new FacebookLoginProvider('1303578494636945')
//           }
//         ],
//         onError: (err) => {
//           console.error(err);
//         }
//       } as SocialAuthServiceConfig,
//     }
//   ]
// };

// import { ApplicationConfig } from '@angular/core';
// import { provideRouter } from '@angular/router';
// import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
// import { SocialAuthServiceConfig, GoogleLoginProvider, FacebookLoginProvider } from '@abacritt/angularx-social-login';

// import { routes } from './app.routes';
// import { authInterceptor } from './core/interceptors/auth.interceptor';

// export const appConfig: ApplicationConfig = {
//   providers: [
//     provideRouter(routes),

//     // HTTP client configuration
//     provideHttpClient(
//       withFetch(),
//       withInterceptors([authInterceptor])
//     ),

//     // Social Auth Service configuration (moved to be its own top-level provider)
//     {
//       provide: 'SocialAuthServiceConfig',
//       useValue: {
//         autoLogin: false,
//         providers: [
//           {
//             id: GoogleLoginProvider.PROVIDER_ID,
//             provider: new GoogleLoginProvider('1060918648941-f25b5amq8gncf44dpsjrh8gb2rrklilr.apps.googleusercontent.com')
//           },
//           {
//             id: FacebookLoginProvider.PROVIDER_ID,
//             provider: new FacebookLoginProvider('1303578494636945')
//           }
//         ],
//         onError: (err) => {
//           console.error(err);
//         }
//       } as SocialAuthServiceConfig,
//     }
//   ]
// };



// import { ApplicationConfig, importProvidersFrom } from '@angular/core';
// import { provideRouter } from '@angular/router';
// import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
// import {  GoogleLoginProvider, FacebookLoginProvider, SocialLoginModule } from '@abacritt/angularx-social-login';
// import { environment } from '../environments/environment';
// import { routes } from './app.routes';
// import { authInterceptor } from './core/interceptors/auth.interceptor';

// export const appConfig: ApplicationConfig = {
//   providers: [
//     provideRouter(routes),

//     // HTTP client configuration
//     provideHttpClient(
      
//       withFetch(),
//       withInterceptors([authInterceptor])
//     ),

//     // 👇 this is the missing part
//     // importProvidersFrom(SocialLoginModule),

//     // Social Auth Service configuration
//     {
//       provide: 'SocialAuthServiceConfig',
//       useValue: {
//         autoLogin: false,
//         providers: [
//           {
//             id: GoogleLoginProvider.PROVIDER_ID,
//             provider: new GoogleLoginProvider(
//               environment.googleClientId
//             )
//           },
//           {
//             id: FacebookLoginProvider.PROVIDER_ID,
//             provider: new FacebookLoginProvider(environment.facebookAppId)
//           }
//         ],
       
//       }
//     }
//   ]
// };




import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { 
  SocialAuthServiceConfig, 
  GoogleLoginProvider, 
  FacebookLoginProvider
} from '@abacritt/angularx-social-login';

import { environment } from '../environments/environment';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    // Alternative approach - using string token (works with all versions)
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.googleClientId, {
              oneTapEnabled: false,
            }),
          },
        ],
        onError: (err) => {
          console.error('Social Auth Error:', err);
        },
      } as SocialAuthServiceConfig
    }
  ]
};