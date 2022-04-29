import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NotifService {
dkem: any;
  constructor() { }

  sendMessage(message: any, type: any){
    switch (type) {
      case 'success':
        Swal.fire({
          icon: type,
          title: 'Super !!!',
          text: message,
          footer: '<a href="">Eden décoration</a>'
        });
      break;

      case 'warning':
        Swal.fire({
          icon: type,
          title: 'Attention !!!',
          text: message,
          footer: '<a href="">Eden décoration</a>'
        });
        break;

      case 'error':
        Swal.fire({
          icon: type,
          title: 'Erreur !!!',
          text: message,
          footer: '<a href="">Eden décoration</a>'
        });
        break;

      default:
        break;
    }
  }

}
