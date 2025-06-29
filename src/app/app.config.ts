import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { httpinterceptInterceptor } from './httpintercept.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { MessageService } from 'primeng/api';
import { ProgressSpinner } from 'primeng/progressspinner';
import { CommonserviceService } from './commonservice.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([httpinterceptInterceptor])),
    provideAnimationsAsync(),
    provideAnimations(), // Required for animations
    // provideToastr({
    //   timeOut: 3000,
    //   positionClass: 'toast-bottom-right',
    //   preventDuplicates: true
    // }),
    MessageService,
    ProgressSpinner,
    CommonserviceService
  ]
};
