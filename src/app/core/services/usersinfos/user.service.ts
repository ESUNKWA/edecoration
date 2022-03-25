import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  _donnesUtilisateur(): void{
    return JSON.parse(sessionStorage.getItem('userData'));
  }

}
