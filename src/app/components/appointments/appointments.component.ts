import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SearchFilterPipe } from "../../search-filter.pipe";
import { CommonserviceService } from '../../commonservice.service';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [FormsModule, CommonModule, SearchFilterPipe, ReactiveFormsModule, CalendarModule, DropdownModule],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css'
})
export class AppointmentsComponent implements OnInit {
  appointmentForm: FormGroup;
  isEditing = false;
  showAppointmentList = false;

  genderOptions = ['Male', 'Female', 'Other'];
  statusOptions = ['Confirmed', 'Pending', 'Cancelled'];

  hospitals: any[] = [];
  doctors: any[] = [];
  patients: any[] = [];

  appointments = [
    { id: 1, name: 'John Doe', phone: '9876543210', email: 'john@example.com', gender: 'Male', age: 30, hospitalID: 'H001', appointmentDate: '2025-03-10', appointmentTime: '10:00 AM', status: 'Confirmed', patientID: 'P001', doctorID: 'D001' }
  ];
  hospitalId: any;
  selectedHospitalId: any;
  selectedDoctorId: any | null = null;
  msg: any;
  minDate = new Date().toISOString().split('T')[0];
  currentTime:any;

  constructor(private fb: FormBuilder, private appointmentService: CommonserviceService, private location: Location, private route: ActivatedRoute) {
    this.minDate = new Date().toISOString().split('T')[0];
    this.currentTime = this.getCurrentTime();
    this.appointmentService.showHeader();
    this.appointmentForm = this.fb.group({
      patientID: [''],  // Patient ID (optional, usually non-editable)
      hospitalID: ['', Validators.required],
      name: ['', Validators.required],
      FatherHusbandName:['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: [''],  // Email is NOT required
      gender: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(1), Validators.max(120)]],
      dateOfBirth: [''], // Date of Birth (Required)
      createdAt: [''],  // Created At (Read-only, NOT required)
      doctorID: ['', Validators.required],
      appointmentDate: [this.minDate, Validators.required], // Appointment Date
      appointmentTime:[this.currentTime,Validators.required],
      appointmentFee: ['', [Validators.required, Validators.min(0)]], // Appointment Fee (Non-negative)
      paymentMethod: ['', Validators.required],
      status: ['', Validators.required] // Status (Scheduled, Completed, Cancelled)
    });


    this.loadHospitals();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const appointmentId = params.get('id');
      if (appointmentId) {
      //   this.isEditing = true;
      //   this.loadAppointmentDetails(appointmentId);
      // } else {
      //   this.isEditing = false;
      // }
      alert(appointmentId);
      this.fetchPatientByID(Number(appointmentId));
      }
    });

    // this.loadDoctors();
    // this.loadPatients();
  }
   getCurrentTime(): string {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
  loadHospitals() {
    let userId = localStorage.getItem('UserLoginId');
    this.appointmentService.getHospitalsByCreatedBy(userId).subscribe(
      (response: any) => {
        this.hospitals = response.hospitalList ?? response;
        console.log(this.hospitals);
      },
      (error) => {
        this.appointmentService.showError("Error fetching hospitals:", error);
      }
    );
  }
  fetchPatientByID(patientId: number): void {
    this.appointmentService.getPatientByID(patientId).subscribe({
      next: (response: any) => {
        console.log(response);
        if (!response) return;

        // Find the matching hospital ID
        const selectedHospital = this.hospitals.find(h => h.hospitalID === response.hospitalID);

        // Patch form values in one line
        this.appointmentForm.patchValue({
          ...response,
          hospitalID: selectedHospital?.hospitalID || ''
        });
      this.selectedHospitalId = selectedHospital?.hospitalID || ''
      this.fetchDoctors();
      },
      error: console.error
    });
  }


  onHospitalChange(event: any) {
    this.selectedHospitalId = Number(event.target.value); // Get selected hospital ID
    console.log(this.selectedHospitalId);
    this.appointmentForm.patchValue({ doctorID: '' });
    // console.log('Selected Hospital:', this.selectedHospital);
    this.fetchDoctors()
  }

  fetchDoctors() {
    console.log("Fetching doctors for hospital ID:", this.selectedHospitalId); // ✅ Debug Log

    if (!this.selectedHospitalId) {
      this.doctors = []; // Clear doctor list if no hospital is selected
      return;
    }

    this.appointmentService.getDoctorsByHospital(this.selectedHospitalId).subscribe(
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


  loadDoctors() {
    // this.appointmentService.getDoctors().subscribe(data => {
    //   this.doctors = data;
    // });
  }

  loadPatients() {
    this.appointmentService.getPatients().subscribe(data => {
      this.patients = data;
    });
  }
  onSubmit() {
    if (this.appointmentForm.valid) {
      let appointmentData = this.appointmentForm.value; // Get form values

      // Manually add required fields and format data correctly
      let finalData = {
        patientID: appointmentData.patientID || 0,  // Default to 0 if empty
        fullName: appointmentData.name || '', // Use name if fullName is missing
        name: appointmentData.name || '',
        fatherHusbandName: appointmentData.FatherHusbandName || '',
        age: appointmentData.age || null,
        gender: appointmentData.gender || '',
        dateOfBirth: appointmentData.dateOfBirth
          ? new Date(appointmentData.dateOfBirth).toISOString()
          : null, // Ensure valid format
        phoneNumber: appointmentData.phone || '',  // ✅ Match API key (phoneNumber)
        email: appointmentData.email || '',
        hospitalID: appointmentData.hospitalID ? Number(appointmentData.hospitalID) : 0,
        hospitalUserByID: appointmentData.hospitalUserByID || 1,
        doctorID: appointmentData.doctorID ? Number(appointmentData.doctorID) : 0,
        appointmentDate: appointmentData.appointmentDate || '',
        appointmentTime: appointmentData.appointmentTime || '', // Default if missing
        appointmentFee: appointmentData.appointmentFee ? Number(appointmentData.appointmentFee) : 0,
        paymentMethod: appointmentData.paymentMethod || '',
        status: appointmentData.status || 'Scheduled',
        transactionID: appointmentData.transactionID || '12345ABC', // Default value
        createdAt: new Date().toISOString() // Set current timestamp
      };

      console.log('Submitting appointment:', finalData);

      this.appointmentService.addAppointmentAndPayment(finalData).subscribe(
        response => {
          console.log('Appointment and Payment Successful!', response);
          alert(this.isEditing ? 'Appointment updated successfully!' : 'Appointment created successfully!');

          // Reset form properly
          this.appointmentForm.reset();

          // Ensure dropdowns remain empty
          this.appointmentForm.patchValue({
            hospitalID: '',
            gender: ''
          });

          this.isEditing = false;
        },
        error => {
          console.error('Error:', error);
          alert('Failed to submit appointment!');
        }
      );
    } else {
      alert('Please fill in all required fields.');
    }
  }



  bookAppointment() {

  }

  editAppointment(appointmentId: number) {
    const appointment = this.appointments.find(a => a.id === appointmentId);
    if (appointment) {
      this.isEditing = true;
      this.appointmentForm.patchValue(appointment);
    }
  }

  toggleAppointmentList() {
    this.showAppointmentList = !this.showAppointmentList;
  }
  openTimePicker(input: HTMLInputElement) {
    input.showPicker(); // Opens the time picker
  }

  goBack() {
    this.location.back();
  }
}
