import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hospital',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './hospital.component.html',
  styleUrl: './hospital.component.css'
})
export class HospitalComponent {
  newHospital = {
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phoneNumber: '',
    email: '',
    licenseNumber: ''
  };
  showModal: boolean= false;

  constructor(private router:Router){}
  addHospital() {
    console.log('Adding hospital:', this.newHospital);
    // this.router.navigate(['/add-hospital']);
    // API call to save hospital
  }

  closeModal() {
    this.showModal = false;  // Make sure the variable controlling modal visibility is set to false
  }

  LoginPage(){
    this.router.navigate(['/login']);
  }

}
