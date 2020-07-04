import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Observable, Subject } from 'rxjs';
import { finalize, takeUntil, tap } from 'rxjs/operators';
import { DataService } from '../../data.service' 
import { UserService } from '../../user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent {

  loginForm: FormGroup;

  private unsubscribe: Subject<any>;

  constructor(
    private router: Router,
    private fb: FormBuilder, private userService : UserService,
    private dataService: DataService
  ) {
    this.unsubscribe = new Subject();
  }


  ngOnInit(): void {
    this.initLoginForm();
  }


  initLoginForm() {

    this.loginForm = this.fb.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.email,
        Validators.minLength(3),
        Validators.maxLength(320)
      ])
      ],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ])
      ]
    });
  }

  submit(){
    const controls = this.loginForm.controls;
		/** check form */
		if (this.loginForm.invalid) {
      console.log(this.loginForm.invalid)
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			return;
    }
    
    const authData = {
			email: controls['email'].value,
			password: controls['password'].value
		};

    this.dataService.login(authData.email, authData.password)
			.pipe(
				tap(user => {
          console.log(user);
          this.userService.setRoleBasedMenu(user['payLoad']['jsonData'])  
          this.userService.setUserDetails(user['payLoad'].userDetails);
					this.router.navigateByUrl('/dashboard'); // Main page
				}),
				takeUntil(this.unsubscribe),
				finalize(() => {
					
				})
			)
			.subscribe();
  }


  /**
	 * Checking control validation
	 *
	 * @param controlName: string => Equals to formControlName
	 * @param validationType: string => Equals to valitors name
	 */
	isControlHasError(controlName: string, validationType: string): boolean {
		const control = this.loginForm.controls[controlName];
		if (!control) {
			return false;
		}

		const result = control.hasError(validationType) && (control.dirty || control.touched);
		return result;
	}
}
