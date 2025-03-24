import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './billing.component.html',
  styleUrl: './billing.component.css'
})
export class BillingComponent {
  bills = [
    { id: 'INV-001', patientName: 'John Doe', amount: 150.0, status: 'Paid' },
    { id: 'INV-002', patientName: 'Jane Smith', amount: 220.5, status: 'Pending' },
    { id: 'INV-003', patientName: 'Alice Brown', amount: 175.0, status: 'Paid' },
    { id: 'INV-004', patientName: 'Bob Martin', amount: 200.0, status: 'Pending' }
  ];

  constructor( private router: Router, private location: Location) {}

  viewBill(id: string) {
    console.log('Viewing bill:', id);
  }

  goBack() {
    this.location.back(); // Go to the previous page
  }
}
