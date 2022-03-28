import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { getFirebaseBackend } from '../../authUtils';

import { User } from '../models/auth.models';

import { environment } from "./../../../../src/environments/environment";

@Injectable({ providedIn: 'root' })

export class AuthenticationService {

    user: User;

    env = environment;
    headers = new HttpHeaders().set('Content-Type', 'application/json');
    constructor( private http: HttpClient ) {
    }

    /**
     * Returns the current user
     */
    public currentUser(): User {
        return getFirebaseBackend().getAuthenticatedUser();
    }

    /**
     * Performs the auth
     * @param email email of user
     * @param password password of user
     */
    _login(data: any): Observable<any> {
       return this.http.post(`${this.env.backendServer}/auth`, data);
    }

    /**
     * Performs the register
     * @param email email
     * @param password password
     */
    register(email: string, password: string) {
        return getFirebaseBackend().registerUser(email, password).then((response: any) => {
            const user = response;
            return user;
        });
    }

    /**
     * Reset password
     * @param email email
     */
    resetPassword(email: string) {
        return getFirebaseBackend().forgetPassword(email).then((response: any) => {
            const message = response.data;
            return message;
        });
    }

    /**
     * Logout the user
     */
    logout() {
        // logout the user
        getFirebaseBackend().logout();
    }
}

