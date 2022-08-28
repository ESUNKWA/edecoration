import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CryptDataService {
  env = environment;

  JsonFormatter = {
    stringify: function(cipherParams) {
      // create json object with ciphertext
      var jsonObj: any = { ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64) };
  ​
      // optionally add iv or salt
      if (cipherParams.iv) {
        jsonObj.iv = cipherParams.iv.toString();
      }
  ​
      if (cipherParams.salt) {
        jsonObj.s = cipherParams.salt.toString();
      }
  ​
      // stringify json object
      return JSON.stringify(jsonObj);
    },
    parse: function(jsonStr) {
      // parse json string
      var jsonObj = JSON.parse(jsonStr);
  ​
      // extract ciphertext from json object, and create cipher params object
      var cipherParams = CryptoJS.lib.CipherParams.create({
        ciphertext: CryptoJS.enc.Base64.parse(jsonObj.ct)
      });
  ​
      // optionally extract iv or salt
  ​
      if (jsonObj.iv) {
        cipherParams.iv = CryptoJS.enc.Hex.parse(jsonObj.iv);
      }
  ​
      if (jsonObj.s) {
        cipherParams.salt = CryptoJS.enc.Hex.parse(jsonObj.s);
      }
  ​
      return cipherParams;
    }
  };

  constructor() { }

  public crypt(data: any = {}){
    return CryptoJS.AES.encrypt(JSON.stringify(data),
            this.env.cryptPassword,{
            format: this.JsonFormatter
          }).toString();
  }

  public decrypt(data: any){
    return JSON.parse(CryptoJS.AES.decrypt(JSON.stringify(data), this.env.cryptPassword,{format: this.JsonFormatter}).toString(CryptoJS.enc.Utf8));
  }

}
