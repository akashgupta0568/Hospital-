import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonserviceService } from '../../commonservice.service';
import { Router, RouterModule } from '@angular/router';
import { SearchFilterPipe } from '../../search-filter.pipe';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-appointment-checked-list',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterModule,SearchFilterPipe],
  templateUrl: './appointment-checked-list.component.html',
  styleUrl: './appointment-checked-list.component.css'
})
export class AppointmentCheckedListComponent {
  hospitals: any[] = [];
  doctors: any[] = [];
  selectedHospitalId: any = null;
  selectedDoctorId: any = null ;
  searchText: string = '';
  appointments: any[] = []; // Store all appointments
  filteredAppointments: any[] = []; // Store filtered appointments
  fromDate: string = '';
  toDate: string = '';
  selectedDoctorDetails: any;
  todayDate: string = '';
  constructor(
    private appointmentService: CommonserviceService,
    private hospitalService: CommonserviceService,
    private doctorService: CommonserviceService,
    private router: Router,
    private messageservice: MessageService
  ) {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset()); // Adjust for timezone
    this.todayDate = today.toISOString().split('T')[0];
    this.toDate = this.todayDate;
    this.fromDate = new Date().toISOString().split('T')[0];
    // this.fromDate = this.todayDate;
    // alert(this.todayDate);
    this.appointmentService.showHeader();

  }

  ngOnInit(): void {
    this.loadHospitals();
  }
  getTotalConsultationFee(): number {
    return this.appointments.reduce((total, appointment) => total + (appointment.consultationFee || 0), 0);
  }

  getTotalAmount(): number {
    return this.appointments.reduce((total, appointment) => total + (appointment.amount || 0), 0);
  }

  loadHospitals() {
    let userId = localStorage.getItem('UserLoginId');
    this.appointmentService.getHospitalsByCreatedBy(userId).subscribe(
      (response: any) => {
        this.hospitals = response.hospitalList ?? response;
        console.log(this.hospitals);
      },
      (error:any) => {
        this.appointmentService.showError("Error fetching hospitals:", error);
      }
    );
  }

  fetchDoctors() {
    console.log("Fetching doctors for hospital ID:", this.selectedHospitalId);

    if (!this.selectedHospitalId) {
      this.doctors = [];
      return;
    }

    this.appointmentService.getDoctorsByHospital(this.selectedHospitalId).subscribe(
      (response: any) => {
        console.log("API Response:", response);
        this.doctors = response.data;
        // this.msg= response.message;
        this.appointmentService.showInfo('Information', response.message);
      },
      (error: any) => {
        console.error('Error fetching doctors:', error);
        this.selectedHospitalId = ''; // Reset ID if error occurs
      }
    );
  }

  loadAppointments() {
    const payload = {
      hospitalId: Number(this.selectedHospitalId),
      doctorId: Number(this.selectedDoctorId),
      fromDate: this.fromDate ? new Date(this.fromDate).toISOString() : null,
      toDate: this.toDate ? new Date(this.toDate).toISOString() : null
    };
    console.log("Payload for fetching appointments:", payload);
    this.appointmentService.getAppointments(payload)
      .subscribe({
        next: (res:any) => {
          console.log("Appointments data:", res);
            this.appointments = res.data;
            console.log("Filtered Appointments:", this.appointments);

        },
        error: (error:any) => {
          console.error('Error fetching appointments:', error);
        }
      });
  }

  fetchAppointments() {
    this.fetchDoctors();
  }

  selectedDoctor(event: any) {
    this.selectedDoctorId = Number(event.target.value);
    this.selectedDoctorDetails = this.doctors.find(doc => doc.id === this.selectedDoctorId) || null;
    console.log(this.selectedDoctorDetails);
    console.log(this.selectedDoctorId);
  }

  filterAppointments() {
    this.filteredAppointments = this.appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.appointmentDate);
      const from = this.fromDate ? new Date(this.fromDate) : null;
      const to = this.toDate ? new Date(this.toDate) : null;

      return (!from || appointmentDate >= from) && (!to || appointmentDate <= to);
    });
  }

  // Navigate Back
  goBack() {
    this.router.navigate(['/home']);
  }

  exportToExcel() {
    if (!this.selectedHospitalId || !this.selectedDoctorId) {
      // this.appointmentService.showError('Error','Please select a hospital and doctor before downloading.');
      this.messageservice.add({ severity: 'error', summary: 'Error', detail: 'Please select a hospital and doctor before downloading.' });
      return;
    }
    const requestData = {
      hospitalId: Number(this.selectedHospitalId),
      doctorId: Number(this.selectedDoctorId),
      fromDate: this.fromDate ? new Date(this.fromDate).toISOString() : null,
      toDate: this.toDate ? new Date(this.toDate).toISOString() : null
    };
    console.log("Request data for downloading Excel:", requestData);

    this.appointmentService.downloadAppointments(requestData)
      .subscribe(blob => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'Appointments.xlsx';
        a.click();
        URL.revokeObjectURL(a.href);
      });
      this.messageservice.add({ severity: 'success', summary: 'Success', detail: 'Excel file downloaded successfully.' });
  }

  // View Appointment Details
  viewAppointment(appointmentID: number) {
    this.router.navigate(['/appointments/details', appointmentID]);
  }

  // Mark Appointment as Checked
  markChecked(appointmentID: number) {
    alert('Marking appointment as checked...');
    // this.appointmentService.markAsChecked(appointmentID).subscribe(
    //   (respons:any) => {
    //     alert('Appointment marked as checked');
    //     this.fetchAppointments(); // Refresh the list
    //   },
    //   (error:any) => {
    //     console.error('Error updating appointment status', error);
    //   }
    // );
  }
}
