import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { take, map, catchError } from 'rxjs/operators';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private location: Location
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.getCurrentUser().pipe(
      take(1),
      map(user => {
        if (!user) {
          return false;
        }

        const allowedRoles = route.data['roles'] as Array<string>;
        if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
          this.location.back();
          return false;
        }
        return true;
      }),
      catchError((err) => {
        console.error('Failed to fetch current user:', err);
        return of(false);
      })
    );
  }
}
