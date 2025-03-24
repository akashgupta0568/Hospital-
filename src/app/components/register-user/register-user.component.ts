import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-register-user',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './register-user.component.html',
  styleUrl: './register-user.component.css'
})
export class RegisterUserComponent {
  user = {
    name: '',
    mobile: '',
    altMobile: '',
    age: null,
    address: '',
    email: '',
    password: '',
    registrationDate: '',
    feeAmount: null,
    userType: '',
    paymentMode: '',
    services: {
      pharmacy: false,
      labTest: false,
      consultation: false
    }
  };

  userExists = false;

  constructor(private router: Router, private location: Location) {}

  registerUser() {
    if (this.userExistsCheck(this.user.mobile)) {
      this.userExists = true;
    } else {
      alert('User registered successfully!');
      this.router.navigate(['/patients']); // Redirecting to patients list
    }
  }

  userExistsCheck(mobile: string): boolean {
    const existingUsers = ['9876543210', '1234567890'];
    return existingUsers.includes(mobile);
  }

 goBack() {
 this.location.back(); // Go to the previous page
 }
}
