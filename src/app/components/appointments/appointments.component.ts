import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css'
})
export class AppointmentsComponent {
  appointments = [
    { id: 1, patient: 'John Doe', doctor: 'Dr. Smith', date: '2025-03-10', time: '10:00 AM', status: 'Confirmed' },
    { id: 2, patient: 'Jane Smith', doctor: 'Dr. Johnson', date: '2025-03-12', time: '2:30 PM', status: 'Pending' },
    { id: 3, patient: 'Alice Brown', doctor: 'Dr. White', date: '2025-03-15', time: '11:15 AM', status: 'Confirmed' },
    { id: 4, patient: 'Bob Martin', doctor: 'Dr. Green', date: '2025-03-18', time: '4:00 PM', status: 'Pending' }
  ];

  constructor(private location: Location) {}

  viewAppointment(id: number) {
    console.log('Viewing appointment:', id);
  }

  goBack() {
    this.location.back(); // Navigate to the previous page
  }
}
