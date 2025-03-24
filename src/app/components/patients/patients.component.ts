import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.css'
})
export class PatientsComponent {

  searchText: string = '';
  patients = [
    { id: 1, name: 'John Doe', age: 32, gender: 'Male' },
    { id: 2, name: 'Jane Smith', age: 45, gender: 'Female' },
    { id: 3, name: 'Alex Johnson', age: 29, gender: 'Male' },
    { id: 4, name: 'Maria Gonzalez', age: 37, gender: 'Female' },
  ];

  constructor( private router: Router, private location: Location) {}
  ngOnInit(): void {}

  viewPatient(id: number) {
    this.router.navigate(['/patients', id]);
  }
  goBack() {
    this.location.back(); // Go to the previous page
  }
  filteredPatients() {
    return this.patients.filter(patient =>
      patient.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
}
