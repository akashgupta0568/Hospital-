import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-prescriptions',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './prescriptions.component.html',
  styleUrl: './prescriptions.component.css'
})
export class PrescriptionsComponent {

  prescriptions = [
    { id: 1, patient: 'John Doe', medicine: 'Paracetamol', dosage: '500mg' },
    { id: 2, patient: 'Jane Smith', medicine: 'Amoxicillin', dosage: '250mg' }
  ];

  newPrescription = { patient: '', medicine: '', dosage: '' };

  constructor(private router: Router, private location: Location) {}

  addPrescription() {
    if (this.newPrescription.patient && this.newPrescription.medicine && this.newPrescription.dosage) {
      const id = this.prescriptions.length + 1;
      this.prescriptions.push({ id, ...this.newPrescription });
      this.newPrescription = { patient: '', medicine: '', dosage: '' };
    }
  }

  removePrescription(id: number) {
    this.prescriptions = this.prescriptions.filter(p => p.id !== id);
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']); // Update with correct route if needed
  }

  goBack() {
    this.location.back(); // Go to the previous page
  }
}
