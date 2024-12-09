import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  constructor(
    private userService: UserService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  errorExists = false;
  errorText = '';

  onSubmit(form: NgForm) {
    if (!this.userService.getUserByEmail(form.value.email)) {
      this.errorExists = false;

      let phoneNumber = form.value.phoneNumber;

      if (phoneNumber.charAt(0) === '0') {
        phoneNumber = phoneNumber.slice(1);
      }

      this.userService.registerUser(
        form.value.firstName,
        form.value.lastName,
        form.value.email,
        form.value.password,
        form.value.address,
        form.value.city,
        form.value.zipCode,
        phoneNumber
      );

      this.snackBar.open(
        'Registration successful! Welcome to ICR Pet Shop',
        'Close',
        { duration: 5000 }
      );

      this.router.navigate(['login']);
    } else {
      this.errorExists = true;
      this.errorText = 'This email is already taken';
    }
  }
}
