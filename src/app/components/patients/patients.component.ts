import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Location } from '@angular/common';
import { CommonserviceService } from '../../commonservice.service';
import { SearchFilterPipe } from "../../search-filter.pipe";

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, FormsModule, SearchFilterPipe,RouterModule],
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.css'
})
export class PatientsComponent {

  searchText: string = '';
  patients:any=[];
  selectedHospitalId: any | null = null;
  hospitals:any=[];
  msg: any;
  doctors: any=[];
  constructor( private router: Router, private location: Location, private service: CommonserviceService) {
    this.service.showHeader();
    this.getHospitalListById();
  }
  ngOnInit(): void {}
  getHospitalListById(){
    const id = localStorage.getItem('UserLoginId');
    console.log(id);
    this.service.getDoctorHospitalById(id).subscribe(
      (response:any)=>{
        console.log(response)
        this.hospitals = response.hospitalList;
        console.log(this.hospitals);
      },
      (error:any)=>{this.service.showError('Error',error)}
    )
  }
  fetchDoctors() {
    console.log("Fetching doctors for hospital ID:", this.selectedHospitalId);
  }
  fetchPatients(): void {
    const hospitalId = this.selectedHospitalId; // Example hospital ID
    const createdByUserId = undefined; // Use undefined or null instead of an empty string

    this.service.getPatients(hospitalId, createdByUserId).subscribe({
      next: (data) => {
        this.patients = data.data;
        console.log('Patients fetched:', data);
      },
      error: (error) => {
        console.error('Error fetching patients:', error);
      }
    });
  }


  viewPatient(id: number) {
    this.router.navigate(['/patients', id]);
  }
  goBack() {
    this.location.back(); // Go to the previous page
  }

  addAppointment(id: any) {
    this.router.navigate([`/appointments/${id}`]);
  }
  // filteredPatients() {
  //   return this.patients.filter(patient =>
  //     patient.name.toLowerCase().includes(this.searchText.toLowerCase())
  //   );
  // }
}
