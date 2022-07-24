import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpResponse, HttpRequest, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';
import{map} from 'rxjs/operators';
import{AuthenticationService} from '../../core/services/authentication/authentication.service';
import{LoaderService} from '../../core/services/loader/loader.service';
import { finalize } from "rxjs/operators";
import{Router} from '@angular/router';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
    constructor(public authService:AuthenticationService,public loaderService:LoaderService,public router:Router){
    }
    
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        var userId :any;
        const token = this.authService.getToken();
        if(this.authService.getLoggedInUser()  != null ){
            var userId  = this.authService.getLoggedInUser().roles == 'SUPER_ADMIN' ? 0 :  this.authService.getLoggedInUser().id;
        }
        const companyId = (this.authService.getLoggedInUser() != null && this.authService.getLoggedInUser().company != null) ? this.authService.getLoggedInUser().company.id : 0;
        if(token) {
            request = request.clone({
                setHeaders: {
                    'Authorization': `Bearer ${this.authService.getToken()}`,
                    'Content-Type': 'application/json',
                    'userid': userId.toString(),
                    'companyid': companyId.toString(),
                    'role':this.authService.getLoggedInUser().roles[0]
                }
            });
         }
        return next.handle(request).pipe(map((event: HttpEvent<any>) => {
            if(event instanceof HttpResponse) {
            }
            return event;
        }));
    }
}
  