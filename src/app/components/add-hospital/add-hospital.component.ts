import { Component } from '@angular/core';
import { CommonserviceService } from '../../commonservice.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-add-hospital',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AccordionModule, ButtonModule],
  templateUrl: './add-hospital.component.html',
  styleUrl: './add-hospital.component.css'
})
export class AddHospitalComponent {
  hospitalForm: FormGroup;
  hospitals: any[] = [];
  AddHospitalList: boolean = false;
  editForm: boolean = false;
  selectedHospitalId: string | null = null;  // ✅ Fix update issue

  constructor(private fb: FormBuilder, private router: Router, private service: CommonserviceService) {
    this.service.showHeader();
    this.hospitalForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern('^[0-9]{5,6}$')]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      licenseNumber: ['', [Validators.required, Validators.minLength(5)]]
    });
    this.GetHospitalsById();
  }

  toggleHospital(hospital: any) {
    hospital.expanded = !hospital.expanded;
  }

  addHospital() {
    if (this.hospitalForm.valid) {
      const createdBy = localStorage.getItem('UserLoginId');
      const hospitalData = {
        ...this.hospitalForm.value,
        createdBy: createdBy || 'Unknown'
      };

      this.service.addHospital(hospitalData).subscribe(
        () => {
          this.service.showSuccess('Success', 'Hospital added successfully!');
          this.hospitalForm.reset();
          this.GetHospitalsById();
        },
        (error) => {
          this.service.showError('Error', 'Failed to add hospital.');
        }
      );
    } else {
      this.service.showError('Error', 'Please fill all fields correctly.');
    }
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  plusHospital() {
    this.AddHospitalList = !this.AddHospitalList;
    this.editForm = false; // ✅ Ensure reset to Add mode
    this.hospitalForm.reset();
  }

  GetHospitalsById() {
    let userId = localStorage.getItem('UserLoginId');
    this.service.getHospitalsByCreatedBy(userId).subscribe(
      (response: any) => {
        this.hospitals = response.hospitalList ?? response;
      },
      (error) => {
        this.service.showError("Error fetching hospitals:", error);
      }
    );
  }

  EditHospital(id: any) {
    this.service.getHospitalById(id).subscribe(
      (response: any) => {
        console.log(response);
        this.selectedHospitalId = id;  // ✅ Store ID for updating
        this.hospitalForm.patchValue(response);
        this.editForm = true;
        this.AddHospitalList = false;
      },
      (error) => {
        this.service.showError('Error', 'Failed to fetch hospital data.');
      }
    );
  }

updateHospital() {
  if (this.hospitalForm.invalid) return;

  const updatedData = {
    ...this.hospitalForm.value,
    hospitalID: this.selectedHospitalId,  // ✅ Ensure hospital ID is included
  };

  console.log(updatedData);

  this.service.updateHospital(this.selectedHospitalId, updatedData).subscribe(
    () => {
      this.service.showSuccess('Success', 'Hospital updated successfully!');
      this.editForm = false;
      this.hospitalForm.reset();
      this.GetHospitalsById();  // ✅ Correct function call to refresh list
      this.AddHospitalList = true;
    },
    (error: any) => {
      this.service.showError('Error', 'Failed to update hospital.');
    }
  );
}


  deleteHospital(id: any) {
    // if (confirm("Are you sure you want to delete this hospital?")) {
      // this.service.deleteHospital(id).subscribe(
      //   () => {
      //     this.service.showSuccess('Success', 'Hospital deleted successfully!');
      //     this.GetHospitalsById();
      //   },
      //   (error) => {
      //     this.service.showError('Error', 'Failed to delete hospital.');
      //   }
      // );

    // }
    this.service.showError('Delete','You can not perform this opertion')
  }
}
