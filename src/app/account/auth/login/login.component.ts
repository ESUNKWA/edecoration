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
      p_login: ['', [Validators.required, Validators.minLength(4)]],
      p_mdp: ['', [Validators.required]],
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
    this.error = '';
    this.btnspinner = true;

    try {

        this.authenticationService._login(this.loginForm.value).subscribe(
        (res: any = {})=>{
  console.log(res);

          switch(res._status){
            case 0:
              this.error = res._result;
              break;

            case 1:
              sessionStorage.setItem('userData', JSON.stringify(res._result));
              this.router.navigate(['/edeco/dashboard']);
              break;

            default:
              this.error = res._result;
              break;
          }

          this.btnspinner = false;
        }
      );

    } catch (error) {
      console.log(error);

    }


  }

}
