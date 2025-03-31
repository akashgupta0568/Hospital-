import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonserviceService } from '../../commonservice.service';
import { SearchFilterPipe } from "../../search-filter.pipe";

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, SearchFilterPipe],
  templateUrl: './doctors.component.html',
  styleUrl: './doctors.component.css'
})
export class DoctorsComponent {

  hospitals:any=[];
  selectedHospitalId:any;
  doctors:any=[] ;

  staffList = [
    { id: 1, name: 'Alice Brown', role: 'Nurse' },
    { id: 2, name: 'Bob Martin', role: 'Receptionist' }
  ];

  newDoctor = { name: '', hospital: '' };
  newStaff = { name: '', role: '' };

  doctorForm: FormGroup;
  showDoctorList = false;
searchText: any;
isEditing = false; // Flag to track edit mode
editingDoctorId: number | null = null; // Store doctor ID when editing
  msg: any;


  constructor(private router: Router,private location: Location,private fb: FormBuilder,private service:CommonserviceService) {
    this.service.showHeader();
    this.getHospitalListById();
    this.doctorForm = this.fb.group({
      doctorID: [{ value: '', disabled: true }], // Disabled field for ID
      name: ['', Validators.required],
      specialization: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]], // Ensures exactly 10 digits
      email: ['', [Validators.required, Validators.email]], // Email format validation
      hospitalID: ['', Validators.required], // Hospital must be selected
      consultationFee: ['', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]] // Allow numbers with up to 2 decimal places
    });
  }
  onSubmit() {
    if (this.doctorForm.valid) {
      console.log("Form Data:", this.doctorForm.value);
      console.log("Selected Hospital ID:", this.doctorForm.value.hospitalID);

      this.selectedHospitalId = this.doctorForm.value.hospitalID;
      const updateData={
        ...this.doctorForm.value,
        doctorID : this.editingDoctorId
      }
      console.log(updateData);
      if (this.isEditing && this.editingDoctorId) {
        // **Update Existing Doctor**
        this.service.updateDoctorById(this.editingDoctorId, updateData).subscribe(
          (response: any) => {
            console.log("Update Response:", response);
            this.service.showSuccess('Success', response.message);

            // Reset the form and exit edit mode
            this.doctorForm.reset({ hospitalID: '' });
            this.isEditing = false;
            this.editingDoctorId = null;
            this.showDoctorList = true;
            this.fetchDoctors(); // Refresh doctor list
          },
          (error) => {
            console.error("Update Error:", error);
            let errorMessage = error.error?.message || "Failed to update doctor!";
            this.service.showError('Error', errorMessage);
          }
        );
      } else {
        // **Add New Doctor**
        this.service.addDoctorByHospitalId(this.doctorForm.value).subscribe(
          (response: any) => {
            console.log("Add Response:", response);
            this.service.showSuccess('Success', response.message);
            // Reset the form after adding doctor
            this.doctorForm.reset({ hospitalID: '' });
            // this.fetchDoctors(); // Refresh doctor list
          },
          (error) => {
            console.error("Add Error:", error);
            let errorMessage = error.error?.message || "Something went wrong!";
            this.service.showError('Error', errorMessage);
          }
        );
      }
    } else {
      this.service.showError('Error', "Form is invalid");
    }
  }


  fetchDoctors() {
    console.log("Fetching doctors for hospital ID:", this.selectedHospitalId); // ✅ Debug Log

    if (!this.selectedHospitalId) {
      this.doctors = []; // Clear doctor list if no hospital is selected
      return;
    }

    this.service.getDoctorsByHospital(this.selectedHospitalId).subscribe(
      (response: any) => {
        console.log("API Response:", response);
        this.doctors = response.data;
        this.msg= response.message;
        // this.service.showInfo('Information', response.message);
      },
      (error: any) => {
        console.error('Error fetching doctors:', error);
        this.selectedHospitalId = ''; // Reset ID if error occurs
      }
    );
  }
  editDoctor(id:any){
    alert(id);
    this.isEditing=true;
    this.editingDoctorId =id;
    this.service.getDoctorByID(id).subscribe(
      (response:any)=>{
        this.doctorForm.patchValue(response);
        this.showDoctorList=false;
        console.log(response);
      },
      (error:any)=>{
        console.log(error);
      }
    )
  }

  // View doctor details
  viewDoctor(doctorId: number) {
    console.log('Viewing doctor:', doctorId);
    // Navigate or show doctor details
  }

  // addDoctor() {
  //   if (this.newDoctor.name && this.newDoctor.hospital) {
  //     const id = this.doctors.length + 1;
  //     this.doctors.push({ id, ...this.newDoctor });
  //     this.newDoctor = { name: '', hospital: '' };
  //   }
  // }

  addStaff() {
    if (this.newStaff.name && this.newStaff.role) {
      const id = this.staffList.length + 1;
      this.staffList.push({ id, ...this.newStaff });
      this.newStaff = { name: '', role: '' };
    }
  }

  // removeDoctor(id: number) {
  //   this.doctors = this.doctors.filter(this.doctor =>  == id);
  // }

  removeStaff(id: number) {
    this.staffList = this.staffList.filter(staff => staff.id !== id);
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']); // Update with correct route if needed
  }
  goBack() {
    this.location.back(); // Go to the previous page
  }
  toggleDoctorList() {
    this.showDoctorList = !this.showDoctorList;
    this.selectedHospitalId ='';
  }
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
  navigateToHospital() {
    this.router.navigate(['add-hospital']); // Update the path as per your routing
  }
}
