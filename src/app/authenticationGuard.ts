import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router, CanActivate } from '@angular/router';

@Injectable({providedIn: 'root'})
export class AuthenticationGuard implements CanActivate{

    constructor(public router: Router, private auth: Auth) {}

    canActivate(): boolean {
        if (this.auth.currentUser==null) {
            this.router.navigate(['login']);
            return false;
        }
        return true;
    }
}