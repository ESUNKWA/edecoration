import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthenticationService } from '../../../core/services/auth.service';

import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

/**
 * Login component
 */
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  submitted = false;
  error = '';
  returnUrl: string;

  // set the currenr year
  year: number = new Date().getFullYear();
  btnspinner: boolean = false;

  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      p_login: ['admin', [Validators.required, Validators.minLength(4)]],
      p_mdp: ['admin', [Validators.required]],
    });

    // reset login status
    // this.authenticationService.logout();
    // get return url from route parameters or default to '/'
    // tslint:disable-next-line: no-string-literal
    //this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get getControl(){
    return this.loginForm.controls;
  }

  // convenience getter for easy access to form fields
  //get f() { return this.loginForm.controls; }

  /**
   * Form submit
   */
  onSubmit() {

    this.btnspinner = true;
    this.authenticationService._login(this.loginForm.value).subscribe(
      (res: any = {})=>{
        if( res._status == 1 ){
          sessionStorage.setItem('userData', JSON.stringify(res._result));
          setTimeout(() => {
            this.btnspinner = false;
            this.router.navigate(['/edeco/dashboard']);
          }, 500);
        }
      }
    )
  }
}
